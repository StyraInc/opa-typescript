import { MaskRule, mask, ucastToPrisma } from "@styra/ucast-prisma";
import { SDKOptions } from "./lib/config.js";
import { HTTPClient } from "./lib/http.js";
import { RequestOptions as FetchOptions } from "./lib/sdks.js";
import {
  CompileQueryWithPartialEvaluationAcceptEnum,
  OpaApiClient,
} from "./sdk/index.js";
import {
  BatchMixedResults,
  BatchSuccessfulPolicyEvaluation,
  CompileOptions,
  CompileResultMultitargetResult,
  CompileResultSQLResult,
  CompileResultUCASTResult,
  TargetDialects,
  type Input,
  type Result,
  type ServerErrorWithStatusCode,
  type SuccessfulPolicyResponse,
} from "./sdk/models/components/index.js";
import { SDKError } from "./sdk/models/errors/sdkerror.js";
import { ServerError as ServerError_ } from "./sdk/models/errors/servererror.js";
import {
  CompileQueryWithPartialEvaluationResponse,
  ExecutePolicyResponse,
  ExecutePolicyWithInputResponse,
} from "./sdk/models/operations/index.js";

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
 * evaluation methods ({@link OPAClient.evaluate | evaluate},
 * {@link OPAClient.evaluateDefault | evaluateDefault}).
 */
export interface RequestOptions<Res> extends FetchOptions {
  /** fromResult allows you to provide a function to convert the generic `Result` type into another type
   *
   * @example Convert a  response to boolean
   * Assuming that your policy evaluates to an object like `{"allowed": true}`,
   * this `fromResult` function would let you convert it to a boolean:
   *
   * ```ts
   * const res = await new OPAClient(serverURL).evaluate<any, boolean>(
   *   "policy/result",
   *   { action: "read" },
   *   {
   *     fromResult: (r?: Result) => (r as Record<string, any>)["allowed"] ?? false,
   *   },
   * );
   * ```
   */
  fromResult?: (res?: Result) => Res;
}

/** Extra per-request options for using the high-level SDK's
 * filter method ({@link OPAClient.getFilters | getFilters }.
 */
export interface FiltersRequestOptions extends FiltersOptions {
  /**
   * The compilation target for translating a policy into queries. Optional if TargetOptions are provided.
   */
  target?: Target;
  /*
   * Table and column name mappings for the translation.
   */
  tableMappings?: Record<string, Record<string, string>>;
}

/**
 * Per-target options for translating a policy into Prisma query conditions and an adapted mask function.
 */
export interface PrismaOptions {
  /**
   * The primary table of the Prisma query, used for translation and masking.
   */
  primary: PrismaPrimary;
}

type PrismaPrimary = string;

/** Per-request options for using the high-level SDK's
 * filter method {@link OPAClient.getMultipleFilters | getMultipleFilters }.
 */
export interface MultipleFiltersRequestOptions extends FiltersOptions {
  /**
   * The compilation targets for translating a policy into queries.
   */
  targets: Exclude<Target, "multi">[];
  /*
   * Table and column name mappings for the translation, keyed by target.
   */
  tableMappings?: Partial<
    Record<Exclude<Target, "multi">, Record<string, Record<string, string>>>
  >;
}

/** Common extra per-request options for using the high-level SDK's
 * filter methods ({@link OPAClient.getFilters | getFilters } and
 * {@link OPAClient.getMultipleFilters | getMultipleFilters }.
 */
export interface FiltersOptions extends FetchOptions {
  /**
   * Low-level compilation options.
   */
  compileOptions?: CompileOptions;
  /**
   * The unknowns for partial evaluation of the policy in the translation process.
   * Optional if provided via policy metadata.
   *
   * @example ["input.users", "input.fruits"]
   */
  unknowns?: string[];
}

export type Filters = {
  query?: string | Record<string, any> | undefined;
  masks?: { [k: string]: any } | undefined;
};

export type PrismaMask = {
  mask<T extends Record<string, any>>(obj: T): T;
};

export type MultipleFilters = {
  targets?: Record<Exclude<Target, "multi">, Filters>;
};

/**
 * Target represents the known targets of translation.
 */
export type Target = keyof typeof CompileTargets;

/**
 * SingleTarget is a convenience type, representing all known targets of translation, except "multi".
 */
export type SingleTarget = Exclude<Target, "multi">;

/**
 * TargetOptions encodes extra translation options for each target.
 */
export type TargetOptions = Record<"ucastPrisma", PrismaOptions>; // | Record<"ucastMinimal", MinimalOptions>, etc

