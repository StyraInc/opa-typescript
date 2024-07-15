import { useContext, useMemo } from "react";
import { AuthzContext } from "./authz-provider.js";
import { type Input, type Result } from "@styra/opa";
import merge from "lodash.merge";
import { useQuery, useQueries, UseQueryResult } from "@tanstack/react-query";

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

  const queryKey = useMemo(
    () => [path ?? defaultPath, mergeInput(input, defaultInput)],
    [path, defaultPath, input, defaultInput],
  );
  const meta = useMemo(
    () => ({ fromResult: fromResult ?? defaultFromResult }),
    [fromResult, defaultFromResult],
  );

  const result = useQuery<Result>(
    {
      queryKey,
      meta,
      enabled: !!opaClient,
    },
    queryClient,
  );
  return convertResult(result);
}

export function useAuthzMultiple(
  queries: {
    path?: string;
    input?: Input;
    fromResult?: (_?: Result) => boolean;
  }[],
): UseAuthzResult<Result>[] {
  const context = useContext(AuthzContext);
  if (context === undefined) {
    throw Error("useAuthzMultiple can only be used inside an AuthzProvider");
  }
  const {
    defaultPath,
    defaultInput,
    defaultFromResult,
    queryClient,
    opaClient,
  } = context;

  const data = useQueries<Result[]>(
    {
      queries: queries.map(({ path, input, fromResult }) => ({
        queryKey: [path ?? defaultPath, merge(input, defaultInput)],
        meta: { fromResult: fromResult ?? defaultFromResult },
        enabled: !!opaClient,
      })),
    },
    queryClient,
  );

  return data.map(convertResult);
}

function mergeInput(input?: Input, defaultInput?: Input): Input | undefined {
  if (!input) return defaultInput;
  if (!defaultInput) return input;
  return merge(input, defaultInput);
}

function convertResult<T>({
  isFetching: isLoading,
  data: result,
  error,
}: UseQueryResult<T>): UseAuthzResult<T> {
  return {
    isLoading,
    result,
    error: error != null ? error : undefined,
  } as UseAuthzResult<T>;
}
