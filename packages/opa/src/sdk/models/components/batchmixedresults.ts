/*
 * Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.
 */

import * as z from "zod";
import { remap as remap$ } from "../../../lib/primitives.js";
import { safeParse } from "../../../lib/schemas.js";
import { Result as SafeParseResult } from "../../../types/fp.js";
import { SDKValidationError } from "../errors/sdkvalidationerror.js";
import {
  Provenance,
  Provenance$inboundSchema,
  Provenance$Outbound,
  Provenance$outboundSchema,
} from "./provenance.js";
import {
  Result,
  Result$inboundSchema,
  Result$Outbound,
  Result$outboundSchema,
} from "./result.js";

export type Location = {
  file: string;
  row: number;
  col: number;
};

export type Errors = {
  code: string;
  message: string;
  location?: Location | undefined;
};

export type ServerErrorWithStatusCode = {
  httpStatusCode: string;
  code: string;
  message: string;
  errors?: Array<Errors> | undefined;
  decisionId?: string | undefined;
};

export type SuccessfulPolicyResponseWithStatusCode = {
  httpStatusCode: string;
  /**
   * The base or virtual document referred to by the URL path. If the path is undefined, this key will be omitted.
   */
  result?: Result | undefined;
  /**
   * If query metrics are enabled, this field contains query performance metrics collected during the parse, compile, and evaluation steps.
   */
  metrics?: { [k: string]: any } | undefined;
  /**
   * If decision logging is enabled, this field contains a string that uniquely identifies the decision. The identifier will be included in the decision log event for this decision. Callers can use the identifier for correlation purposes.
   */
  decisionId?: string | undefined;
  /**
   * Provenance information can be requested on individual API calls and are returned inline with the API response. To obtain provenance information on an API call, specify the `provenance=true` query parameter when executing the API call.
   */
  provenance?: Provenance | undefined;
};

export type Responses =
  | (SuccessfulPolicyResponseWithStatusCode & { httpStatusCode: "200" })
  | (ServerErrorWithStatusCode & { httpStatusCode: "500" });

/**
 * Mixed success and failures.
 */
export type BatchMixedResults = {
  batchDecisionId?: string | undefined;
  /**
   * If query metrics are enabled, this field contains query performance metrics collected during the parse, compile, and evaluation steps.
   */
  metrics?: { [k: string]: any } | undefined;
  responses?: {
    [k: string]:
      | (SuccessfulPolicyResponseWithStatusCode & { httpStatusCode: "200" })
      | (ServerErrorWithStatusCode & { httpStatusCode: "500" });
  } | undefined;
};

/** @internal */
export const Location$inboundSchema: z.ZodType<
  Location,
  z.ZodTypeDef,
  unknown
> = z.object({
  file: z.string(),
  row: z.number().int(),
  col: z.number().int(),
});

/** @internal */
export type Location$Outbound = {
  file: string;
  row: number;
  col: number;
};

/** @internal */
export const Location$outboundSchema: z.ZodType<
  Location$Outbound,
  z.ZodTypeDef,
  Location
> = z.object({
  file: z.string(),
  row: z.number().int(),
  col: z.number().int(),
});

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace Location$ {
  /** @deprecated use `Location$inboundSchema` instead. */
  export const inboundSchema = Location$inboundSchema;
  /** @deprecated use `Location$outboundSchema` instead. */
  export const outboundSchema = Location$outboundSchema;
  /** @deprecated use `Location$Outbound` instead. */
  export type Outbound = Location$Outbound;
}

export function locationToJSON(location: Location): string {
  return JSON.stringify(Location$outboundSchema.parse(location));
}

export function locationFromJSON(
  jsonString: string,
): SafeParseResult<Location, SDKValidationError> {
  return safeParse(
    jsonString,
    (x) => Location$inboundSchema.parse(JSON.parse(x)),
    `Failed to parse 'Location' from JSON`,
  );
}

/** @internal */
export const Errors$inboundSchema: z.ZodType<Errors, z.ZodTypeDef, unknown> = z
  .object({
    code: z.string(),
    message: z.string(),
    location: z.lazy(() => Location$inboundSchema).optional(),
  });

