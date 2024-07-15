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

const table = new WeakMap();

// key is used to index the individual Batch API batches when splitting
// an incoming batch of EvalQuery. The same `x` is later passed to the
// batch item resolver in the results object. We use the WeakMap to
// ensure that the same `x` gets the same number.
function key(x: EvalQuery): string {
  const r = table.get(x);
  if (r) return r;

  const num = new Uint32Array(1);
  crypto.getRandomValues(num);
  const rand = num.toString();
  table.set(x, rand);
  return rand;
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
      ).then((all: object[]) =>
        // combine result arrays of objects (if there's more than one)
        all.length == 1 ? all[0] : Object.assign({}, ...all),
      );
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
};

// Reference: https://reacttraining.com/blog/react-context-with-typescript
export const AuthzContext = createContext<AuthzProviderContext | undefined>(
  undefined,
);

export interface AuthzProviderProps
  extends PropsWithChildren<Omit<AuthzProviderContext, "queryClient">> {
  /** Whether or not policy evaluations should retry on transient failures. `false` means never; `true` means infinite retry; any number N means N retries. Defaults to 3. */
  retry?: boolean | number;

  /** Batch policy evaluation queries when possible, and supported by the backend. Defaults to `false`. */
  batch?: boolean;
}

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
  retry = 0,
  batch = false,
}: AuthzProviderProps) {
  const batcher = useMemo(
    () => batch && opaClient && evals(opaClient),
    [opaClient, batch],
  );
  const defaultQueryFn = useCallback(
    async ({
      queryKey,
      meta = {},
      signal,
    }: QueryFunctionContext): Promise<Result> => {
      const [path, input] = queryKey as [string, Input];
      const fromResult = meta["fromResult"] as
        | ((_?: Result) => boolean)
        | undefined;

      if (!batcher) {
        // use the default, unbatched queries backed by react-query
        return path
          ? opaClient.evaluate<Input, Result>(path, input, {
              fromResult,
              fetchOptions: { signal },
            })
          : opaClient.evaluateDefault<Input, Result>(input, {
              fromResult,
              fetchOptions: { signal },
            });
      }

      if (!path)
        throw new Error("batch requests need to have a defined query path");

      return batcher.fetch({ path, input, fromResult });
    },
    [batcher, batch],
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
    }),
    [opaClient, defaultPath, defaultInput, defaultFromResult, queryClient],
  );

  if (!queryClient) return null;

  return (
    <AuthzContext.Provider value={context}>{children}</AuthzContext.Provider>
  );
}
