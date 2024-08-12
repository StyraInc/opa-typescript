/*
 * Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.
 */

import { remap as remap$ } from "../../../lib/primitives.js";
import {
    ServerError,
    ServerError$inboundSchema,
    ServerError$Outbound,
    ServerError$outboundSchema,
} from "./servererror.js";
import * as z from "zod";

export type BatchServerErrorData = {
    batchDecisionId?: string | undefined;
    responses?: { [k: string]: ServerError } | undefined;
};

export class BatchServerError extends Error {
    batchDecisionId?: string | undefined;
    responses?: { [k: string]: ServerError } | undefined;

    /** The original data that was passed to this error instance. */
    data$: BatchServerErrorData;

    constructor(err: BatchServerErrorData) {
        const message =
            "message" in err && typeof err.message === "string"
                ? err.message
                : `API error occurred: ${JSON.stringify(err)}`;
        super(message);
        this.data$ = err;

        if (err.batchDecisionId != null) {
            this.batchDecisionId = err.batchDecisionId;
        }
        if (err.responses != null) {
            this.responses = err.responses;
        }

        this.name = "BatchServerError";
    }
}

/** @internal */
export const BatchServerError$inboundSchema: z.ZodType<BatchServerError, z.ZodTypeDef, unknown> = z
    .object({
        batch_decision_id: z.string().optional(),
        responses: z.record(ServerError$inboundSchema).optional(),
    })
    .transform((v) => {
        const remapped = remap$(v, {
            batch_decision_id: "batchDecisionId",
        });

        return new BatchServerError(remapped);
    });

/** @internal */
export type BatchServerError$Outbound = {
    batch_decision_id?: string | undefined;
    responses?: { [k: string]: ServerError$Outbound } | undefined;
};

/** @internal */
export const BatchServerError$outboundSchema: z.ZodType<
    BatchServerError$Outbound,
    z.ZodTypeDef,
    BatchServerError
> = z
    .instanceof(BatchServerError)
    .transform((v) => v.data$)
    .pipe(
        z
            .object({
                batchDecisionId: z.string().optional(),
                responses: z.record(ServerError$outboundSchema).optional(),
            })
            .transform((v) => {
                return remap$(v, {
                    batchDecisionId: "batch_decision_id",
                });
            })
    );

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace BatchServerError$ {
    /** @deprecated use `BatchServerError$inboundSchema` instead. */
    export const inboundSchema = BatchServerError$inboundSchema;
    /** @deprecated use `BatchServerError$outboundSchema` instead. */
    export const outboundSchema = BatchServerError$outboundSchema;
    /** @deprecated use `BatchServerError$Outbound` instead. */
    export type Outbound = BatchServerError$Outbound;
}
