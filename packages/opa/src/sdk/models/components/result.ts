/*
 * Code generated by Speakeasy (https://speakeasyapi.dev). DO NOT EDIT.
 */

import * as z from "zod";

/**
 * The base or virtual document referred to by the URL path. If the path is undefined, this key will be omitted.
 */
export type Result = boolean | string | number | Array<any> | { [k: string]: any };

/** @internal */
export namespace Result$ {
    export const inboundSchema: z.ZodType<Result, z.ZodTypeDef, unknown> = z.union([
        z.boolean(),
        z.string(),
        z.number(),
        z.array(z.any()),
        z.record(z.any()),
    ]);

    export type Outbound = boolean | string | number | Array<any> | { [k: string]: any };
    export const outboundSchema: z.ZodType<Outbound, z.ZodTypeDef, Result> = z.union([
        z.boolean(),
        z.string(),
        z.number(),
        z.array(z.any()),
        z.record(z.any()),
    ]);
}
