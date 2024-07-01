import { type Input, type Result, type ServerError, SuccessfulPolicyResponse } from "./sdk/models/components/index.js";
import { SDKOptions } from "./lib/config.js";
import { RequestOptions as FetchOptions } from "./lib/sdks.js";
export type { Input, Result };
/**
 * Implement `ToInput` to declare how your provided input is to be converted
 * into the API request payload's "input".
 */
export interface ToInput {
    toInput(): Input;
}
/** Extra options for using the high-level SDK.
 */
export type Options = {
    headers?: Record<string, string>;
    sdk?: SDKOptions;
};
/** Extra per-request options for using the high-level SDK's
 * evaluate/evaluateDefault methods.
 */
export interface RequestOptions<Res> extends FetchOptions {
    fromResult?: (res?: Result) => Res;
}
/** Extra per-request options for using the high-level SDK's
 * evaluateBatch method.
 */
export interface BatchRequestOptions<Res> extends RequestOptions<Res> {
    rejectMixed?: boolean;
    fallback?: boolean;
}
/** OPAClient is the starting point for using the high-level API.
 *
 * Use {@link Opa} if you need some low-level customization.
 */
export declare class OPAClient {
    private opa;
    private opaFallback;
    /** Create a new `OPA` instance.
     * @param serverURL - The OPA URL, e.g. `https://opa.internal.corp:8443/`.
     * @param opts - Extra options, including low-level `SDKOptions`.
     */
    constructor(serverURL: string, opts?: Options);
    /** `evaluate` is used to evaluate the policy at the specified path with optional input.
     *
     * @param path - The path to the policy, without `/v1/data`: use `authz/allow` to evaluate policy `data.authz.allow`.
     * @param input - The input to the policy, if needed.
     * @param opts - Per-request options to control how the policy evaluation result is to be transformed
     * into `Res` (via `fromResult`), and low-level fetch options.
     */
    evaluate<In extends Input | ToInput, Res>(path: string, input?: In, opts?: RequestOptions<Res>): Promise<Res>;
    /** `evaluateDefault` is used to evaluate the server's default policy with optional input.
     *
     * @param input - The input to the default policy, defaults to `{}`.
     * @param opts - Per-request options to control how the policy evaluation result is to be transformed
     * into `Res` (via `fromResult`), and low-level fetch options.
     */
    evaluateDefault<In extends Input | ToInput, Res>(input?: In, opts?: RequestOptions<Res>): Promise<Res>;
    /** `evaluateBatch` is used to evaluate the policy at the specified path, for a batch of many inputs.
     *
     * @param path - The path to the policy, without `/v1/batch/data`: use `authz/allow` to evaluate policy `data.authz.allow`.
     * @param inputs - The inputs to the policy.
     * @param opts - Per-request options to control how the policy evaluation result is to be transformed
     * into `Res` (via `fromResult`), if any failures in the batch result should reject the promose (via
     * `rejectMixed`), and low-level fetch options.
     */
    evaluateBatch<In extends Input | ToInput, Res>(path: string, inputs: {
        [k: string]: In;
    }, opts?: BatchRequestOptions<Res>): Promise<{
        [k: string]: Res | ServerError;
    }>;
    fallbackBatch<Res>(path: string, inputs: {
        [k: string]: Input;
    }, opts?: BatchRequestOptions<Res>): Promise<{
        [k: string]: ServerError | SuccessfulPolicyResponse;
    }>;
}
//# sourceMappingURL=opaclient.d.ts.map