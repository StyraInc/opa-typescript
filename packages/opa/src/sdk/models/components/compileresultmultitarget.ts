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
import {
  MaskingRule,
  MaskingRule$inboundSchema,
  MaskingRule$Outbound,
  MaskingRule$outboundSchema,
} from "./maskingrule.js";

/**
 * UCAST JSON object describing the conditions under which the query is true.
 */
export type CompileResultMultitargetQuery = {};

export type Ucast = {
  /**
   * UCAST JSON object describing the conditions under which the query is true.
   */
  query?: CompileResultMultitargetQuery | undefined;
  /**
   * Column masking rules, where the first two nested keys represent the entity name and the property name, and the value describes which masking function to use.
   */
  masks?: { [k: string]: { [k: string]: MaskingRule } } | undefined;
};

export type Sqlserver = {
  /**
   * String representing the SQL equivalent of the conditions under which the query is true.
   */
  query?: string | undefined;
  /**
   * Column masking rules, where the first two nested keys represent the table name and the column name, and the value describes which masking function to use.
   */
  masks?: { [k: string]: { [k: string]: MaskingRule } } | undefined;
};

export type Mysql = {
  /**
   * String representing the SQL equivalent of the conditions under which the query is true.
   */
  query?: string | undefined;
  /**
   * Column masking rules, where the first two nested keys represent the table name and the column name, and the value describes which masking function to use.
   */
  masks?: { [k: string]: { [k: string]: MaskingRule } } | undefined;
};

export type Postgresql = {
  /**
   * String representing the SQL equivalent of the conditions under which the query is true
   */
  query?: string | undefined;
  /**
   * Column masking rules, where the first two nested keys represent the table name and the column name, and the value describes which masking function to use.
   */
  masks?: { [k: string]: { [k: string]: MaskingRule } } | undefined;
};

export type Sqlite = {
  /**
   * String representing the SQL equivalent of the conditions under which the query is true
   */
  query?: string | undefined;
  /**
   * Column masking rules, where the first two nested keys represent the table name and the column name, and the value describes which masking function to use.
   */
  masks?: { [k: string]: { [k: string]: MaskingRule } } | undefined;
};

export type Targets = {
  ucast?: Ucast | undefined;
  sqlserver?: Sqlserver | undefined;
  mysql?: Mysql | undefined;
  postgresql?: Postgresql | undefined;
  sqlite?: Sqlite | undefined;
};

/**
 * The partially evaluated result of the query in each target dialect.
 */
export type CompileResultMultitargetResult = {
  targets?: Targets | undefined;
  additionalProperties?: { [k: string]: any };
};

/**
 * The partially evaluated result of the query, for each target dialect. Result will be empty if the query is never true.
 */
export type CompileResultMultitarget = {
  /**
   * The partially evaluated result of the query in each target dialect.
   */
  result?: CompileResultMultitargetResult | undefined;
};

/** @internal */
export const CompileResultMultitargetQuery$inboundSchema: z.ZodType<
  CompileResultMultitargetQuery,
  z.ZodTypeDef,
  unknown
> = z.object({});

/** @internal */
export type CompileResultMultitargetQuery$Outbound = {};

/** @internal */
export const CompileResultMultitargetQuery$outboundSchema: z.ZodType<
  CompileResultMultitargetQuery$Outbound,
  z.ZodTypeDef,
  CompileResultMultitargetQuery
> = z.object({});

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace CompileResultMultitargetQuery$ {
  /** @deprecated use `CompileResultMultitargetQuery$inboundSchema` instead. */
  export const inboundSchema = CompileResultMultitargetQuery$inboundSchema;
  /** @deprecated use `CompileResultMultitargetQuery$outboundSchema` instead. */
  export const outboundSchema = CompileResultMultitargetQuery$outboundSchema;
  /** @deprecated use `CompileResultMultitargetQuery$Outbound` instead. */
  export type Outbound = CompileResultMultitargetQuery$Outbound;
}

