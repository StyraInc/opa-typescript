/*
 * Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.
 */

import * as z from "zod";
import { remap as remap$ } from "../../../lib/primitives.js";
import { safeParse } from "../../../lib/schemas.js";
import { Result as SafeParseResult } from "../../../types/fp.js";
import { SDKValidationError } from "../errors/sdkvalidationerror.js";

export type Revision = {
  revision: string;
};

/**
 * Provenance information can be requested on individual API calls and are returned inline with the API response. To obtain provenance information on an API call, specify the `provenance=true` query parameter when executing the API call.
 */
export type Provenance = {
  version?: string | undefined;
  buildCommit?: string | undefined;
  buildTimestamp?: Date | undefined;
  buildHost?: string | undefined;
  bundles?: { [k: string]: Revision } | undefined;
};

/** @internal */
export const Revision$inboundSchema: z.ZodType<
  Revision,
  z.ZodTypeDef,
  unknown
> = z.object({
  revision: z.string(),
});

/** @internal */
export type Revision$Outbound = {
  revision: string;
};

/** @internal */
export const Revision$outboundSchema: z.ZodType<
  Revision$Outbound,
  z.ZodTypeDef,
  Revision
> = z.object({
  revision: z.string(),
});

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace Revision$ {
  /** @deprecated use `Revision$inboundSchema` instead. */
  export const inboundSchema = Revision$inboundSchema;
  /** @deprecated use `Revision$outboundSchema` instead. */
  export const outboundSchema = Revision$outboundSchema;
  /** @deprecated use `Revision$Outbound` instead. */
  export type Outbound = Revision$Outbound;
}

export function revisionToJSON(revision: Revision): string {
  return JSON.stringify(Revision$outboundSchema.parse(revision));
}

export function revisionFromJSON(
  jsonString: string,
): SafeParseResult<Revision, SDKValidationError> {
  return safeParse(
    jsonString,
    (x) => Revision$inboundSchema.parse(JSON.parse(x)),
    `Failed to parse 'Revision' from JSON`,
  );
}

/** @internal */
export const Provenance$inboundSchema: z.ZodType<
  Provenance,
  z.ZodTypeDef,
  unknown
> = z.object({
  version: z.string().optional(),
  build_commit: z.string().optional(),
  build_timestamp: z.string().datetime({ offset: true }).transform(v =>
    new Date(v)
  ).optional(),
  build_host: z.string().optional(),
  bundles: z.record(z.lazy(() => Revision$inboundSchema)).optional(),
}).transform((v) => {
  return remap$(v, {
    "build_commit": "buildCommit",
    "build_timestamp": "buildTimestamp",
    "build_host": "buildHost",
  });
});

/** @internal */
export type Provenance$Outbound = {
  version?: string | undefined;
  build_commit?: string | undefined;
  build_timestamp?: string | undefined;
  build_host?: string | undefined;
  bundles?: { [k: string]: Revision$Outbound } | undefined;
};

/** @internal */
export const Provenance$outboundSchema: z.ZodType<
  Provenance$Outbound,
  z.ZodTypeDef,
  Provenance
> = z.object({
  version: z.string().optional(),
  buildCommit: z.string().optional(),
  buildTimestamp: z.date().transform(v => v.toISOString()).optional(),
  buildHost: z.string().optional(),
  bundles: z.record(z.lazy(() => Revision$outboundSchema)).optional(),
}).transform((v) => {
  return remap$(v, {
    buildCommit: "build_commit",
    buildTimestamp: "build_timestamp",
    buildHost: "build_host",
  });
});

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace Provenance$ {
  /** @deprecated use `Provenance$inboundSchema` instead. */
  export const inboundSchema = Provenance$inboundSchema;
  /** @deprecated use `Provenance$outboundSchema` instead. */
  export const outboundSchema = Provenance$outboundSchema;
  /** @deprecated use `Provenance$Outbound` instead. */
  export type Outbound = Provenance$Outbound;
}

export function provenanceToJSON(provenance: Provenance): string {
  return JSON.stringify(Provenance$outboundSchema.parse(provenance));
}

export function provenanceFromJSON(
  jsonString: string,
): SafeParseResult<Provenance, SDKValidationError> {
  return safeParse(
    jsonString,
    (x) => Provenance$inboundSchema.parse(JSON.parse(x)),
    `Failed to parse 'Provenance' from JSON`,
  );
}
