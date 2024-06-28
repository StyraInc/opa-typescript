/*
 * Code generated by Speakeasy (https://speakeasyapi.dev). DO NOT EDIT.
 */

import { remap as remap$ } from "../../../lib/primitives.js";
import { Provenance, Provenance$ } from "./provenance.js";
import { Result, Result$ } from "./result.js";
import * as z from "zod";

export type Location = {
    col: number;
    file: string;
    row: number;
};

export type Errors = {
    code: string;
    location?: Location | undefined;
    message: string;
};

export type ServerError = {
    code: string;
    decisionId?: string | undefined;
    errors?: Array<Errors> | undefined;
    message: string;
    httpStatusCode?: string | undefined;
};

export type ResponsesSuccessfulPolicyResponse = {
    /**
     * If decision logging is enabled, this field contains a string that uniquely identifies the decision. The identifier will be included in the decision log event for this decision. Callers can use the identifier for correlation purposes.
     */
    decisionId?: string | undefined;
    /**
     * If query metrics are enabled, this field contains query performance metrics collected during the parse, compile, and evaluation steps.
     */
    metrics?: { [k: string]: any } | undefined;
    /**
     * Provenance information can be requested on individual API calls and are returned inline with the API response. To obtain provenance information on an API call, specify the `provenance=true` query parameter when executing the API call.
     */
    provenance?: Provenance | undefined;
    /**
     * The base or virtual document referred to by the URL path. If the path is undefined, this key will be omitted.
     */
    result?: Result | undefined;
    httpStatusCode?: string | undefined;
};

export type Responses =
    | (ResponsesSuccessfulPolicyResponse & { httpStatusCode: "200" })
    | (ServerError & { httpStatusCode: "500" });

export type BatchMixedResults = {
    batchDecisionId?: string | undefined;
    /**
     * If query metrics are enabled, this field contains query performance metrics collected during the parse, compile, and evaluation steps.
     */
    metrics?: { [k: string]: any } | undefined;
    responses?:
        | {
              [k: string]:
                  | (ResponsesSuccessfulPolicyResponse & { httpStatusCode: "200" })
                  | (ServerError & { httpStatusCode: "500" });
          }
        | undefined;
};

/** @internal */
export namespace Location$ {
    export const inboundSchema: z.ZodType<Location, z.ZodTypeDef, unknown> = z.object({
        col: z.number().int(),
        file: z.string(),
        row: z.number().int(),
    });

    export type Outbound = {
        col: number;
        file: string;
        row: number;
    };

    export const outboundSchema: z.ZodType<Outbound, z.ZodTypeDef, Location> = z.object({
        col: z.number().int(),
        file: z.string(),
        row: z.number().int(),
    });
}

/** @internal */
export namespace Errors$ {
    export const inboundSchema: z.ZodType<Errors, z.ZodTypeDef, unknown> = z.object({
        code: z.string(),
        location: z.lazy(() => Location$.inboundSchema).optional(),
        message: z.string(),
    });

    export type Outbound = {
        code: string;
        location?: Location$.Outbound | undefined;
        message: string;
    };

    export const outboundSchema: z.ZodType<Outbound, z.ZodTypeDef, Errors> = z.object({
        code: z.string(),
        location: z.lazy(() => Location$.outboundSchema).optional(),
        message: z.string(),
    });
}

/** @internal */
export namespace ServerError$ {
    export const inboundSchema: z.ZodType<ServerError, z.ZodTypeDef, unknown> = z
        .object({
            code: z.string(),
            decision_id: z.string().optional(),
            errors: z.array(z.lazy(() => Errors$.inboundSchema)).optional(),
            message: z.string(),
            http_status_code: z.string().optional(),
        })
        .transform((v) => {
            return remap$(v, {
                decision_id: "decisionId",
                http_status_code: "httpStatusCode",
            });
        });

    export type Outbound = {
        code: string;
        decision_id?: string | undefined;
        errors?: Array<Errors$.Outbound> | undefined;
        message: string;
        http_status_code?: string | undefined;
    };

    export const outboundSchema: z.ZodType<Outbound, z.ZodTypeDef, ServerError> = z
        .object({
            code: z.string(),
            decisionId: z.string().optional(),
            errors: z.array(z.lazy(() => Errors$.outboundSchema)).optional(),
            message: z.string(),
            httpStatusCode: z.string().optional(),
        })
        .transform((v) => {
            return remap$(v, {
                decisionId: "decision_id",
                httpStatusCode: "http_status_code",
            });
        });
}

/** @internal */
export namespace ResponsesSuccessfulPolicyResponse$ {
    export const inboundSchema: z.ZodType<
        ResponsesSuccessfulPolicyResponse,
        z.ZodTypeDef,
        unknown
    > = z
        .object({
            decision_id: z.string().optional(),
            metrics: z.record(z.any()).optional(),
            provenance: Provenance$.inboundSchema.optional(),
            result: Result$.inboundSchema.optional(),
            http_status_code: z.string().optional(),
        })
        .transform((v) => {
            return remap$(v, {
                decision_id: "decisionId",
                http_status_code: "httpStatusCode",
            });
        });