export function compileResultMultitargetQueryToJSON(
  compileResultMultitargetQuery: CompileResultMultitargetQuery,
): string {
  return JSON.stringify(
    CompileResultMultitargetQuery$outboundSchema.parse(
      compileResultMultitargetQuery,
    ),
  );
}

export function compileResultMultitargetQueryFromJSON(
  jsonString: string,
): SafeParseResult<CompileResultMultitargetQuery, SDKValidationError> {
  return safeParse(
    jsonString,
    (x) => CompileResultMultitargetQuery$inboundSchema.parse(JSON.parse(x)),
    `Failed to parse 'CompileResultMultitargetQuery' from JSON`,
  );
}

/** @internal */
export const Ucast$inboundSchema: z.ZodType<Ucast, z.ZodTypeDef, unknown> = z
  .object({
    query: z.lazy(() => CompileResultMultitargetQuery$inboundSchema).optional(),
    masks: z.record(z.record(MaskingRule$inboundSchema)).optional(),
  });

/** @internal */
export type Ucast$Outbound = {
  query?: CompileResultMultitargetQuery$Outbound | undefined;
  masks?: { [k: string]: { [k: string]: MaskingRule$Outbound } } | undefined;
};

/** @internal */
export const Ucast$outboundSchema: z.ZodType<
  Ucast$Outbound,
  z.ZodTypeDef,
  Ucast
> = z.object({
  query: z.lazy(() => CompileResultMultitargetQuery$outboundSchema).optional(),
  masks: z.record(z.record(MaskingRule$outboundSchema)).optional(),
});

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace Ucast$ {
  /** @deprecated use `Ucast$inboundSchema` instead. */
  export const inboundSchema = Ucast$inboundSchema;
  /** @deprecated use `Ucast$outboundSchema` instead. */
  export const outboundSchema = Ucast$outboundSchema;
  /** @deprecated use `Ucast$Outbound` instead. */
  export type Outbound = Ucast$Outbound;
}

export function ucastToJSON(ucast: Ucast): string {
  return JSON.stringify(Ucast$outboundSchema.parse(ucast));
}

export function ucastFromJSON(
  jsonString: string,
): SafeParseResult<Ucast, SDKValidationError> {
  return safeParse(
    jsonString,
    (x) => Ucast$inboundSchema.parse(JSON.parse(x)),
    `Failed to parse 'Ucast' from JSON`,
  );
}

/** @internal */
export const Sqlserver$inboundSchema: z.ZodType<
  Sqlserver,
  z.ZodTypeDef,
  unknown
> = z.object({
  query: z.string().optional(),
  masks: z.record(z.record(MaskingRule$inboundSchema)).optional(),
});

/** @internal */
export type Sqlserver$Outbound = {
  query?: string | undefined;
  masks?: { [k: string]: { [k: string]: MaskingRule$Outbound } } | undefined;
};

/** @internal */
export const Sqlserver$outboundSchema: z.ZodType<
  Sqlserver$Outbound,
  z.ZodTypeDef,
  Sqlserver
> = z.object({
  query: z.string().optional(),
  masks: z.record(z.record(MaskingRule$outboundSchema)).optional(),
});

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
  .object({
    query: z.string().optional(),
    masks: z.record(z.record(MaskingRule$inboundSchema)).optional(),
  });

/** @internal */
export type Mysql$Outbound = {
  query?: string | undefined;
  masks?: { [k: string]: { [k: string]: MaskingRule$Outbound } } | undefined;
};

/** @internal */
export const Mysql$outboundSchema: z.ZodType<
  Mysql$Outbound,
  z.ZodTypeDef,
  Mysql
> = z.object({
  query: z.string().optional(),
  masks: z.record(z.record(MaskingRule$outboundSchema)).optional(),
});

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
> = z.object({
  query: z.string().optional(),
  masks: z.record(z.record(MaskingRule$inboundSchema)).optional(),
});

/** @internal */
export type Postgresql$Outbound = {
  query?: string | undefined;
  masks?: { [k: string]: { [k: string]: MaskingRule$Outbound } } | undefined;
};

