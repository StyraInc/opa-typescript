import { type ReactNode } from "react";

import useAuthz from "./use-authz.js";
import { type Input } from "@styra/opa";

type AuthzProps = {
  input?: Input;
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
  children?: ReactNode | ((result: unknown) => ReactNode);
};

/**
 * Conditionally renders components based on authorization decisions for a specified
 * policy path and input for the current user.
 *
 * The simplest use looks like that shown below; just wrap some arbitrary content
 * and specify path and input.
 *
 *   <Authz path={path} input={input}>
 *     {(result) => <Button disabled={!result}>Delete Item</Button>}
 *   </Authz>
 *
 * ## Configuration
 *
 * Configuration involves defining an API endpoint for authorization along with a context
 * that can be used to access authorization decisions throughout the application.
 * The <AuthzProvider/> wrapper needs to be as high as possible in the component tree,
 * since <Authz/> (or `useAuthz`) may only be used inside that wrapper.
 *
 * @param props.children The content over which the authz decision will apply.
 * @param props.loading What to render when the result hasn't been determined yet (optional).
 * @param props.fallback What is rendered when the decision is negative (or undefined).
 * @param props.path - The policy path to evaluate
 * @param props.input - The input
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
