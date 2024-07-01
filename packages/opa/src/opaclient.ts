import { OpaApiClient } from "./sdk/index.js";
import {
  type Input,
  type Result,
  type ResponsesSuccessfulPolicyResponse,
  type ServerError,
  BatchMixedResults,
  BatchSuccessfulPolicyEvaluation,
  SuccessfulPolicyResponse,
} from "./sdk/models/components/index.js";
import {
  ExecutePolicyWithInputResponse,
  ExecutePolicyResponse,
} from "./sdk/models/operations/index.js";
import { SDKError } from "./sdk/models/errors/sdkerror.js";
import { ServerError as ServerError_ } from "./sdk/models/errors/servererror.js";
import { SDKOptions } from "./lib/config.js";
import { HTTPClient } from "./lib/http.js";
import { RequestOptions as FetchOptions } from "./lib/sdks.js";

export type { Input, Result };

/**
 * Implement `ToInput` to declare how your provided input is to be converted
 * into the API request payload's "input".
 */
export interface ToInput {
  toInput(): Input;
}

function implementsToInput(object: any): object is ToInput {
  const u = object as ToInput;
  return u.toInput !== undefined && typeof u.toInput == "function";
}

/** Extra options for using the high-level SDK.
 */
export type Options = {
  headers?: Record<string, string>;
  sdk?: SDKOptions;
};

/** Extra per-request options for using the high-level SDK's
 * evaluate/evaluateDefault methods.
 */
export interface RequestOptions<Res> extends FetchOptions {
  fromResult?: (res?: Result) => Res;
}

/** Extra per-request options for using the high-level SDK's
 * evaluateBatch method.
 */
export interface BatchRequestOptions<Res> extends RequestOptions<Res> {
  rejectMixed?: boolean; // reject promise if the batch result is "mixed", i.e. if any of the items errored
  fallback?: boolean; // fall back to sequential evaluate calls if server doesn't support batch API
}

/** OPAClient is the starting point for using the high-level API.
 *
 * Use {@link OpaApiClient} if you need some low-level customization.
 */
export class OPAClient {
  private opa: OpaApiClient;
  private opaFallback: boolean = false;

  /** Create a new `OPA` instance.
   * @param serverURL - The OPA URL, e.g. `https://opa.internal.corp:8443/`.
   * @param opts - Extra options, including low-level `SDKOptions`.
   */
  constructor(serverURL: string, opts?: Options) {
    const sdk = { serverURL, ...opts?.sdk };
    if (opts?.headers) {
      const hdrs = opts.headers;
      const client = opts?.sdk?.httpClient ?? new HTTPClient();
      client.addHook("beforeRequest", (req) => {
        for (const k in hdrs) {
          req.headers.set(k, hdrs[k] as string);
        }
        return req;
      });
      sdk.httpClient = client;
    }
    this.opa = new OpaApiClient(sdk);
  }

  /** `evaluate` is used to evaluate the policy at the specified path with optional input.
   *
   * @param path - The path to the policy, without `/v1/data`: use `authz/allow` to evaluate policy `data.authz.allow`.
   * @param input - The input to the policy, if needed.
   * @param opts - Per-request options to control how the policy evaluation result is to be transformed
   * into `Res` (via `fromResult`), and low-level fetch options.
   */
  async evaluate<In extends Input | ToInput, Res>(
    path: string,
    input?: In,
    opts?: RequestOptions<Res>,
  ): Promise<Res> {
    let result: ExecutePolicyWithInputResponse | ExecutePolicyResponse;

    if (input === undefined) {
      result = await this.opa.executePolicy({ path }, opts);
    } else {
      let inp: Input;
      if (implementsToInput(input)) {
        inp = input.toInput();
      } else {
        inp = input;
      }
      result = await this.opa.executePolicyWithInput(
        {
          path,
          requestBody: { input: inp },
        },
        opts,
      );
    }
    if (!result.successfulPolicyResponse) throw `no result in API response`;

    const res = result.successfulPolicyResponse.result;
    const fromResult = opts?.fromResult || id<Res>;
    return fromResult(res);
  }

