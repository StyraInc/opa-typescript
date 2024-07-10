import * as React from "react";
import { type PropsWithChildren, createContext, useMemo } from "react";
import { QueryClient, QueryFunctionContext } from "@tanstack/react-query";
import {
  type Input,
  type Result,
  type ToInput,
  type RequestOptions,
  type BatchRequestOptions,
} from "@styra/opa";
import { type ServerError } from "@styra/opa/sdk/models/components";

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
  const queryClient = useMemo(() => {
    if (!opaClient) return;

    const defaultQueryFn = async ({
      queryKey,
      meta = {},
      signal,
    }: QueryFunctionContext) => {
      const [path, input] = queryKey as [string, Input];
      const fromResult = meta["fromResult"] as (_?: Result) => boolean;
      return path
        ? opaClient.evaluate<Input, Result>(path, input, {
            fromResult,
            fetchOptions: { signal },
          })
        : opaClient.evaluateDefault<Input, Result>(input, {
            fromResult,
            fetchOptions: { signal },
          });
    };
    return new QueryClient({
      defaultOptions: {
        queries: {
          queryFn: defaultQueryFn,
          retry,
        },
      },
    });
  }, [opaClient]);

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
