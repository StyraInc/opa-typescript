import { type PropsWithChildren, createContext, useMemo } from "react";
import { type Input, type ToInput, type RequestOptions } from "@styra/opa";

interface SDK {
  evaluate<In extends Input | ToInput, Res>(
    path: string,
    input?: In,
    opts?: RequestOptions<Res>,
  ): Promise<Res>;

  evaluateDefault<In extends Input | ToInput, Res>(
    input?: In,
    opts?: RequestOptions<Res>,
  ): Promise<Res>;
}

interface AuthzProviderContext {
  sdk: SDK;
  defaultPath: string | undefined;
  defaultInput: Record<string, any> | undefined;
}

// Reference: https://reacttraining.com/blog/react-context-with-typescript
export const AuthzContext = createContext<AuthzProviderContext | null>(null);

type AuthzProviderProps = PropsWithChildren<{
  sdk: SDK;
  defaultPath?: string; // to be overridden (or not)
  defaultInput?: { [k: string]: any }; // to be merged
}>;

/**
 * Configures the authorization SDK, with default path/input of applicable.
 * The <AuthzProvider/> wrapper needs to be as high as possible in the component tree,
 * since <Authz/> or `useAuthz` may only be used inside that wrapper.
 *
 * @param props.children The content over which the authz context will apply.
 * @param props.sdk The `@styra/opa` OPAClient instance to use.
 * @param props.defaultPath Default path for every decision. Override by
 * providing `path`.
 * @param props.defaultInput Default input for every decision, merged with
 * any passed-in input. Use the latter to override the defaults.
 *
 * @example
 *   <AuthzProvider sdk={sdk} defaultPath="tickets" defaultInput={{tenant: 'acme-corp'}}>
 *     <App/>
 *   </AuthzProvider>
 */
// TODO(sr): later: opportunistically invoke bulk decision endpoint
export default function AuthzProvider({
  children,
  sdk,
  defaultPath,
  defaultInput,
}: AuthzProviderProps) {
  const context = useMemo<AuthzProviderContext>( // TODO(sr): Is useMemo still the right thing?
    () => ({ sdk, defaultPath, defaultInput }),
    [sdk, defaultPath, defaultInput],
  );

  return (
    <AuthzContext.Provider value={context}>{children}</AuthzContext.Provider>
  );
}
