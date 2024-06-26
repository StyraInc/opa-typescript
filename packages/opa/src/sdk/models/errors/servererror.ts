/*
 * Code generated by Speakeasy (https://speakeasyapi.dev). DO NOT EDIT.
 */

import { remap as remap$ } from "../../../lib/primitives.js";
import * as z from "zod";

export type ServerErrorLocation = {
    col: number;
    file: string;
    row: number;
};

export type ServerErrorErrors = {
    code: string;
    location?: ServerErrorLocation | undefined;
    message: string;
};

/**
 * Server Error
 */
export type ServerErrorData = {
    code: string;
    decisionId?: string | undefined;
    errors?: Array<ServerErrorErrors> | undefined;
    message: string;
};

/**
 * Server Error
 */
export class ServerError extends Error {
    code: string;
    decisionId?: string | undefined;
    errors?: Array<ServerErrorErrors> | undefined;

    /** The original data that was passed to this error instance. */
    data$: ServerErrorData;

    constructor(err: ServerErrorData) {
        super("");
        this.data$ = err;

        this.code = err.code;
        if (err.decisionId != null) {
            this.decisionId = err.decisionId;
        }
        if (err.errors != null) {
            this.errors = err.errors;
        }

        this.message =
            "message" in err && typeof err.message === "string"
                ? err.message
                : "API error occurred";

        this.name = "ServerError";
    }
}

/** @internal */
export namespace ServerErrorLocation$ {
    export const inboundSchema: z.ZodType<ServerErrorLocation, z.ZodTypeDef, unknown> = z.object({
        col: z.number().int(),
        file: z.string(),
        row: z.number().int(),
    });

    export type Outbound = {
        col: number;
        file: string;
        row: number;
    };

    export const outboundSchema: z.ZodType<Outbound, z.ZodTypeDef, ServerErrorLocation> = z.object({
        col: z.number().int(),
        file: z.string(),
        row: z.number().int(),
    });
}

/** @internal */
export namespace ServerErrorErrors$ {
    export const inboundSchema: z.ZodType<ServerErrorErrors, z.ZodTypeDef, unknown> = z.object({
        code: z.string(),
        location: z.lazy(() => ServerErrorLocation$.inboundSchema).optional(),
        message: z.string(),
    });

    export type Outbound = {
        code: string;
        location?: ServerErrorLocation$.Outbound | undefined;
        message: string;
    };

    export const outboundSchema: z.ZodType<Outbound, z.ZodTypeDef, ServerErrorErrors> = z.object({
        code: z.string(),
        location: z.lazy(() => ServerErrorLocation$.outboundSchema).optional(),
        message: z.string(),
    });
}

/** @internal */
export namespace ServerError$ {
    export const inboundSchema: z.ZodType<ServerError, z.ZodTypeDef, unknown> = z
        .object({
            code: z.string(),
            decision_id: z.string().optional(),
            errors: z.array(z.lazy(() => ServerErrorErrors$.inboundSchema)).optional(),
            message: z.string(),
        })
        .transform((v) => {
            const remapped = remap$(v, {
                decision_id: "decisionId",
            });

            return new ServerError(remapped);
        });

    export type Outbound = {
        code: string;
        decision_id?: string | undefined;
        errors?: Array<ServerErrorErrors$.Outbound> | undefined;
        message: string;
    };

    export const outboundSchema: z.ZodType<Outbound, z.ZodTypeDef, ServerError> = z
        .instanceof(ServerError)
        .transform((v) => v.data$)
        .pipe(
            z
                .object({
                    code: z.string(),
                    decisionId: z.string().optional(),
                    errors: z.array(z.lazy(() => ServerErrorErrors$.outboundSchema)).optional(),
                    message: z.string(),
                })
                .transform((v) => {
                    return remap$(v, {
                        decisionId: "decision_id",
                    });
                })
        );
}
