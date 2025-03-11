/*
 * Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.
 */

import * as z from "zod";
import { remap as remap$ } from "../../../lib/primitives.js";
import {
  collectExtraKeys as collectExtraKeys$,
  safeParse,
} from "../../../lib/schemas.js";
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
}

export type Sqlserver = {};

export type Mysql = {};

export type Postgresql = {};

export type TargetSQLTableMappings = {
  sqlserver?: Sqlserver | undefined;
  mysql?: Mysql | undefined;
  postgresql?: Postgresql | undefined;
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
  additionalProperties?: { [k: string]: any };
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
export const Sqlserver$inboundSchema: z.ZodType<
  Sqlserver,
  z.ZodTypeDef,
  unknown
> = z.object({});

/** @internal */
export type Sqlserver$Outbound = {};

/** @internal */
export const Sqlserver$outboundSchema: z.ZodType<
  Sqlserver$Outbound,
  z.ZodTypeDef,
  Sqlserver
> = z.object({});

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace Sqlserver$ {
  /** @deprecated use `Sqlserver$inboundSchema` instead. */
  export const inboundSchema = Sqlserver$inboundSchema;
  /** @deprecated use `Sqlserver$outboundSchema` instead. */
  export const outboundSchema = Sqlserver$outboundSchema;
  /** @deprecated use `Sqlserver$Outbound` instead. */
  export type Outbound = Sqlserver$Outbound;
}

export function sqlserverToJSON(sqlserver: Sqlserver): string {
  return JSON.stringify(Sqlserver$outboundSchema.parse(sqlserver));
}

export function sqlserverFromJSON(
  jsonString: string,
): SafeParseResult<Sqlserver, SDKValidationError> {
  return safeParse(
    jsonString,
    (x) => Sqlserver$inboundSchema.parse(JSON.parse(x)),
    `Failed to parse 'Sqlserver' from JSON`,
  );
}

/** @internal */
export const Mysql$inboundSchema: z.ZodType<Mysql, z.ZodTypeDef, unknown> = z
  .object({});

/** @internal */
export type Mysql$Outbound = {};

/** @internal */
export const Mysql$outboundSchema: z.ZodType<
  Mysql$Outbound,
  z.ZodTypeDef,
  Mysql
> = z.object({});

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace Mysql$ {
  /** @deprecated use `Mysql$inboundSchema` instead. */
  export const inboundSchema = Mysql$inboundSchema;
  /** @deprecated use `Mysql$outboundSchema` instead. */
  export const outboundSchema = Mysql$outboundSchema;
  /** @deprecated use `Mysql$Outbound` instead. */
  export type Outbound = Mysql$Outbound;
}

export function mysqlToJSON(mysql: Mysql): string {
  return JSON.stringify(Mysql$outboundSchema.parse(mysql));
}

export function mysqlFromJSON(
  jsonString: string,
): SafeParseResult<Mysql, SDKValidationError> {
  return safeParse(
    jsonString,
    (x) => Mysql$inboundSchema.parse(JSON.parse(x)),
    `Failed to parse 'Mysql' from JSON`,
  );
}

/** @internal */
export const Postgresql$inboundSchema: z.ZodType<
  Postgresql,
  z.ZodTypeDef,
  unknown
> = z.object({});

/** @internal */
export type Postgresql$Outbound = {};

/** @internal */
export const Postgresql$outboundSchema: z.ZodType<
  Postgresql$Outbound,
  z.ZodTypeDef,
  Postgresql
> = z.object({});

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace Postgresql$ {
  /** @deprecated use `Postgresql$inboundSchema` instead. */
  export const inboundSchema = Postgresql$inboundSchema;
  /** @deprecated use `Postgresql$outboundSchema` instead. */
  export const outboundSchema = Postgresql$outboundSchema;
  /** @deprecated use `Postgresql$Outbound` instead. */
  export type Outbound = Postgresql$Outbound;
}

export function postgresqlToJSON(postgresql: Postgresql): string {
  return JSON.stringify(Postgresql$outboundSchema.parse(postgresql));
}

export function postgresqlFromJSON(
  jsonString: string,
): SafeParseResult<Postgresql, SDKValidationError> {
  return safeParse(
    jsonString,
    (x) => Postgresql$inboundSchema.parse(JSON.parse(x)),
    `Failed to parse 'Postgresql' from JSON`,
  );
}

/** @internal */
export const TargetSQLTableMappings$inboundSchema: z.ZodType<
  TargetSQLTableMappings,
  z.ZodTypeDef,
  unknown
> = z.object({
  sqlserver: z.lazy(() => Sqlserver$inboundSchema).optional(),
  mysql: z.lazy(() => Mysql$inboundSchema).optional(),
  postgresql: z.lazy(() => Postgresql$inboundSchema).optional(),
});

/** @internal */
export type TargetSQLTableMappings$Outbound = {
  sqlserver?: Sqlserver$Outbound | undefined;
  mysql?: Mysql$Outbound | undefined;
  postgresql?: Postgresql$Outbound | undefined;
};

/** @internal */
export const TargetSQLTableMappings$outboundSchema: z.ZodType<
  TargetSQLTableMappings$Outbound,
  z.ZodTypeDef,
  TargetSQLTableMappings
> = z.object({
  sqlserver: z.lazy(() => Sqlserver$outboundSchema).optional(),
  mysql: z.lazy(() => Mysql$outboundSchema).optional(),
  postgresql: z.lazy(() => Postgresql$outboundSchema).optional(),
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
> = collectExtraKeys$(
  z.object({
    disableInlining: z.array(z.string()).optional(),
    targetDialects: z.array(TargetDialects$inboundSchema).optional(),
    targetSQLTableMappings: z.lazy(() => TargetSQLTableMappings$inboundSchema)
      .optional(),
  }).catchall(z.any()),
  "additionalProperties",
  true,
);

/** @internal */
export type CompileOptions$Outbound = {
  disableInlining?: Array<string> | undefined;
  targetDialects?: Array<string> | undefined;
  targetSQLTableMappings?: TargetSQLTableMappings$Outbound | undefined;
  [additionalProperties: string]: unknown;
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
  additionalProperties: z.record(z.any()),
}).transform((v) => {
  return {
    ...v.additionalProperties,
    ...remap$(v, {
      additionalProperties: null,
    }),
  };
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