const CompileTargets = {
  multi:
    CompileQueryWithPartialEvaluationAcceptEnum.applicationVndStyraMultitargetPlusJson,
  mysql:
    CompileQueryWithPartialEvaluationAcceptEnum.applicationVndStyraSqlMysqlPlusJson,
  postgresql:
    CompileQueryWithPartialEvaluationAcceptEnum.applicationVndStyraSqlPostgresqlPlusJson,
  sqlserver:
    CompileQueryWithPartialEvaluationAcceptEnum.applicationVndStyraSqlSqlserverPlusJson,
  sqlite:
    CompileQueryWithPartialEvaluationAcceptEnum.applicationVndStyraSqlSqlitePlusJson,
  ucastALL:
    CompileQueryWithPartialEvaluationAcceptEnum.applicationVndStyraUcastAllPlusJson,
  ucastLinq:
    CompileQueryWithPartialEvaluationAcceptEnum.applicationVndStyraUcastLinqPlusJson,
  ucastMinimal:
    CompileQueryWithPartialEvaluationAcceptEnum.applicationVndStyraUcastMinimalPlusJson,
  ucastPrisma:
    CompileQueryWithPartialEvaluationAcceptEnum.applicationVndStyraUcastPrismaPlusJson,
} as const;

const shortNameMap: Record<SingleTarget, TargetDialects> = {
  mysql: TargetDialects.SqlPlusMysql,
  postgresql: TargetDialects.SqlPlusPostgresql,
  sqlserver: TargetDialects.SqlPlusSqlserver,
  sqlite: TargetDialects.SqlPlusSqlite,
  ucastALL: TargetDialects.UcastPlusAll,
  ucastLinq: TargetDialects.UcastPlusLinq,
  ucastMinimal: TargetDialects.UcastPlusMinimal,
  ucastPrisma: TargetDialects.UcastPlusPrisma,
};

/** Extra per-request options for using the high-level SDK's
 * evaluateBatch method.
 */
export interface BatchRequestOptions<Res> extends RequestOptions<Res> {
  /** With `rejectMixed` set, a batch result that contains _any errors_ causes a `Promise` rejection. */
  rejectMixed?: boolean;
  /** Fall back to sequential evaluate calls if server doesn't support batch API. */
  fallback?: boolean;
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
    opts?: RequestOptions<Res>
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
        opts
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
    opts?: RequestOptions<Res>
  ): Promise<Res> {
    let inp = input ?? {};
    if (implementsToInput(inp)) {
      inp = inp.toInput();
    }
    const resp = await this.opa.executeDefaultPolicyWithInput(
      inp,
      undefined, // pretty
      undefined, // gzipEncoding
      opts
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
    opts?: BatchRequestOptions<Res>
  ): Promise<{ [k: string]: Res | ServerErrorWithStatusCode }> {
    const inps = Object.fromEntries(
      Object.entries(inputs).map(([k, inp]) => [
        k,
        implementsToInput(inp) ? inp.toInput() : inp,
      ])
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
          opts
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
    opts?: BatchRequestOptions<Res>
  ): Promise<{
    [k: string]: ServerErrorWithStatusCode | SuccessfulPolicyResponse;
  }> {
    let items: [string, ServerErrorWithStatusCode | SuccessfulPolicyResponse][];
    const keys = Object.keys(inputs);
    const ps = Object.values(inputs).map((input) =>
      this.opa
        .executePolicyWithInput({ path, requestBody: { input } })
        .then(({ successfulPolicyResponse: res }) => res)
    );
    if (opts?.rejectMixed) {
      items = await Promise.all(ps).then((results) =>
        results.map((result, i) => {
          if (!result) throw `no result in API response`;
          return [
            keys[i] as string, // can't be undefined
            result,
          ];
        })
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
            ] as [string, ServerErrorWithStatusCode];
          }
          return [keys[i], res.value] as [string, SuccessfulPolicyResponse];
        });
      });
      items = settled;
    }
    return Object.fromEntries(items);
  }

  /** `getFilters` is used to translate the policy at the specified path into query filters of
   * the desired target type, with optional input.
   * Returns a promise that resolves to an object containing the query filters (key `query`) and optional masks (key `masks`).
   *
   * @param path - The path to the policy, without `/v1/compile`: use `filters/include` to translate the policy `data.filters.include`.
   * @param input - The input to the policy, if needed.
   * @param opts - Per-request options to control how the policy is translated into query filters, and low-level fetch options.
   */
  async getFilters<In extends Input | ToInput>(
    path: string,
    input?: In,
    opts?: (FiltersRequestOptions & Partial<TargetOptions>) | PrismaPrimary
  ): Promise<Filters> {
    let inp: Input | undefined = undefined;
    if (input !== undefined) {
      if (implementsToInput(input)) {
        inp = input.toInput();
      } else {
        inp = input;
      }
    }
    // Special shortcut for prisma usage, "getFilters(path, input, primary)"
    if (typeof opts === "string") {
      opts = { ucastPrisma: { primary: opts } };
    }
    let target = opts?.target;
    if (opts && "ucastPrisma" in opts) {
      target = "ucastPrisma";
    }
    if (!target) {
      throw new Error("target option is required");
    }
    if (target === "multi") {
      throw new Error("multi target is not supported (use getMultipleFilters)");
    }
    const targetSQLTableMappings: Record<
      string,
      Record<string, Record<string, string>>
    > = {};
    if (opts?.tableMappings) {
      const key = shortNameMap[target].split("+")[1];
      targetSQLTableMappings[key as string] = opts.tableMappings;
    }
    const res = await this.opa.compileQueryWithPartialEvaluation(
      {
        path,
        requestBody: {
          input: inp,
          options: {
            targetSQLTableMappings,
            ...opts?.compileOptions,
          },
          unknowns: opts?.unknowns,
        },
      },
      { ...opts?.fetchOptions, acceptHeaderOverride: CompileTargets[target] }
    );
    return byTarget(
      res,
      target,
      target == "ucastPrisma" ? opts?.[target] : undefined
    ) as Filters;
  }

  /** `getMultipleFilters` is used to translate the policy at the specified path into query filters of
   * the multiple target types in one request, with optional input.
   * Returns a promise that resolves to an object containing the query filters (key `query`) and optional masks (key `masks`) _for each requested target_.
   *
   * @param path - The path to the policy, without `/v1/compile`: use `filters/include` to translate the policy `data.filters.include`.
   * @param input - The input to the policy, if needed.
   * @param opts - Per-request options to control how the policy is translated into query filters, and low-level fetch options.
   */
  async getMultipleFilters<In extends Input | ToInput>(
    path: string,
    input?: In,
    opts?: MultipleFiltersRequestOptions
  ): Promise<MultipleFilters> {
    let inp: Input | undefined = undefined;
    if (input !== undefined) {
      if (implementsToInput(input)) {
        inp = input.toInput();
      } else {
        inp = input;
      }
    }
    const targets = opts?.targets;
    if (!targets) {
      throw new Error("targets option is required");
    }
    const targetDialects = opts?.targets.map((t) => shortNameMap[t]);
    const targetSQLTableMappings = opts?.tableMappings;

    const res = await this.opa.compileQueryWithPartialEvaluation(
      {
        path,
        requestBody: {
          input: inp,
          options: {
            targetDialects,
            targetSQLTableMappings,
            ...opts?.compileOptions,
          },
          unknowns: opts?.unknowns,
        },
      },
      {
        ...opts.fetchOptions,
        acceptHeaderOverride: CompileTargets["multi"],
      }
    );
    return byTarget(res, "multi") as MultipleFilters;
  }
}

