import { type PropsWithChildren, createContext, useMemo } from "react";
import {
  type Input,
  type Result,
  type ToInput,
  type RequestOptions,
} from "@styra/opa";

/** Abstracts the methods that are used from `OPAClient` of `@styra/opa`. */
export interface SDK {
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
}

export interface AuthzProviderContext {
  /** `SDK` instance to use: most likely `OPAClient` from `@styra/opa`. */
  sdk: SDK;
  /** The default policy path. Can be overridden by `<Authz>` components or `useAuthz` hooks. If unset and not overridden, uses the default policy as defined by the server. */
  defaultPath: string | undefined;
  /** The default policy evaluation input. Can be overridden by `<Authz>` components or `useAuthz` hooks. */
  defaultInput: Record<string, any> | undefined;
  /** The default function to apply to the policy evaluation result to get a boolean decision.
   * It can be overridden from `Authz` and `useAuthz`.
   * If unset, any non-undefined, non-false (i.e. "truthy") result will be taken to mean "authorized".
   */
  defaultFromResult: ((_?: Result) => boolean) | undefined;
}

// Reference: https://reacttraining.com/blog/react-context-with-typescript
export const AuthzContext = createContext<AuthzProviderContext | null>(null);

export type AuthzProviderProps = PropsWithChildren<{
  /**  The `@styra/opa` OPAClient instance to use. */
  sdk: SDK;
  /** Default path for every decision. Override by providing`path`. */
  defaultPath?: string;
  /**  Default input for every decision, merged with any passed-in input. Use the latter to override the defaults. */
  defaultInput?: { [k: string]: any };
  /** The default function to apply to the policy evaluation result to get a boolean decision.
   * It can be overridden from `Authz` and `useAuthz`.
   * If unset, any non-undefined, non-false (i.e. "truthy") result will be taken to mean "authorized".
   */
  defaultFromResult?: (_?: Result) => boolean;
}>;

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
  sdk,
  defaultPath,
  defaultInput,
  defaultFromResult,
}: AuthzProviderProps) {
  const context = useMemo<AuthzProviderContext>( // TODO(sr): Is useMemo still the right thing?
    () => ({ sdk, defaultPath, defaultInput, defaultFromResult }),
    [sdk, defaultPath, defaultInput, defaultFromResult],
  );

  return (
    <AuthzContext.Provider value={context}>{children}</AuthzContext.Provider>
  );
}
