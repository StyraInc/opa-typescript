/*
 * Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.
 */

import * as z from "zod";

/**
 * OPA service is not healthy. If the bundles option is specified this can mean any of the configured bundles have not yet been activated. If the plugins option is specified then at least one plugin is in a non-OK state.
 */
export type UnhealthyServerData = {
  code: string;
  error?: string | undefined;
  message?: string | undefined;
};

/**
 * OPA service is not healthy. If the bundles option is specified this can mean any of the configured bundles have not yet been activated. If the plugins option is specified then at least one plugin is in a non-OK state.
 */
export class UnhealthyServer extends Error {
  code: string;
  error?: string | undefined;

  /** The original data that was passed to this error instance. */
  data$: UnhealthyServerData;

  constructor(err: UnhealthyServerData) {
    const message = "message" in err && typeof err.message === "string"
      ? err.message
      : `API error occurred: ${JSON.stringify(err)}`;
    super(message);
    this.data$ = err;

    this.code = err.code;
    if (err.error != null) this.error = err.error;

    this.name = "UnhealthyServer";
  }
}

/** @internal */
export const UnhealthyServer$inboundSchema: z.ZodType<
  UnhealthyServer,
  z.ZodTypeDef,
  unknown
> = z.object({
  code: z.string(),
  error: z.string().optional(),
  message: z.string().optional(),
})
  .transform((v) => {
    return new UnhealthyServer(v);
  });

/** @internal */
export type UnhealthyServer$Outbound = {
  code: string;
  error?: string | undefined;
  message?: string | undefined;
};

/** @internal */
export const UnhealthyServer$outboundSchema: z.ZodType<
  UnhealthyServer$Outbound,
  z.ZodTypeDef,
  UnhealthyServer
> = z.instanceof(UnhealthyServer)
  .transform(v => v.data$)
  .pipe(z.object({
    code: z.string(),
    error: z.string().optional(),
    message: z.string().optional(),
  }));

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace UnhealthyServer$ {
  /** @deprecated use `UnhealthyServer$inboundSchema` instead. */
  export const inboundSchema = UnhealthyServer$inboundSchema;
  /** @deprecated use `UnhealthyServer$outboundSchema` instead. */
  export const outboundSchema = UnhealthyServer$outboundSchema;
  /** @deprecated use `UnhealthyServer$Outbound` instead. */
  export type Outbound = UnhealthyServer$Outbound;
}
