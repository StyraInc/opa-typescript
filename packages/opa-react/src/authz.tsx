import { type ReactNode } from "react";

import useAuthz from "./use-authz.js";
import { type Input } from "@styra/opa";

export type AuthzProps = {
  /** Input to the policy evaluation. Will be merged with `AuthzProvider`'s `defaultInput` (if set), overriding it when in conflict. */
  input?: Input;
  /** Path of the policy to evluate. Will default to `AuthzProvider`'s `path`. */
  path?: string;
  /**
   * `loading` mimics React.Suspense
   * Will display when loading so we have the option to display skeletons instead of the disabled option.
   */
  loading?: ReactNode;
  /**
   * Component to display when result is falsey
   */
  fallback?: ReactNode;
  /** Children node(s) to render, or a function depending on the result of the policy evaluation. */
  children?: ReactNode | ((result: unknown) => ReactNode);
};

/**
 * Conditionally renders components based on authorization decisions for a specified
 * policy path and input for the current user.
 *
 * The simplest use looks like that shown below; just wrap some arbitrary content
 * and specify path and input.
 *
 * @example Using a function mapping the evaluation result to JSX children
 *
 * ```tsx
 * <Authz path={path} input={input}>
 *   {(result) => <Button disabled={!result}>Delete Item</Button>}
 * </Authz>
 * ```
 *
 * @example JSX children with fallback for the "denied" state
 *
 * ```tsx
 * <Authz
 *   path={path}
 *   input={input}
 *   fallback={<div>unauthorized</div>}
 *   loading={<div>loading...</div>}>
 *   <Button>Delete Item</Button>
 * </Authz>
 * ```
 *
 * ## Configuration
 *
 * Configuration involves defining an API endpoint for authorization along with a context
 * that can be used to access authorization decisions throughout the application.
 * The `<AuthzProvider/>` wrapper needs to be as high as possible in the component tree,
 * since `<Authz/>` (or `useAuthz`) may only be used inside that wrapper.
 *
 */
export default ({
  children,
  path,
  loading,
  input,
  fallback = null,
}: AuthzProps) => {
  const { result, isLoading } = useAuthz(path, input);

  if (isLoading) {
    return loading;
  }

  if (typeof children === "function") {
    return children(result);
  }

  return !!result ? children : fallback;
};