/** @internal */
export type Errors$Outbound = {
  code: string;
  message: string;
  location?: Location$Outbound | undefined;
};

/** @internal */
export const Errors$outboundSchema: z.ZodType<
  Errors$Outbound,
  z.ZodTypeDef,
  Errors
> = z.object({
  code: z.string(),
  message: z.string(),
  location: z.lazy(() => Location$outboundSchema).optional(),
});

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace Errors$ {
  /** @deprecated use `Errors$inboundSchema` instead. */
  export const inboundSchema = Errors$inboundSchema;
  /** @deprecated use `Errors$outboundSchema` instead. */
  export const outboundSchema = Errors$outboundSchema;
  /** @deprecated use `Errors$Outbound` instead. */
  export type Outbound = Errors$Outbound;
}

export function errorsToJSON(errors: Errors): string {
  return JSON.stringify(Errors$outboundSchema.parse(errors));
}

export function errorsFromJSON(
  jsonString: string,
): SafeParseResult<Errors, SDKValidationError> {
  return safeParse(
    jsonString,
    (x) => Errors$inboundSchema.parse(JSON.parse(x)),
    `Failed to parse 'Errors' from JSON`,
  );
}

/** @internal */
export const ServerErrorWithStatusCode$inboundSchema: z.ZodType<
  ServerErrorWithStatusCode,
  z.ZodTypeDef,
  unknown
> = z.object({
  http_status_code: z.string(),
  code: z.string(),
  message: z.string(),
  errors: z.array(z.lazy(() => Errors$inboundSchema)).optional(),
  decision_id: z.string().optional(),
}).transform((v) => {
  return remap$(v, {
    "http_status_code": "httpStatusCode",
    "decision_id": "decisionId",
  });
});

/** @internal */
export type ServerErrorWithStatusCode$Outbound = {
  http_status_code: string;
  code: string;
  message: string;
  errors?: Array<Errors$Outbound> | undefined;
  decision_id?: string | undefined;
};

/** @internal */
export const ServerErrorWithStatusCode$outboundSchema: z.ZodType<
  ServerErrorWithStatusCode$Outbound,
  z.ZodTypeDef,
  ServerErrorWithStatusCode
> = z.object({
  httpStatusCode: z.string(),
  code: z.string(),
  message: z.string(),
  errors: z.array(z.lazy(() => Errors$outboundSchema)).optional(),
  decisionId: z.string().optional(),
}).transform((v) => {
  return remap$(v, {
    httpStatusCode: "http_status_code",
    decisionId: "decision_id",
  });
});

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace ServerErrorWithStatusCode$ {
  /** @deprecated use `ServerErrorWithStatusCode$inboundSchema` instead. */
  export const inboundSchema = ServerErrorWithStatusCode$inboundSchema;
  /** @deprecated use `ServerErrorWithStatusCode$outboundSchema` instead. */
  export const outboundSchema = ServerErrorWithStatusCode$outboundSchema;
  /** @deprecated use `ServerErrorWithStatusCode$Outbound` instead. */
  export type Outbound = ServerErrorWithStatusCode$Outbound;
}

export function serverErrorWithStatusCodeToJSON(
  serverErrorWithStatusCode: ServerErrorWithStatusCode,
): string {
  return JSON.stringify(
    ServerErrorWithStatusCode$outboundSchema.parse(serverErrorWithStatusCode),
  );
}

export function serverErrorWithStatusCodeFromJSON(
  jsonString: string,
): SafeParseResult<ServerErrorWithStatusCode, SDKValidationError> {
  return safeParse(
    jsonString,
    (x) => ServerErrorWithStatusCode$inboundSchema.parse(JSON.parse(x)),
    `Failed to parse 'ServerErrorWithStatusCode' from JSON`,
  );
}

/** @internal */
export const SuccessfulPolicyResponseWithStatusCode$inboundSchema: z.ZodType<
  SuccessfulPolicyResponseWithStatusCode,
  z.ZodTypeDef,
  unknown
