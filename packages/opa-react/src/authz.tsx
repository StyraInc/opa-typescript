import { type ReactNode, type PropsWithChildren } from "react";

import useAuthz from "./use-authz.js";
import { type Input, type Result } from "@styra/opa";

export type AuthzProps = PropsWithChildren<{
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
  /** The function to apply to the policy evaluation result to get a boolean decision.
   * If unset, any non-undefined, non-false (i.e. "truthy") result will be taken to mean "authorized".
   */
  fromResult?: (_?: Result) => boolean;
}>;

/**
 * Conditionally renders components based on authorization decisions for a specified
 * policy path and input for the current user.
 *
 * The simplest use looks like that shown below; just wrap some arbitrary content
 * and specify path and input.
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
 * @example Unwrapping a policy evaluation result
 *
 * Assuming the policy returns an object, `{"result": true}`, the `fromResult` prop can be
 * used to unwrap that:
 *
 * ```tsx
 * <Authz
 *   path={path}
 *   input={input}
 *   fromResult={({result}) => result ?? false}
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
  fromResult,
}: AuthzProps) => {
  const { result, isLoading } = useAuthz(path, input, fromResult);

  if (isLoading) {
    return loading;
  }

  return !!result ? children : fallback;
};