/** @internal */
export const Postgresql$outboundSchema: z.ZodType<
  Postgresql$Outbound,
  z.ZodTypeDef,
  Postgresql
> = z.object({
  query: z.string().optional(),
  masks: z.record(z.record(MaskingRule$outboundSchema)).optional(),
});

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
export const Sqlite$inboundSchema: z.ZodType<Sqlite, z.ZodTypeDef, unknown> = z
  .object({
    query: z.string().optional(),
    masks: z.record(z.record(MaskingRule$inboundSchema)).optional(),
  });

/** @internal */
export type Sqlite$Outbound = {
  query?: string | undefined;
  masks?: { [k: string]: { [k: string]: MaskingRule$Outbound } } | undefined;
};

/** @internal */
export const Sqlite$outboundSchema: z.ZodType<
  Sqlite$Outbound,
  z.ZodTypeDef,
  Sqlite
> = z.object({
  query: z.string().optional(),
  masks: z.record(z.record(MaskingRule$outboundSchema)).optional(),
});

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace Sqlite$ {
  /** @deprecated use `Sqlite$inboundSchema` instead. */
  export const inboundSchema = Sqlite$inboundSchema;
  /** @deprecated use `Sqlite$outboundSchema` instead. */
  export const outboundSchema = Sqlite$outboundSchema;
  /** @deprecated use `Sqlite$Outbound` instead. */
  export type Outbound = Sqlite$Outbound;
}

export function sqliteToJSON(sqlite: Sqlite): string {
  return JSON.stringify(Sqlite$outboundSchema.parse(sqlite));
}

export function sqliteFromJSON(
  jsonString: string,
): SafeParseResult<Sqlite, SDKValidationError> {
  return safeParse(
    jsonString,
    (x) => Sqlite$inboundSchema.parse(JSON.parse(x)),
    `Failed to parse 'Sqlite' from JSON`,
  );
}

/** @internal */
export const Targets$inboundSchema: z.ZodType<Targets, z.ZodTypeDef, unknown> =
  z.object({
    ucast: z.lazy(() => Ucast$inboundSchema).optional(),
    sqlserver: z.lazy(() => Sqlserver$inboundSchema).optional(),
    mysql: z.lazy(() => Mysql$inboundSchema).optional(),
    postgresql: z.lazy(() => Postgresql$inboundSchema).optional(),
    sqlite: z.lazy(() => Sqlite$inboundSchema).optional(),
  });

/** @internal */
export type Targets$Outbound = {
  ucast?: Ucast$Outbound | undefined;
  sqlserver?: Sqlserver$Outbound | undefined;
  mysql?: Mysql$Outbound | undefined;
  postgresql?: Postgresql$Outbound | undefined;
  sqlite?: Sqlite$Outbound | undefined;
};

/** @internal */
export const Targets$outboundSchema: z.ZodType<
  Targets$Outbound,
  z.ZodTypeDef,
  Targets
> = z.object({
  ucast: z.lazy(() => Ucast$outboundSchema).optional(),
  sqlserver: z.lazy(() => Sqlserver$outboundSchema).optional(),
  mysql: z.lazy(() => Mysql$outboundSchema).optional(),
  postgresql: z.lazy(() => Postgresql$outboundSchema).optional(),
  sqlite: z.lazy(() => Sqlite$outboundSchema).optional(),
});

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace Targets$ {
  /** @deprecated use `Targets$inboundSchema` instead. */
  export const inboundSchema = Targets$inboundSchema;
  /** @deprecated use `Targets$outboundSchema` instead. */
  export const outboundSchema = Targets$outboundSchema;
  /** @deprecated use `Targets$Outbound` instead. */
  export type Outbound = Targets$Outbound;
}

export function targetsToJSON(targets: Targets): string {
  return JSON.stringify(Targets$outboundSchema.parse(targets));
}

export function targetsFromJSON(
  jsonString: string,
): SafeParseResult<Targets, SDKValidationError> {
  return safeParse(
    jsonString,
    (x) => Targets$inboundSchema.parse(JSON.parse(x)),
    `Failed to parse 'Targets' from JSON`,
  );
}