> = z.object({
  http_status_code: z.string(),
  result: Result$inboundSchema.optional(),
  metrics: z.record(z.any()).optional(),
  decision_id: z.string().optional(),
  provenance: Provenance$inboundSchema.optional(),
}).transform((v) => {
  return remap$(v, {
    "http_status_code": "httpStatusCode",
    "decision_id": "decisionId",
  });
});

/** @internal */
export type SuccessfulPolicyResponseWithStatusCode$Outbound = {
  http_status_code: string;
  result?: Result$Outbound | undefined;
  metrics?: { [k: string]: any } | undefined;
  decision_id?: string | undefined;
  provenance?: Provenance$Outbound | undefined;
};

/** @internal */
export const SuccessfulPolicyResponseWithStatusCode$outboundSchema: z.ZodType<
  SuccessfulPolicyResponseWithStatusCode$Outbound,
  z.ZodTypeDef,
  SuccessfulPolicyResponseWithStatusCode
> = z.object({
  httpStatusCode: z.string(),
  result: Result$outboundSchema.optional(),
  metrics: z.record(z.any()).optional(),
  decisionId: z.string().optional(),
  provenance: Provenance$outboundSchema.optional(),
}).transform((v) => {
  return remap$(v, {
    httpStatusCode: "http_status_code",
    decisionId: "decision_id",
  });
});

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace SuccessfulPolicyResponseWithStatusCode$ {
  /** @deprecated use `SuccessfulPolicyResponseWithStatusCode$inboundSchema` instead. */
  export const inboundSchema =
    SuccessfulPolicyResponseWithStatusCode$inboundSchema;
  /** @deprecated use `SuccessfulPolicyResponseWithStatusCode$outboundSchema` instead. */
  export const outboundSchema =
    SuccessfulPolicyResponseWithStatusCode$outboundSchema;
  /** @deprecated use `SuccessfulPolicyResponseWithStatusCode$Outbound` instead. */
  export type Outbound = SuccessfulPolicyResponseWithStatusCode$Outbound;
}

export function successfulPolicyResponseWithStatusCodeToJSON(
  successfulPolicyResponseWithStatusCode:
    SuccessfulPolicyResponseWithStatusCode,
): string {
  return JSON.stringify(
    SuccessfulPolicyResponseWithStatusCode$outboundSchema.parse(
      successfulPolicyResponseWithStatusCode,
    ),
  );
}

export function successfulPolicyResponseWithStatusCodeFromJSON(
  jsonString: string,
): SafeParseResult<SuccessfulPolicyResponseWithStatusCode, SDKValidationError> {
  return safeParse(
    jsonString,
    (x) =>
      SuccessfulPolicyResponseWithStatusCode$inboundSchema.parse(JSON.parse(x)),
    `Failed to parse 'SuccessfulPolicyResponseWithStatusCode' from JSON`,
  );
}

/** @internal */
export const Responses$inboundSchema: z.ZodType<
  Responses,
  z.ZodTypeDef,
  unknown
> = z.union([
  z.lazy(() => SuccessfulPolicyResponseWithStatusCode$inboundSchema).and(
    z.object({ http_status_code: z.literal("200") }).transform((v) => ({
      httpStatusCode: v.http_status_code,
    })),
  ),
  z.lazy(() => ServerErrorWithStatusCode$inboundSchema).and(
    z.object({ http_status_code: z.literal("500") }).transform((v) => ({
      httpStatusCode: v.http_status_code,
    })),
  ),
]);

/** @internal */
export type Responses$Outbound =
  | (SuccessfulPolicyResponseWithStatusCode$Outbound & {
    http_status_code: "200";
  })
  | (ServerErrorWithStatusCode$Outbound & { http_status_code: "500" });

/** @internal */
export const Responses$outboundSchema: z.ZodType<
  Responses$Outbound,
  z.ZodTypeDef,
  Responses
> = z.union([
  z.lazy(() => SuccessfulPolicyResponseWithStatusCode$outboundSchema).and(
    z.object({ httpStatusCode: z.literal("200") }).transform((v) => ({
      http_status_code: v.httpStatusCode,
    })),
  ),
  z.lazy(() => ServerErrorWithStatusCode$outboundSchema).and(
    z.object({ httpStatusCode: z.literal("500") }).transform((v) => ({
      http_status_code: v.httpStatusCode,
    })),
  ),
]);

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace Responses$ {
  /** @deprecated use `Responses$inboundSchema` instead. */
  export const inboundSchema = Responses$inboundSchema;
  /** @deprecated use `Responses$outboundSchema` instead. */
  export const outboundSchema = Responses$outboundSchema;
  /** @deprecated use `Responses$Outbound` instead. */
  export type Outbound = Responses$Outbound;
}

