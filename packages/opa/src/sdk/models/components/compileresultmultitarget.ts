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
   * Column masking functions, where the key is the column name, and the value describes which masking function to use.
   */
  masks?: { [k: string]: MaskingRule } | undefined;
};

export type CompileResultMultitargetSqlserver = {
  /**
   * String representing the SQL equivalent of the conditions under which the query is true.
   */
  query?: string | undefined;
  /**
   * Column masking functions, where the key is the column name, and the value describes which masking function to use.
   */
  masks?: { [k: string]: MaskingRule } | undefined;
};

export type CompileResultMultitargetMysql = {
  /**
   * String representing the SQL equivalent of the conditions under which the query is true.
   */
  query?: string | undefined;
  /**
   * Column masking functions, where the key is the column name, and the value describes which masking function to use.
   */
  masks?: { [k: string]: MaskingRule } | undefined;
};

export type CompileResultMultitargetPostgresql = {
  /**
   * String representing the SQL equivalent of the conditions under which the query is true
   */
  query?: string | undefined;
  /**
   * Column masking functions, where the key is the column name, and the value describes which masking function to use.
   */
  masks?: { [k: string]: MaskingRule } | undefined;
};

export type Targets = {
  ucast?: Ucast | undefined;
  sqlserver?: CompileResultMultitargetSqlserver | undefined;
  mysql?: CompileResultMultitargetMysql | undefined;
  postgresql?: CompileResultMultitargetPostgresql | undefined;
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
    masks: z.record(MaskingRule$inboundSchema).optional(),
  });

/** @internal */
export type Ucast$Outbound = {
  query?: CompileResultMultitargetQuery$Outbound | undefined;
  masks?: { [k: string]: MaskingRule$Outbound } | undefined;
};

/** @internal */
export const Ucast$outboundSchema: z.ZodType<
  Ucast$Outbound,
  z.ZodTypeDef,
  Ucast
