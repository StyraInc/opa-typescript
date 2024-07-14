import { useContext } from "react";
import { AuthzContext } from "./authz-provider.js";
import { type Input, type Result } from "@styra/opa";
import merge from "lodash.merge";
import { useQuery } from "@tanstack/react-query";

export type UseAuthzResult<T> =
  | { isLoading: true; result: undefined; error: undefined }
  | { isLoading: false; result: T; error: undefined }
  | { isLoading: false; result: undefined; error: Error };

/**
 * This hook provides more flexibility than the `<Authz/>` component, allowing you to
 * work with authorization decisions directly in your code.
 *
 * @param path The policy path. If unset, will be evaluating the server's default decision.
 * @param input The input to the policy evaluation.
 * @param fromResult Optional result unwrapping function.
 */
export default function useAuthz(
  path?: string,
  input?: Input,
  fromResult?: (_?: Result) => boolean,
): UseAuthzResult<Result> {
  const context = useContext(AuthzContext);
  if (context === undefined) {
    throw Error("Authz/useAuthz can only be used inside an AuthzProvider");
  }
  const {
    defaultPath,
    defaultInput,
    defaultFromResult,
    queryClient,
    opaClient,
  } = context;
  const p = path ?? defaultPath;
  const i = mergeInput(input, defaultInput);
  const fromR = fromResult ?? defaultFromResult;

  const {
    // NOTE(sr): we're ignoring 'status'
    data: result,
    error,
    isFetching: isLoading,
  } = useQuery<Result>(
    {
      queryKey: [{ path: p, input: i }],
      meta: { fromResult: fromR },
      enabled: !!opaClient,
    },
    queryClient,
  );
  return {
    isLoading,
    result,
    error: error != null ? error : undefined,
  } as UseAuthzResult<Result>;
}

function mergeInput(input?: Input, defaultInput?: Input): Input | undefined {
  if (!input) return defaultInput;
  if (!defaultInput) return input;
  return merge(input, defaultInput);
}
