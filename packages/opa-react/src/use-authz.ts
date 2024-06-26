import { useContext, useCallback, useEffect, useState } from "react";
import { AuthzContext } from "./opa-provider";
import { Input, Result } from "@styra/opa";
import merge from "lodash/merge";
import { useDeepCompareMemoize } from "use-deep-compare-effect";

export type UseAuthzResult<T> =
  | { isLoading: true; result: undefined; error: undefined }
  | { isLoading: false; result: T; error: undefined }
  | { isLoading: false; result: undefined; error: Error };

/**
 * This hook provides more flexibility than the <Authz/> component, allowing you to
 * work with authorization decisions directly in your code.
 *
 * TODO(sr): update docs
 */
export default function useAuthz(
  path?: string,
  input?: Input,
): UseAuthzResult<Result> {
  const context = useContext(AuthzContext);
  if (context === null) {
    throw Error("Authz/useAuthz can only be used inside an AuthzProvider");
  }
  const { sdk, defaultPath, defaultInput } = context;

  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState<Result>();
  const [error, setError] = useState<Error>();

  // TODO(sr): This feels wrong. Figure out just how wrong it is.
  const requestMemo = useDeepCompareMemoize({
    defaultPath,
    defaultInput,
    input,
    path,
  });

  const evaluate = useCallback<(signal: AbortSignal) => Promise<Result>>(
    async (signal: AbortSignal): Promise<Result> => {
      const { defaultPath, defaultInput, input, path } = requestMemo;
      const p = path ?? defaultPath;
      const i = mergeInput(input, defaultInput);
      const fetchOptions = { signal };
      return p
        ? sdk.evaluate(p, i, { fetchOptions })
        : sdk.evaluateDefault(i, { fetchOptions });
    },
    [sdk, requestMemo],
  );

  useEffect(() => {
    setIsLoading(true);
    setResult(undefined);
    setError(undefined);

    const abortController = new AbortController();

    evaluate(abortController.signal)
      .then((data) => {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
          setResult(data);
          setError(undefined);
        }
      })
      .catch((error: unknown) => {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
          setResult(undefined);
          setError(
            error instanceof Error
              ? error
              : new Error(`An unexpected error occurred: ${error}`),
          );
        }
      });

    return (): void => {
      abortController.abort();
    };
  }, [evaluate]);

  return { isLoading, result, error } as UseAuthzResult<Result>;
}

function mergeInput(input?: Input, defaultInput?: Input): Input | undefined {
  if (!input) return defaultInput;
  if (!defaultInput) return input;
  return merge(input, defaultInput);
}