> = z.object({
  query: z.lazy(() => CompileResultMultitargetQuery$outboundSchema).optional(),
  masks: z.record(MaskingRule$outboundSchema).optional(),
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
export const CompileResultMultitargetSqlserver$inboundSchema: z.ZodType<
  CompileResultMultitargetSqlserver,
  z.ZodTypeDef,
  unknown
> = z.object({
  query: z.string().optional(),
  masks: z.record(MaskingRule$inboundSchema).optional(),
});

/** @internal */
export type CompileResultMultitargetSqlserver$Outbound = {
  query?: string | undefined;
  masks?: { [k: string]: MaskingRule$Outbound } | undefined;
};

/** @internal */
export const CompileResultMultitargetSqlserver$outboundSchema: z.ZodType<
  CompileResultMultitargetSqlserver$Outbound,
  z.ZodTypeDef,
  CompileResultMultitargetSqlserver
> = z.object({
  query: z.string().optional(),
  masks: z.record(MaskingRule$outboundSchema).optional(),
});

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace CompileResultMultitargetSqlserver$ {
  /** @deprecated use `CompileResultMultitargetSqlserver$inboundSchema` instead. */
  export const inboundSchema = CompileResultMultitargetSqlserver$inboundSchema;
  /** @deprecated use `CompileResultMultitargetSqlserver$outboundSchema` instead. */
  export const outboundSchema =
    CompileResultMultitargetSqlserver$outboundSchema;
  /** @deprecated use `CompileResultMultitargetSqlserver$Outbound` instead. */
  export type Outbound = CompileResultMultitargetSqlserver$Outbound;
}

export function compileResultMultitargetSqlserverToJSON(
  compileResultMultitargetSqlserver: CompileResultMultitargetSqlserver,
): string {
  return JSON.stringify(
    CompileResultMultitargetSqlserver$outboundSchema.parse(
      compileResultMultitargetSqlserver,
    ),
  );
}

export function compileResultMultitargetSqlserverFromJSON(
  jsonString: string,
): SafeParseResult<CompileResultMultitargetSqlserver, SDKValidationError> {
  return safeParse(
    jsonString,
    (x) => CompileResultMultitargetSqlserver$inboundSchema.parse(JSON.parse(x)),
    `Failed to parse 'CompileResultMultitargetSqlserver' from JSON`,
  );
}

/** @internal */
export const CompileResultMultitargetMysql$inboundSchema: z.ZodType<
  CompileResultMultitargetMysql,
  z.ZodTypeDef,
  unknown
> = z.object({
  query: z.string().optional(),
  masks: z.record(MaskingRule$inboundSchema).optional(),
});

/** @internal */
export type CompileResultMultitargetMysql$Outbound = {
  query?: string | undefined;
  masks?: { [k: string]: MaskingRule$Outbound } | undefined;
};

/** @internal */
export const CompileResultMultitargetMysql$outboundSchema: z.ZodType<
  CompileResultMultitargetMysql$Outbound,
  z.ZodTypeDef,
  CompileResultMultitargetMysql
> = z.object({
  query: z.string().optional(),
  masks: z.record(MaskingRule$outboundSchema).optional(),
});

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace CompileResultMultitargetMysql$ {
  /** @deprecated use `CompileResultMultitargetMysql$inboundSchema` instead. */
  export const inboundSchema = CompileResultMultitargetMysql$inboundSchema;
  /** @deprecated use `CompileResultMultitargetMysql$outboundSchema` instead. */
  export const outboundSchema = CompileResultMultitargetMysql$outboundSchema;
  /** @deprecated use `CompileResultMultitargetMysql$Outbound` instead. */
  export type Outbound = CompileResultMultitargetMysql$Outbound;
}

export function compileResultMultitargetMysqlToJSON(
  compileResultMultitargetMysql: CompileResultMultitargetMysql,
): string {
  return JSON.stringify(
    CompileResultMultitargetMysql$outboundSchema.parse(
      compileResultMultitargetMysql,
    ),
  );
}

export function compileResultMultitargetMysqlFromJSON(
  jsonString: string,
): SafeParseResult<CompileResultMultitargetMysql, SDKValidationError> {
  return safeParse(
    jsonString,
    (x) => CompileResultMultitargetMysql$inboundSchema.parse(JSON.parse(x)),
    `Failed to parse 'CompileResultMultitargetMysql' from JSON`,
  );
}

/** @internal */
export const CompileResultMultitargetPostgresql$inboundSchema: z.ZodType<
  CompileResultMultitargetPostgresql,
  z.ZodTypeDef,
  unknown
> = z.object({
  query: z.string().optional(),
  masks: z.record(MaskingRule$inboundSchema).optional(),
});

/** @internal */
export type CompileResultMultitargetPostgresql$Outbound = {
  query?: string | undefined;
  masks?: { [k: string]: MaskingRule$Outbound } | undefined;
};

/** @internal */
export const CompileResultMultitargetPostgresql$outboundSchema: z.ZodType<
  CompileResultMultitargetPostgresql$Outbound,
  z.ZodTypeDef,
  CompileResultMultitargetPostgresql
> = z.object({
  query: z.string().optional(),
  masks: z.record(MaskingRule$outboundSchema).optional(),
});

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace CompileResultMultitargetPostgresql$ {
  /** @deprecated use `CompileResultMultitargetPostgresql$inboundSchema` instead. */
  export const inboundSchema = CompileResultMultitargetPostgresql$inboundSchema;
  /** @deprecated use `CompileResultMultitargetPostgresql$outboundSchema` instead. */
  export const outboundSchema =
    CompileResultMultitargetPostgresql$outboundSchema;
  /** @deprecated use `CompileResultMultitargetPostgresql$Outbound` instead. */
  export type Outbound = CompileResultMultitargetPostgresql$Outbound;
}

export function compileResultMultitargetPostgresqlToJSON(
  compileResultMultitargetPostgresql: CompileResultMultitargetPostgresql,
): string {
  return JSON.stringify(
    CompileResultMultitargetPostgresql$outboundSchema.parse(
      compileResultMultitargetPostgresql,
    ),
  );
}

export function compileResultMultitargetPostgresqlFromJSON(
  jsonString: string,
): SafeParseResult<CompileResultMultitargetPostgresql, SDKValidationError> {
  return safeParse(
    jsonString,
    (x) =>
      CompileResultMultitargetPostgresql$inboundSchema.parse(JSON.parse(x)),
    `Failed to parse 'CompileResultMultitargetPostgresql' from JSON`,
  );
}

/** @internal */
export const Targets$inboundSchema: z.ZodType<Targets, z.ZodTypeDef, unknown> =
  z.object({
    ucast: z.lazy(() => Ucast$inboundSchema).optional(),
    sqlserver: z.lazy(() => CompileResultMultitargetSqlserver$inboundSchema)
      .optional(),
    mysql: z.lazy(() => CompileResultMultitargetMysql$inboundSchema).optional(),
    postgresql: z.lazy(() => CompileResultMultitargetPostgresql$inboundSchema)
      .optional(),
  });

/** @internal */
export type Targets$Outbound = {
  ucast?: Ucast$Outbound | undefined;
  sqlserver?: CompileResultMultitargetSqlserver$Outbound | undefined;
  mysql?: CompileResultMultitargetMysql$Outbound | undefined;
  postgresql?: CompileResultMultitargetPostgresql$Outbound | undefined;
};

/** @internal */
export const Targets$outboundSchema: z.ZodType<
  Targets$Outbound,
  z.ZodTypeDef,
  Targets
> = z.object({
  ucast: z.lazy(() => Ucast$outboundSchema).optional(),
  sqlserver: z.lazy(() => CompileResultMultitargetSqlserver$outboundSchema)
    .optional(),
  mysql: z.lazy(() => CompileResultMultitargetMysql$outboundSchema).optional(),
  postgresql: z.lazy(() => CompileResultMultitargetPostgresql$outboundSchema)
    .optional(),
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
