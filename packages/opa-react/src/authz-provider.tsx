import * as React from "react";
import { BatshitDevtools } from "@yornaath/batshit-devtools-react";
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

const myIndexedResolver =
  <T extends Record<any, any>>() =>
  (itemsIndex: T, query: { path: string; input: Input }) => {
    const k = key(query);
    return itemsIndex[k] ?? null;
  };

function key(x: { path: string; input: Input }): string {
  return JSON.stringify(x);
}

const evals = (sdk: OPAClient) =>
  create({
    fetcher: async (evals: { path: string; input: Input }[]) => {
      console.table(evals);
      const evs = evals.map((x) => ({ ...x, k: key(x) }));
      const groups = Object.groupBy(evs, ({ path }) => path); // group by path
      return Promise.all(
        Object.entries(groups).map(([path, inputs]) => {
          const inps = inputs.reduce((acc, { k, input }) => {
            acc[k] = input;
            return acc;
          }, {});
          return sdk.evaluateBatch(path, inps, { rejectMixed: true });
        }),
      ).then(([all]) => all); // unwrap
    },
    resolver: myIndexedResolver(),
    scheduler: windowScheduler(10),
    name: "batcher:eval",
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
  retry = 3,
}: AuthzProviderProps) {
  const batcher = useMemo(() => opaClient && evals(opaClient), [opaClient]);
  const defaultQueryFn = useCallback(
    async ({ queryKey, meta = {}, signal }: QueryFunctionContext) => {
      if (!batcher) return;

      const [path, input] = queryKey as [string, Input];
      return batcher.fetch({ path, input }); // TODO: fromResult, signal
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
    [defaultQueryFn],
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
    <AuthzContext.Provider value={context}>
      <BatshitDevtools />
      {children}
    </AuthzContext.Provider>
  );
}
