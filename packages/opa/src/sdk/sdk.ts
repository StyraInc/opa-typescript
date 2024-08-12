/*
 * Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.
 */

import { executeBatchPolicyWithInput } from "../funcs/executeBatchPolicyWithInput.js";
import { executeDefaultPolicyWithInput } from "../funcs/executeDefaultPolicyWithInput.js";
import { executePolicy } from "../funcs/executePolicy.js";
import { executePolicyWithInput } from "../funcs/executePolicyWithInput.js";
import { health } from "../funcs/health.js";
import { ClientSDK, RequestOptions } from "../lib/sdks.js";
import { unwrapAsync } from "../types/fp.js";
import * as components from "./models/components/index.js";
import * as operations from "./models/operations/index.js";

export class OpaApiClient extends ClientSDK {
    /**
     * Execute the default decision  given an input
     */
    async executeDefaultPolicyWithInput(
        input: components.Input,
        pretty?: boolean | undefined,
        acceptEncoding?: components.GzipAcceptEncoding | undefined,
        options?: RequestOptions
    ): Promise<operations.ExecuteDefaultPolicyWithInputResponse> {
        return unwrapAsync(
            executeDefaultPolicyWithInput(this, input, pretty, acceptEncoding, options)
        );
    }

    /**
     * Execute a policy
     */
    async executePolicy(
        request: operations.ExecutePolicyRequest,
        options?: RequestOptions
    ): Promise<operations.ExecutePolicyResponse> {
        return unwrapAsync(executePolicy(this, request, options));
    }

    /**
     * Execute a policy given an input
     */
    async executePolicyWithInput(
        request: operations.ExecutePolicyWithInputRequest,
        options?: RequestOptions
    ): Promise<operations.ExecutePolicyWithInputResponse> {
        return unwrapAsync(executePolicyWithInput(this, request, options));
    }

    /**
     * Execute a policy given a batch of inputs
     */
    async executeBatchPolicyWithInput(
        request: operations.ExecuteBatchPolicyWithInputRequest,
        options?: RequestOptions
    ): Promise<operations.ExecuteBatchPolicyWithInputResponse> {
        return unwrapAsync(executeBatchPolicyWithInput(this, request, options));
    }

    /**
     * Verify the server is operational
     *
     * @remarks
     * The health API endpoint executes a simple built-in policy query to verify that the server is operational. Optionally it can account for bundle activation as well (useful for “ready” checks at startup).
     */
    async health(
        bundles?: boolean | undefined,
        plugins?: boolean | undefined,
        excludePlugin?: Array<string> | undefined,
        options?: RequestOptions
    ): Promise<operations.HealthResponse> {
        return unwrapAsync(health(this, bundles, plugins, excludePlugin, options));
    }
}