export function responsesToJSON(responses: Responses): string {
  return JSON.stringify(Responses$outboundSchema.parse(responses));
}

export function responsesFromJSON(
  jsonString: string,
): SafeParseResult<Responses, SDKValidationError> {
  return safeParse(
    jsonString,
    (x) => Responses$inboundSchema.parse(JSON.parse(x)),
    `Failed to parse 'Responses' from JSON`,
  );
}

/** @internal */
export const BatchMixedResults$inboundSchema: z.ZodType<
  BatchMixedResults,
  z.ZodTypeDef,
  unknown
> = z.object({
  batch_decision_id: z.string().optional(),
  metrics: z.record(z.any()).optional(),
  responses: z.record(
    z.union([
      z.lazy(() => SuccessfulPolicyResponseWithStatusCode$inboundSchema).and(
        z.object({ http_status_code: z.literal("200") }).transform((v) => ({
          httpStatusCode: v.http_status_code,
        })),
      ),
      z.lazy(() =>
        ServerErrorWithStatusCode$inboundSchema
      ).and(
        z.object({ http_status_code: z.literal("500") }).transform((v) => ({
          httpStatusCode: v.http_status_code,
        })),
      ),
    ]),
  ).optional(),
}).transform((v) => {
  return remap$(v, {
    "batch_decision_id": "batchDecisionId",
  });
});

/** @internal */
export type BatchMixedResults$Outbound = {
  batch_decision_id?: string | undefined;
  metrics?: { [k: string]: any } | undefined;
  responses?: {
    [k: string]:
      | (SuccessfulPolicyResponseWithStatusCode$Outbound & {
        http_status_code: "200";
      })
      | (ServerErrorWithStatusCode$Outbound & { http_status_code: "500" });
  } | undefined;
};

/** @internal */
export const BatchMixedResults$outboundSchema: z.ZodType<
  BatchMixedResults$Outbound,
  z.ZodTypeDef,
  BatchMixedResults
> = z.object({
  batchDecisionId: z.string().optional(),
  metrics: z.record(z.any()).optional(),
  responses: z.record(
    z.union([
      z.lazy(() => SuccessfulPolicyResponseWithStatusCode$outboundSchema).and(
        z.object({ httpStatusCode: z.literal("200") }).transform((v) => ({
          http_status_code: v.httpStatusCode,
        })),
      ),
      z.lazy(() =>
        ServerErrorWithStatusCode$outboundSchema
      ).and(
        z.object({ httpStatusCode: z.literal("500") }).transform((v) => ({
          http_status_code: v.httpStatusCode,
        })),
      ),
    ]),
  ).optional(),
}).transform((v) => {
  return remap$(v, {
    batchDecisionId: "batch_decision_id",
  });
});

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace BatchMixedResults$ {
  /** @deprecated use `BatchMixedResults$inboundSchema` instead. */
  export const inboundSchema = BatchMixedResults$inboundSchema;
  /** @deprecated use `BatchMixedResults$outboundSchema` instead. */
  export const outboundSchema = BatchMixedResults$outboundSchema;
  /** @deprecated use `BatchMixedResults$Outbound` instead. */
  export type Outbound = BatchMixedResults$Outbound;
}

export function batchMixedResultsToJSON(
  batchMixedResults: BatchMixedResults,
): string {
  return JSON.stringify(
    BatchMixedResults$outboundSchema.parse(batchMixedResults),
  );
}

export function batchMixedResultsFromJSON(
  jsonString: string,
): SafeParseResult<BatchMixedResults, SDKValidationError> {
  return safeParse(
    jsonString,
    (x) => BatchMixedResults$inboundSchema.parse(JSON.parse(x)),
    `Failed to parse 'BatchMixedResults' from JSON`,
  );
}
