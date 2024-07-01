"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OPAClient = void 0;
const index_js_1 = require("./sdk/index.js");
const sdkerror_js_1 = require("./sdk/models/errors/sdkerror.js");
const http_js_1 = require("./lib/http.js");
function implementsToInput(object) {
    const u = object;
    return u.toInput !== undefined && typeof u.toInput == "function";
}
/** OPAClient is the starting point for using the high-level API.
 *
 * Use {@link Opa} if you need some low-level customization.
 */
class OPAClient {
    /** Create a new `OPA` instance.
     * @param serverURL - The OPA URL, e.g. `https://opa.internal.corp:8443/`.
     * @param opts - Extra options, including low-level `SDKOptions`.
     */
    constructor(serverURL, opts) {
        var _a, _b;
        this.opaFallback = false;
        const sdk = { serverURL, ...opts === null || opts === void 0 ? void 0 : opts.sdk };
        if (opts === null || opts === void 0 ? void 0 : opts.headers) {
            const hdrs = opts.headers;
            const client = (_b = (_a = opts === null || opts === void 0 ? void 0 : opts.sdk) === null || _a === void 0 ? void 0 : _a.httpClient) !== null && _b !== void 0 ? _b : new http_js_1.HTTPClient();
            client.addHook("beforeRequest", (req) => {
                for (const k in hdrs) {
                    req.headers.set(k, hdrs[k]);
                }
                return req;
            });
            sdk.httpClient = client;
        }
        this.opa = new index_js_1.OpaApiClient(sdk);
    }
    /** `evaluate` is used to evaluate the policy at the specified path with optional input.
     *
     * @param path - The path to the policy, without `/v1/data`: use `authz/allow` to evaluate policy `data.authz.allow`.
     * @param input - The input to the policy, if needed.
     * @param opts - Per-request options to control how the policy evaluation result is to be transformed
     * into `Res` (via `fromResult`), and low-level fetch options.
     */
    async evaluate(path, input, opts) {
        let result;
        if (input === undefined) {
            result = await this.opa.executePolicy({ path }, opts);
        }
        else {
            let inp;
            if (implementsToInput(input)) {
                inp = input.toInput();
            }
            else {
                inp = input;
            }
            result = await this.opa.executePolicyWithInput({
                path,
                requestBody: { input: inp },
            }, opts);
        }
        if (!result.successfulPolicyResponse)
            throw `no result in API response`;
        const res = result.successfulPolicyResponse.result;
        const fromResult = (opts === null || opts === void 0 ? void 0 : opts.fromResult) || (id);
        return fromResult(res);
    }
    /** `evaluateDefault` is used to evaluate the server's default policy with optional input.
     *
     * @param input - The input to the default policy, defaults to `{}`.
     * @param opts - Per-request options to control how the policy evaluation result is to be transformed
     * into `Res` (via `fromResult`), and low-level fetch options.
     */
    async evaluateDefault(input, opts) {
        let inp = input !== null && input !== void 0 ? input : {};
        if (implementsToInput(inp)) {
            inp = inp.toInput();
        }
        const resp = await this.opa.executeDefaultPolicyWithInput(inp, undefined, // pretty
        undefined, // gzipEncoding
        opts);
        if (!resp.result)
            throw `no result in API response`;
        const fromResult = (opts === null || opts === void 0 ? void 0 : opts.fromResult) || (id);
        return fromResult(resp.result);
    }
    /** `evaluateBatch` is used to evaluate the policy at the specified path, for a batch of many inputs.
     *
     * @param path - The path to the policy, without `/v1/batch/data`: use `authz/allow` to evaluate policy `data.authz.allow`.
     * @param inputs - The inputs to the policy.
     * @param opts - Per-request options to control how the policy evaluation result is to be transformed
     * into `Res` (via `fromResult`), if any failures in the batch result should reject the promose (via
     * `rejectMixed`), and low-level fetch options.
     */
    async evaluateBatch(path, inputs, opts) {
        var _a;
        const inps = Object.fromEntries(Object.entries(inputs).map(([k, inp]) => [
            k,
            implementsToInput(inp) ? inp.toInput() : inp,
        ]));
        let res;
        if (this.opaFallback && (opts === null || opts === void 0 ? void 0 : opts.fallback)) {
            // memoized fallback: we have hit a 404 here before
            const responses = await this.fallbackBatch(path, inps, opts);
            res = { responses };
        }
        else {
            try {
                const resp = await this.opa.executeBatchPolicyWithInput({ path, requestBody: { inputs: inps } }, opts);
                res = resp.batchMixedResults || resp.batchSuccessfulPolicyEvaluation;
            }
            catch (err) {
                if (err instanceof sdkerror_js_1.SDKError &&
                    err.httpMeta.response.status == 404 &&
                    (opts === null || opts === void 0 ? void 0 : opts.fallback)) {
                    this.opaFallback = true;
                    const responses = await this.fallbackBatch(path, inps, opts);
                    res = { responses };
                }
                else {
                    throw err;
                }
            }
        }
        if (!res)
            throw `no result in API response`;
        const entries = [];
        for (const [k, v] of Object.entries((_a = res === null || res === void 0 ? void 0 : res.responses) !== null && _a !== void 0 ? _a : {})) {
            entries.push([k, await processResult(v, opts)]);
        }
        return Object.fromEntries(entries);
    }
    // run a sequence of evaluatePolicyWithInput(), via Promise.all/Promise.allSettled
    async fallbackBatch(path, inputs, opts) {
        let items;
        const keys = Object.keys(inputs);
        const ps = Object.values(inputs).map((input) => this.opa
            .executePolicyWithInput({ path, requestBody: { input } })
            .then(({ successfulPolicyResponse: res }) => res));
        if (opts === null || opts === void 0 ? void 0 : opts.rejectMixed) {
            items = await Promise.all(ps).then((results) => results.map((result, i) => {
                if (!result)
                    throw `no result in API response`;
                return [
                    keys[i], // can't be undefined
                    result,
                ];
            }));
        }
        else {
            const settled = await Promise.allSettled(ps).then((results) => {
                return results.map((res, i) => {
                    if (res.status === "rejected") {
                        return [
                            keys[i],
                            {
                                ...res.reason.data$,
                                httpStatusCode: "500",
                            },
                        ];
                    }
                    return [keys[i], res.value];
                });
            });
            items = settled;
        }
        return Object.fromEntries(items);
    }
}
exports.OPAClient = OPAClient;
function processResult(res, opts) {
    if (res && "code" in res) {
        if (opts === null || opts === void 0 ? void 0 : opts.rejectMixed)
            return Promise.reject(res);
        return Promise.resolve(res);
    }
    const fromResult = (opts === null || opts === void 0 ? void 0 : opts.fromResult) || (id);
    return Promise.resolve(fromResult(res.result));
}
function id(x) {
    return x;
}
//# sourceMappingURL=opaclient.js.map