  /** `evaluateDefault` is used to evaluate the server's default policy with optional input.
   *
   * @param input - The input to the default policy, defaults to `{}`.
   * @param opts - Per-request options to control how the policy evaluation result is to be transformed
   * into `Res` (via `fromResult`), and low-level fetch options.
   */
  async evaluateDefault<In extends Input | ToInput, Res>(
    input?: In,
    opts?: RequestOptions<Res>,
  ): Promise<Res> {
    let inp = input ?? {};
    if (implementsToInput(inp)) {
      inp = inp.toInput();
    }
    const resp = await this.opa.executeDefaultPolicyWithInput(
      inp,
      undefined, // pretty
      undefined, // gzipEncoding
      opts,
    );
    if (!resp.result) throw `no result in API response`;

    const fromResult = opts?.fromResult || id<Res>;
    return fromResult(resp.result);
  }

  /** `evaluateBatch` is used to evaluate the policy at the specified path, for a batch of many inputs.
   *
   * @param path - The path to the policy, without `/v1/batch/data`: use `authz/allow` to evaluate policy `data.authz.allow`.
   * @param inputs - The inputs to the policy.
   * @param opts - Per-request options to control how the policy evaluation result is to be transformed
   * into `Res` (via `fromResult`), if any failures in the batch result should reject the promose (via
   * `rejectMixed`), and low-level fetch options.
   */
  async evaluateBatch<In extends Input | ToInput, Res>(
    path: string,
    inputs: { [k: string]: In },
    opts?: BatchRequestOptions<Res>,
  ): Promise<{ [k: string]: Res | ServerError }> {
    const inps = Object.fromEntries(
      Object.entries(inputs).map(([k, inp]) => [
        k,
        implementsToInput(inp) ? inp.toInput() : inp,
      ]),
    );
    let res: BatchMixedResults | BatchSuccessfulPolicyEvaluation | undefined;

    if (this.opaFallback && opts?.fallback) {
      // memoized fallback: we have hit a 404 here before
      const responses = await this.fallbackBatch(path, inps, opts);
      res = { responses };
    } else {
      try {
        const resp = await this.opa.executeBatchPolicyWithInput(
          { path, requestBody: { inputs: inps } },
          opts,
        );

        res = resp.batchMixedResults || resp.batchSuccessfulPolicyEvaluation;
      } catch (err) {
        if (
          err instanceof SDKError &&
          err.httpMeta.response.status == 404 &&
          opts?.fallback
        ) {
          this.opaFallback = true;
          const responses = await this.fallbackBatch(path, inps, opts);
          res = { responses };
        } else {
          throw err;
        }
      }
    }

    if (!res) throw `no result in API response`;

    const entries = [];
    for (const [k, v] of Object.entries(res?.responses ?? {})) {
      entries.push([k, await processResult(v, opts)]);
    }
    return Object.fromEntries(entries);
  }

  // run a sequence of evaluatePolicyWithInput(), via Promise.all/Promise.allSettled
  async fallbackBatch<Res>(
    path: string,
    inputs: { [k: string]: Input },
    opts?: BatchRequestOptions<Res>,
  ): Promise<{ [k: string]: ServerError | SuccessfulPolicyResponse }> {
    let items: [string, ServerError | SuccessfulPolicyResponse][];
    const keys = Object.keys(inputs);
    const ps = Object.values(inputs).map((input) =>
      this.opa
        .executePolicyWithInput({ path, requestBody: { input } })
        .then(({ successfulPolicyResponse: res }) => res),
    );
    if (opts?.rejectMixed) {
      items = await Promise.all(ps).then((results) =>
        results.map((result, i) => {
          if (!result) throw `no result in API response`;
          return [
            keys[i] as string, // can't be undefined
            result,
          ];
        }),
      );
    } else {
      const settled = await Promise.allSettled(ps).then((results) => {
        return results.map((res, i) => {
          if (res.status === "rejected") {
            return [
              keys[i],
              {
                ...(res.reason as ServerError_).data$,
                httpStatusCode: "500",
              },
            ] as [string, ServerError];
          }
          return [keys[i], res.value] as [string, SuccessfulPolicyResponse];
        });
      });
      items = settled;
    }
    return Object.fromEntries(items);
  }
}

function processResult<Res>(
  res: ResponsesSuccessfulPolicyResponse | ServerError,
  opts?: BatchRequestOptions<Res>,
): Promise<Res | ServerError> {
  if (res && "code" in res) {
    if (opts?.rejectMixed) return Promise.reject(res as ServerError);

    return Promise.resolve(res as ServerError);
  }

  const fromResult = opts?.fromResult || id<Res>;
  return Promise.resolve(fromResult(res.result));
}

function id<T>(x: any): T {
  return x as T;
}