/** @internal */
export const CompileResultMultitargetResult$inboundSchema: z.ZodType<
  CompileResultMultitargetResult,
  z.ZodTypeDef,
  unknown
> = collectExtraKeys$(
  z.object({
    targets: z.lazy(() => Targets$inboundSchema).optional(),
  }).catchall(z.any()),
  "additionalProperties",
  true,
);

/** @internal */
export type CompileResultMultitargetResult$Outbound = {
  targets?: Targets$Outbound | undefined;
  [additionalProperties: string]: unknown;
};

/** @internal */
export const CompileResultMultitargetResult$outboundSchema: z.ZodType<
  CompileResultMultitargetResult$Outbound,
  z.ZodTypeDef,
  CompileResultMultitargetResult
> = z.object({
  targets: z.lazy(() => Targets$outboundSchema).optional(),
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
export namespace CompileResultMultitargetResult$ {
  /** @deprecated use `CompileResultMultitargetResult$inboundSchema` instead. */
  export const inboundSchema = CompileResultMultitargetResult$inboundSchema;
  /** @deprecated use `CompileResultMultitargetResult$outboundSchema` instead. */
  export const outboundSchema = CompileResultMultitargetResult$outboundSchema;
  /** @deprecated use `CompileResultMultitargetResult$Outbound` instead. */
  export type Outbound = CompileResultMultitargetResult$Outbound;
}

export function compileResultMultitargetResultToJSON(
  compileResultMultitargetResult: CompileResultMultitargetResult,
): string {
  return JSON.stringify(
    CompileResultMultitargetResult$outboundSchema.parse(
      compileResultMultitargetResult,
    ),
  );
}

export function compileResultMultitargetResultFromJSON(
  jsonString: string,
): SafeParseResult<CompileResultMultitargetResult, SDKValidationError> {
  return safeParse(
    jsonString,
    (x) => CompileResultMultitargetResult$inboundSchema.parse(JSON.parse(x)),
    `Failed to parse 'CompileResultMultitargetResult' from JSON`,
  );
}

/** @internal */
export const CompileResultMultitarget$inboundSchema: z.ZodType<
  CompileResultMultitarget,
  z.ZodTypeDef,
  unknown
> = z.object({
  result: z.lazy(() => CompileResultMultitargetResult$inboundSchema).optional(),
});

/** @internal */
export type CompileResultMultitarget$Outbound = {
  result?: CompileResultMultitargetResult$Outbound | undefined;
};

/** @internal */
export const CompileResultMultitarget$outboundSchema: z.ZodType<
  CompileResultMultitarget$Outbound,
  z.ZodTypeDef,
  CompileResultMultitarget
> = z.object({
  result: z.lazy(() => CompileResultMultitargetResult$outboundSchema)
    .optional(),
});

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace CompileResultMultitarget$ {
  /** @deprecated use `CompileResultMultitarget$inboundSchema` instead. */
  export const inboundSchema = CompileResultMultitarget$inboundSchema;
  /** @deprecated use `CompileResultMultitarget$outboundSchema` instead. */
  export const outboundSchema = CompileResultMultitarget$outboundSchema;
  /** @deprecated use `CompileResultMultitarget$Outbound` instead. */
  export type Outbound = CompileResultMultitarget$Outbound;
}

export function compileResultMultitargetToJSON(
  compileResultMultitarget: CompileResultMultitarget,
): string {
  return JSON.stringify(
    CompileResultMultitarget$outboundSchema.parse(compileResultMultitarget),
  );
}

export function compileResultMultitargetFromJSON(
  jsonString: string,
): SafeParseResult<CompileResultMultitarget, SDKValidationError> {
  return safeParse(
    jsonString,
    (x) => CompileResultMultitarget$inboundSchema.parse(JSON.parse(x)),
    `Failed to parse 'CompileResultMultitarget' from JSON`,
  );
}
