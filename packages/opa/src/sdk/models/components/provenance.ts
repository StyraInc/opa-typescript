/*
 * Code generated by Speakeasy (https://speakeasyapi.dev). DO NOT EDIT.
 */

import { remap as remap$ } from "../../../lib/primitives.js";
import * as z from "zod";

export type Revision = {
    revision: string;
};

/**
 * Provenance information can be requested on individual API calls and are returned inline with the API response. To obtain provenance information on an API call, specify the `provenance=true` query parameter when executing the API call.
 */
export type Provenance = {
    buildCommit?: string | undefined;
    buildHost?: string | undefined;
    buildTimestamp?: Date | undefined;
    bundles?: { [k: string]: Revision } | undefined;
    version?: string | undefined;
};

/** @internal */
export namespace Revision$ {
    export const inboundSchema: z.ZodType<Revision, z.ZodTypeDef, unknown> = z.object({
        revision: z.string(),
    });

    export type Outbound = {
        revision: string;
    };

    export const outboundSchema: z.ZodType<Outbound, z.ZodTypeDef, Revision> = z.object({
        revision: z.string(),
    });
}

/** @internal */
export namespace Provenance$ {
    export const inboundSchema: z.ZodType<Provenance, z.ZodTypeDef, unknown> = z
        .object({
            build_commit: z.string().optional(),
            build_host: z.string().optional(),
            build_timestamp: z
                .string()
                .datetime({ offset: true })
                .transform((v) => new Date(v))
                .optional(),
            bundles: z.record(z.lazy(() => Revision$.inboundSchema)).optional(),
            version: z.string().optional(),
        })
        .transform((v) => {
            return remap$(v, {
                build_commit: "buildCommit",
                build_host: "buildHost",
                build_timestamp: "buildTimestamp",
            });
        });

    export type Outbound = {
        build_commit?: string | undefined;
        build_host?: string | undefined;
        build_timestamp?: string | undefined;
        bundles?: { [k: string]: Revision$.Outbound } | undefined;
        version?: string | undefined;
    };

    export const outboundSchema: z.ZodType<Outbound, z.ZodTypeDef, Provenance> = z
        .object({
            buildCommit: z.string().optional(),
            buildHost: z.string().optional(),
            buildTimestamp: z
                .date()
                .transform((v) => v.toISOString())
                .optional(),
            bundles: z.record(z.lazy(() => Revision$.outboundSchema)).optional(),
            version: z.string().optional(),
        })
        .transform((v) => {
            return remap$(v, {
                buildCommit: "build_commit",
                buildHost: "build_host",
                buildTimestamp: "build_timestamp",
            });
        });
}