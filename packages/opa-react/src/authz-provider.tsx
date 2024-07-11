import * as React from "react";
import {
  type PropsWithChildren,
  createContext,
  useCallback,
  useMemo,
} from "react";
import { QueryClient, QueryFunctionContext } from "@tanstack/react-query";
import {
  type Input,
  type Result,
  type ToInput,
  type RequestOptions,
  type BatchRequestOptions,
} from "@styra/opa";
import { type ServerError } from "@styra/opa/sdk/models/components";
import { create, windowScheduler } from "@yornaath/batshit";

type EvalQuery = {
  path: string | undefined;
  input: Input | undefined;
  fromResult: ((_?: Result) => boolean) | undefined;
};

function key({ path, input }: EvalQuery): string {
  return stringify({ path, input }); // Note: omit fromResult
}

const evals = (sdk: OPAClient) =>
  create({
    fetcher: async (evals: EvalQuery[]) => {
      const evs = evals.map((x) => ({ ...x, k: key(x) }));
      const groups = Object.groupBy(evs, ({ path }) => path); // group by path
      return Promise.all(
        Object.entries(groups).map(([path, inputs]) => {
          const inps: Record<string, Input> = {};
          const fromRs: Record<string, (_?: Result) => boolean> = {};
          inputs.forEach(({ k, input, fromResult }) => {
            inps[k] = input;
            fromRs[k] = fromResult;
          });
          return sdk
            .evaluateBatch(path, inps, { rejectMixed: true })
            .then((res) =>
              Object.fromEntries(
                Object.entries(res).map(([k, res]) => [
                  k,
                  fromRs[k] ? fromRs[k](res) : res,
                ]),
              ),
            );
        }),
      ).then((all: object[]) => all.reduce((acc, n) => ({ ...acc, ...n }), {})); // combine result arrays of objects
    },
    resolver: (results, query) => results[key(query)] ?? null,
    scheduler: windowScheduler(10),
    name: "@styra/opa-react",
  });

/** Abstracts the methods that are used from `OPAClient` of `@styra/opa`. */
export interface OPAClient {
  /** Evaluate a policy at `path`, with optional `input` and `RequestOptions`. */
  evaluate<In extends Input | ToInput, Res>(
    path: string,
    input?: In,
    opts?: RequestOptions<Res>,
  ): Promise<Res>;

  /** Evaluate the server's default policy, with optional `input` and `RequestOptions`. */
  evaluateDefault<In extends Input | ToInput, Res>(
    input?: In,
    opts?: RequestOptions<Res>,
  ): Promise<Res>;

  /** Evaluate a policy against a batch of inputs. */
  evaluateBatch<In extends Input | ToInput, Res>(
    path: string,
    inputs: { [k: string]: In },
    opts?: BatchRequestOptions<Res>,
  ): Promise<{ [k: string]: Res | ServerError }>;
}

export type AuthzProviderContext = {
  /**  The `@styra/opa` OPAClient instance to use. */
  opaClient: OPAClient;
  /** Default path for every decision. Override by providing`path`. */
  defaultPath?: string;
  /**  Default input for every decision, merged with any passed-in input. Use the latter to override the defaults. */
  defaultInput?: { [k: string]: any };
  /** The default function to apply to the policy evaluation result to get a boolean decision.
   * It can be overridden from `Authz` and `useAuthz`.
   * If unset, any non-undefined, non-false (i.e. "truthy") result will be taken to mean "authorized".
   */
  defaultFromResult?: (_?: Result) => boolean;

  /** The `@tanstack/react-query` client that's used for scheduling policy evaluation requests. */
  queryClient: QueryClient;

  /** Whether or not policy evaluations should retry on transient failures. `false` means never; `true` means infinite retry; any number N means N retries. Defaults to 3. */
  retry: boolean | number;
};

// Reference: https://reacttraining.com/blog/react-context-with-typescript
export const AuthzContext = createContext<AuthzProviderContext | undefined>(
  undefined,
);

export type AuthzProviderProps = PropsWithChildren<
  Omit<AuthzProviderContext, "queryClient">
>;

/**
 * Configures the authorization SDK, with default path/input of applicable.
 * The `<AuthzProvider/>` wrapper needs to be as high as possible in the component tree,
 * since `<Authz/>` or `useAuthz` may only be used inside that wrapper.
 *
 * @example
 *
 * ```tsx
 * <AuthzProvider sdk={sdk} defaultPath="tickets" defaultInput={{tenant: 'acme-corp'}}>
 *   <App/>
 * </AuthzProvider>
 * ```
 */
export default function AuthzProvider({
  children,
  opaClient,
  defaultPath,
  defaultInput,
  defaultFromResult,
  retry = 0, // Debugging
}: AuthzProviderProps) {
  const batcher = useMemo(() => opaClient && evals(opaClient), [opaClient]);
  const defaultQueryFn = useCallback(
    async ({
      queryKey,
      meta = {},
      signal,
    }: QueryFunctionContext): Promise<Record<string, Result>> => {
      if (!batcher) return;

      const [path, input] = queryKey as [string, Input];
      const fromResult = meta["fromResult"] as any;
      return batcher.fetch({ path, input, fromResult }); // TODO: signal
    },
    [batcher],
  );
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            queryFn: defaultQueryFn,
            retry,
          },
        },
      }),
    [defaultQueryFn, retry],
  );

  const context = useMemo<AuthzProviderContext>(
    () => ({
      opaClient,
      defaultPath,
      defaultInput,
      defaultFromResult,
      queryClient: queryClient!,
      retry,
    }),
    [
      opaClient,
      defaultPath,
      defaultInput,
      defaultFromResult,
      queryClient,
      retry,
    ],
  );

  if (!queryClient) return null;

  return (
    <AuthzContext.Provider value={context}>{children}</AuthzContext.Provider>
  );
}

// Taken from fast-json-stable-hash, MIT-licensed:
// https://github.com/zkldi/fast-json-stable-hash/blob/31b3081e942c1ce491f9698fd0bf527847093036/index.js
// That module was tricky to import because it's using `crypto` for hashing.
// We only need a stable string.
function stringify(obj: any) {
  const type = typeof obj;
  if (obj === undefined) return "_";

  if (type === "string") {
    return JSON.stringify(obj);
  } else if (Array.isArray(obj)) {
    let str = "[";

    let al = obj.length - 1;

    for (let i = 0; i < obj.length; i++) {
      str += stringify(obj[i]);

      if (i !== al) {
        str += ",";
      }
    }

    return `${str}]`;
  } else if (type === "object" && obj !== null) {
    let str = "{";
    let keys = Object.keys(obj).sort();

    let kl = keys.length - 1;

    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      str += `${JSON.stringify(key)}:${stringify(obj[key])}`;

      if (i !== kl) {
        str += ",";
      }
    }

    return `${str}}`;
  } else if (type === "number" || type === "boolean" || obj === null) {
    // bool, num, null have correct auto-coercions
    return `${obj}`;
  } else {
    throw new TypeError(
      `Invalid JSON type of ${type}, value ${obj}. Can only hash JSON objects.`,
    );
  }
}