    export type Outbound = {
        decision_id?: string | undefined;
        metrics?: { [k: string]: any } | undefined;
        provenance?: Provenance$.Outbound | undefined;
        result?: Result$.Outbound | undefined;
        http_status_code?: string | undefined;
    };

    export const outboundSchema: z.ZodType<
        Outbound,
        z.ZodTypeDef,
        ResponsesSuccessfulPolicyResponse
    > = z
        .object({
            decisionId: z.string().optional(),
            metrics: z.record(z.any()).optional(),
            provenance: Provenance$.outboundSchema.optional(),
            result: Result$.outboundSchema.optional(),
            httpStatusCode: z.string().optional(),
        })
        .transform((v) => {
            return remap$(v, {
                decisionId: "decision_id",
                httpStatusCode: "http_status_code",
            });
        });
}

/** @internal */
export namespace Responses$ {
    export const inboundSchema: z.ZodType<Responses, z.ZodTypeDef, unknown> = z.union([
        z
            .lazy(() => ResponsesSuccessfulPolicyResponse$.inboundSchema)
            .and(
                z
                    .object({ http_status_code: z.literal("200") })
                    .transform((v) => ({ httpStatusCode: v.http_status_code }))
            ),
        z
            .lazy(() => ServerError$.inboundSchema)
            .and(
                z
                    .object({ http_status_code: z.literal("500") })
                    .transform((v) => ({ httpStatusCode: v.http_status_code }))
            ),
    ]);

    export type Outbound =
        | (ResponsesSuccessfulPolicyResponse$.Outbound & { http_status_code: "200" })
        | (ServerError$.Outbound & { http_status_code: "500" });
    export const outboundSchema: z.ZodType<Outbound, z.ZodTypeDef, Responses> = z.union([
        z
            .lazy(() => ResponsesSuccessfulPolicyResponse$.outboundSchema)
            .and(
                z
                    .object({ httpStatusCode: z.literal("200") })
                    .transform((v) => ({ http_status_code: v.httpStatusCode }))
            ),
        z
            .lazy(() => ServerError$.outboundSchema)
            .and(
                z
                    .object({ httpStatusCode: z.literal("500") })
                    .transform((v) => ({ http_status_code: v.httpStatusCode }))
            ),
    ]);
}

/** @internal */
export namespace BatchMixedResults$ {
    export const inboundSchema: z.ZodType<BatchMixedResults, z.ZodTypeDef, unknown> = z
        .object({
            batch_decision_id: z.string().optional(),
            metrics: z.record(z.any()).optional(),
            responses: z
                .record(
                    z.union([
                        z
                            .lazy(() => ResponsesSuccessfulPolicyResponse$.inboundSchema)
                            .and(
                                z
                                    .object({ http_status_code: z.literal("200") })
                                    .transform((v) => ({ httpStatusCode: v.http_status_code }))
                            ),
                        z
                            .lazy(() => ServerError$.inboundSchema)
                            .and(
                                z
                                    .object({ http_status_code: z.literal("500") })
                                    .transform((v) => ({ httpStatusCode: v.http_status_code }))
                            ),
                    ])
                )
                .optional(),
        })
        .transform((v) => {
            return remap$(v, {
                batch_decision_id: "batchDecisionId",
            });
        });

    export type Outbound = {
        batch_decision_id?: string | undefined;
        metrics?: { [k: string]: any } | undefined;
        responses?:
            | {
                  [k: string]:
                      | (ResponsesSuccessfulPolicyResponse$.Outbound & { http_status_code: "200" })
                      | (ServerError$.Outbound & { http_status_code: "500" });
              }
            | undefined;
    };

    export const outboundSchema: z.ZodType<Outbound, z.ZodTypeDef, BatchMixedResults> = z
        .object({
            batchDecisionId: z.string().optional(),
            metrics: z.record(z.any()).optional(),
            responses: z
                .record(
                    z.union([
                        z
                            .lazy(() => ResponsesSuccessfulPolicyResponse$.outboundSchema)
                            .and(
                                z
                                    .object({ httpStatusCode: z.literal("200") })
                                    .transform((v) => ({ http_status_code: v.httpStatusCode }))
                            ),
                        z
                            .lazy(() => ServerError$.outboundSchema)
                            .and(
                                z
                                    .object({ httpStatusCode: z.literal("500") })
                                    .transform((v) => ({ http_status_code: v.httpStatusCode }))
                            ),
                    ])
                )
                .optional(),
        })
        .transform((v) => {
            return remap$(v, {
                batchDecisionId: "batch_decision_id",
            });
        });
}