/*
 * Code generated by Speakeasy (https://speakeasyapi.dev). DO NOT EDIT.
 */

import { remap as remap$ } from "../../../lib/primitives.js";
import { ServerError, ServerError$ } from "./servererror.js";
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
        super("");
        this.data$ = err;

        if (err.batchDecisionId != null) {
            this.batchDecisionId = err.batchDecisionId;
        }
        if (err.responses != null) {
            this.responses = err.responses;
        }

        this.message =
            "message" in err && typeof err.message === "string"
                ? err.message
                : "API error occurred";

        this.name = "BatchServerError";
    }
}

/** @internal */
export namespace BatchServerError$ {
    export const inboundSchema: z.ZodType<BatchServerError, z.ZodTypeDef, unknown> = z
        .object({
            batch_decision_id: z.string().optional(),
            responses: z.record(ServerError$.inboundSchema).optional(),
        })
        .transform((v) => {
            const remapped = remap$(v, {
                batch_decision_id: "batchDecisionId",
            });

            return new BatchServerError(remapped);
        });

    export type Outbound = {
        batch_decision_id?: string | undefined;
        responses?: { [k: string]: ServerError$.Outbound } | undefined;
    };

    export const outboundSchema: z.ZodType<Outbound, z.ZodTypeDef, BatchServerError> = z
        .instanceof(BatchServerError)
        .transform((v) => v.data$)
        .pipe(
            z
                .object({
                    batchDecisionId: z.string().optional(),
                    responses: z.record(ServerError$.outboundSchema).optional(),
                })
                .transform((v) => {
                    return remap$(v, {
                        batchDecisionId: "batch_decision_id",
                    });
                })
        );
}