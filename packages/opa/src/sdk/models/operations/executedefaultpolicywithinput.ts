/*
 * Code generated by Speakeasy (https://speakeasyapi.dev). DO NOT EDIT.
 */

import { remap as remap$ } from "../../../lib/primitives.js";
import * as components from "../components/index.js";
import * as z from "zod";

export type ExecuteDefaultPolicyWithInputRequest = {
    /**
     * If parameter is `true`, response will formatted for humans.
     */
    pretty?: boolean | undefined;
    /**
     * Indicates the server should respond with a gzip encoded body. The server will send the compressed response only if its length is above `server.encoding.gzip.min_length` value. See the configuration section
     */
    acceptEncoding?: components.GzipAcceptEncoding | undefined;
    /**
     * The input document
     */
    input: components.Input;
};

export type ExecuteDefaultPolicyWithInputResponse = {
    httpMeta: components.HTTPMetadata;
    /**
     * Success.
     *
     * @remarks
     * Evaluating the default policy has the same response behavior as a successful policy evaluation, but with only the result as the response.
     *
     */
    result?: components.Result | undefined;
    headers: { [k: string]: Array<string> };
};

/** @internal */
export namespace ExecuteDefaultPolicyWithInputRequest$ {
    export const inboundSchema: z.ZodType<
        ExecuteDefaultPolicyWithInputRequest,
        z.ZodTypeDef,
        unknown
    > = z
        .object({
            pretty: z.boolean().optional(),
            "Accept-Encoding": components.GzipAcceptEncoding$.inboundSchema.optional(),
            input: components.Input$.inboundSchema,
        })
        .transform((v) => {
            return remap$(v, {
                "Accept-Encoding": "acceptEncoding",
            });
        });

    export type Outbound = {
        pretty?: boolean | undefined;
        "Accept-Encoding"?: string | undefined;
        input: components.Input$.Outbound;
    };

    export const outboundSchema: z.ZodType<
        Outbound,
        z.ZodTypeDef,
        ExecuteDefaultPolicyWithInputRequest
    > = z
        .object({
            pretty: z.boolean().optional(),
            acceptEncoding: components.GzipAcceptEncoding$.outboundSchema.optional(),
            input: components.Input$.outboundSchema,
        })
        .transform((v) => {
            return remap$(v, {
                acceptEncoding: "Accept-Encoding",
            });
        });
}

/** @internal */
export namespace ExecuteDefaultPolicyWithInputResponse$ {
    export const inboundSchema: z.ZodType<
        ExecuteDefaultPolicyWithInputResponse,
        z.ZodTypeDef,
        unknown
    > = z
        .object({
            HttpMeta: components.HTTPMetadata$.inboundSchema,
            result: components.Result$.inboundSchema.optional(),
            Headers: z.record(z.array(z.string())),
        })
        .transform((v) => {
            return remap$(v, {
                HttpMeta: "httpMeta",
                Headers: "headers",
            });
        });

    export type Outbound = {
        HttpMeta: components.HTTPMetadata$.Outbound;
        result?: components.Result$.Outbound | undefined;
        Headers: { [k: string]: Array<string> };
    };

    export const outboundSchema: z.ZodType<
        Outbound,
        z.ZodTypeDef,
        ExecuteDefaultPolicyWithInputResponse
    > = z
        .object({
            httpMeta: components.HTTPMetadata$.outboundSchema,
            result: components.Result$.outboundSchema.optional(),
            headers: z.record(z.array(z.string())),
        })
        .transform((v) => {
            return remap$(v, {
                httpMeta: "HttpMeta",
                headers: "Headers",
            });
        });
}