function processResult<Res>(
  res: SuccessfulPolicyResponse | ServerErrorWithStatusCode,
  opts?: BatchRequestOptions<Res>
): Promise<Res | ServerErrorWithStatusCode> {
  if (res && "code" in res) {
    if (opts?.rejectMixed)
      return Promise.reject(res as ServerErrorWithStatusCode);

    return Promise.resolve(res as ServerErrorWithStatusCode);
  }

  const fromResult = opts?.fromResult || id<Res>;
  return Promise.resolve(fromResult(res.result));
}

function id<T>(x: any): T {
  return x as T;
}

async function byTarget(
  res: CompileQueryWithPartialEvaluationResponse,
  target: Target,
  opts?: PrismaOptions
): Promise<(Filters & Partial<PrismaMask>) | MultipleFilters> {
  const result:
    | undefined
    | CompileResultSQLResult
    | CompileResultUCASTResult
    | CompileResultMultitargetResult = res[targetType(target)]?.result;
  if (!result) throw new Error(`No result for target ${target}`);

  if (target === "ucastPrisma") {
    if (!opts) throw new Error(`Missing options for target ${target}`);

    const { query, masks } = result as CompileResultUCASTResult;
    const { primary } = opts;
    const mask = optionalPrismaMask(
      primary,
      masks as Record<string, MaskRule | Record<string, MaskRule>>
    );
    return {
      masks,
      query: ucastToPrisma(query as Record<string, any>, primary),
      mask,
    };
  }

  if (target === "multi") {
    return result.additionalProperties as MultipleFilters;
  }
  return result as Filters;
}

function optionalPrismaMask(
  primary: string,
  masks: Record<string, MaskRule | Record<string, MaskRule>> | undefined
) {
  if (!masks) {
    return function <T extends Record<string, any>>(obj: T): T {
      return obj;
    };
  }
  return function <T extends Record<string, any>>(obj: T): T {
    return mask(masks, obj, primary);
  };
}

function targetType(
  t: Target
): Exclude<
  keyof CompileQueryWithPartialEvaluationResponse,
  "httpMeta" | "compileResultJSON"
> {
  switch (t) {
    case "multi":
      return "compileResultMultitarget";
    case "postgresql":
    case "mysql":
    case "sqlserver":
    case "sqlite":
      return "compileResultSQL";
    case "ucastALL":
    case "ucastPrisma":
    case "ucastLinq":
    case "ucastMinimal":
      return "compileResultUCAST";
    default:
      throw new Error(`Unknown target type: ${t}`);
  }
}
