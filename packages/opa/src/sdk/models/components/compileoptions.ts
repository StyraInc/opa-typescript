/*
 * Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.
 */

import * as z from "zod";
import { safeParse } from "../../../lib/schemas.js";
import { Result as SafeParseResult } from "../../../types/fp.js";
import { SDKValidationError } from "../errors/sdkvalidationerror.js";

export enum TargetDialects {
  UcastPlusAll = "ucast+all",
  UcastPlusMinimal = "ucast+minimal",
  UcastPlusPrisma = "ucast+prisma",
  UcastPlusLinq = "ucast+linq",
  SqlPlusSqlserver = "sql+sqlserver",
  SqlPlusMysql = "sql+mysql",
  SqlPlusPostgresql = "sql+postgresql",
  SqlPlusSqlite = "sql+sqlite",
}

export type TargetSQLTableMappings = {
  sqlserver?: { [k: string]: any } | undefined;
  mysql?: { [k: string]: any } | undefined;
  postgresql?: { [k: string]: any } | undefined;
  sqlite?: { [k: string]: any } | undefined;
};

/**
 * Additional options to use during partial evaluation. Only the disableInlining option is currently supported in OPA. Enterprise OPA may support additional options.
 */
export type CompileOptions = {
  /**
   * A list of paths to exclude from partial evaluation inlining.
   */
  disableInlining?: Array<string> | undefined;
  /**
   * The output targets for partial evaluation. Different targets will have different constraints.
   */
  targetDialects?: Array<TargetDialects> | undefined;
  targetSQLTableMappings?: TargetSQLTableMappings | undefined;
};

/** @internal */
export const TargetDialects$inboundSchema: z.ZodNativeEnum<
  typeof TargetDialects
> = z.nativeEnum(TargetDialects);

/** @internal */
export const TargetDialects$outboundSchema: z.ZodNativeEnum<
  typeof TargetDialects
> = TargetDialects$inboundSchema;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace TargetDialects$ {
  /** @deprecated use `TargetDialects$inboundSchema` instead. */
  export const inboundSchema = TargetDialects$inboundSchema;
  /** @deprecated use `TargetDialects$outboundSchema` instead. */
  export const outboundSchema = TargetDialects$outboundSchema;
}

/** @internal */
export const TargetSQLTableMappings$inboundSchema: z.ZodType<
  TargetSQLTableMappings,
  z.ZodTypeDef,
  unknown
> = z.object({
  sqlserver: z.record(z.any()).optional(),
  mysql: z.record(z.any()).optional(),
  postgresql: z.record(z.any()).optional(),
  sqlite: z.record(z.any()).optional(),
});

/** @internal */
export type TargetSQLTableMappings$Outbound = {
  sqlserver?: { [k: string]: any } | undefined;
  mysql?: { [k: string]: any } | undefined;
  postgresql?: { [k: string]: any } | undefined;
  sqlite?: { [k: string]: any } | undefined;
};

/** @internal */
export const TargetSQLTableMappings$outboundSchema: z.ZodType<
  TargetSQLTableMappings$Outbound,
  z.ZodTypeDef,
  TargetSQLTableMappings
> = z.object({
  sqlserver: z.record(z.any()).optional(),
  mysql: z.record(z.any()).optional(),
  postgresql: z.record(z.any()).optional(),
  sqlite: z.record(z.any()).optional(),
});

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace TargetSQLTableMappings$ {
  /** @deprecated use `TargetSQLTableMappings$inboundSchema` instead. */
  export const inboundSchema = TargetSQLTableMappings$inboundSchema;
  /** @deprecated use `TargetSQLTableMappings$outboundSchema` instead. */
  export const outboundSchema = TargetSQLTableMappings$outboundSchema;
  /** @deprecated use `TargetSQLTableMappings$Outbound` instead. */
  export type Outbound = TargetSQLTableMappings$Outbound;
}

export function targetSQLTableMappingsToJSON(
  targetSQLTableMappings: TargetSQLTableMappings,
): string {
  return JSON.stringify(
    TargetSQLTableMappings$outboundSchema.parse(targetSQLTableMappings),
  );
}

export function targetSQLTableMappingsFromJSON(
  jsonString: string,
): SafeParseResult<TargetSQLTableMappings, SDKValidationError> {
  return safeParse(
    jsonString,
    (x) => TargetSQLTableMappings$inboundSchema.parse(JSON.parse(x)),
    `Failed to parse 'TargetSQLTableMappings' from JSON`,
  );
}

/** @internal */
export const CompileOptions$inboundSchema: z.ZodType<
  CompileOptions,
  z.ZodTypeDef,
  unknown
> = z.object({
  disableInlining: z.array(z.string()).optional(),
  targetDialects: z.array(TargetDialects$inboundSchema).optional(),
  targetSQLTableMappings: z.lazy(() => TargetSQLTableMappings$inboundSchema)
    .optional(),
});

/** @internal */
export type CompileOptions$Outbound = {
  disableInlining?: Array<string> | undefined;
  targetDialects?: Array<string> | undefined;
  targetSQLTableMappings?: TargetSQLTableMappings$Outbound | undefined;
};

/** @internal */
export const CompileOptions$outboundSchema: z.ZodType<
  CompileOptions$Outbound,
  z.ZodTypeDef,
  CompileOptions
> = z.object({
  disableInlining: z.array(z.string()).optional(),
  targetDialects: z.array(TargetDialects$outboundSchema).optional(),
  targetSQLTableMappings: z.lazy(() => TargetSQLTableMappings$outboundSchema)
    .optional(),
});

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace CompileOptions$ {
  /** @deprecated use `CompileOptions$inboundSchema` instead. */
  export const inboundSchema = CompileOptions$inboundSchema;
  /** @deprecated use `CompileOptions$outboundSchema` instead. */
  export const outboundSchema = CompileOptions$outboundSchema;
  /** @deprecated use `CompileOptions$Outbound` instead. */
  export type Outbound = CompileOptions$Outbound;
}

export function compileOptionsToJSON(compileOptions: CompileOptions): string {
  return JSON.stringify(CompileOptions$outboundSchema.parse(compileOptions));
}

export function compileOptionsFromJSON(
  jsonString: string,
): SafeParseResult<CompileOptions, SDKValidationError> {
  return safeParse(
    jsonString,
    (x) => CompileOptions$inboundSchema.parse(JSON.parse(x)),
    `Failed to parse 'CompileOptions' from JSON`,
  );
}
