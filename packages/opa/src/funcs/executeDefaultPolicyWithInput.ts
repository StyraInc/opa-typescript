/*
 * Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.
 */

import { OpaApiClientCore } from "../core.js";
import {
    encodeFormQuery as encodeFormQuery$,
    encodeJSON as encodeJSON$,
    encodeSimple as encodeSimple$,
} from "../lib/encodings.js";
import * as m$ from "../lib/matchers.js";
import * as schemas$ from "../lib/schemas.js";
import { RequestOptions } from "../lib/sdks.js";
import { extractSecurity, resolveGlobalSecurity } from "../lib/security.js";
import { pathToFunc } from "../lib/url.js";
import * as components from "../sdk/models/components/index.js";
import {
    ConnectionError,
    InvalidRequestError,
    RequestAbortedError,
    RequestTimeoutError,
    UnexpectedClientError,
} from "../sdk/models/errors/httpclienterrors.js";
import * as errors from "../sdk/models/errors/index.js";
import { SDKError } from "../sdk/models/errors/sdkerror.js";
import { SDKValidationError } from "../sdk/models/errors/sdkvalidationerror.js";
import * as operations from "../sdk/models/operations/index.js";
import { Result } from "../types/fp.js";

/**
 * Execute the default decision  given an input
 */
export async function executeDefaultPolicyWithInput(
    client$: OpaApiClientCore,
    input: components.Input,
    pretty?: boolean | undefined,
    acceptEncoding?: components.GzipAcceptEncoding | undefined,
    options?: RequestOptions
): Promise<
    Result<
        operations.ExecuteDefaultPolicyWithInputResponse,
        | errors.ClientError
        | errors.ServerError
        | SDKError
        | SDKValidationError
        | UnexpectedClientError
        | InvalidRequestError
        | RequestAbortedError
        | RequestTimeoutError
        | ConnectionError
    >
> {
    const input$: operations.ExecuteDefaultPolicyWithInputRequest = {
        pretty: pretty,
        acceptEncoding: acceptEncoding,
        input: input,
    };

    const parsed$ = schemas$.safeParse(
        input$,
        (value$) => operations.ExecuteDefaultPolicyWithInputRequest$outboundSchema.parse(value$),
        "Input validation failed"
    );
    if (!parsed$.ok) {
        return parsed$;
    }
    const payload$ = parsed$.value;
    const body$ = encodeJSON$("body", payload$.input, { explode: true });

    const path$ = pathToFunc("/")();

    const query$ = encodeFormQuery$({
        pretty: payload$.pretty,
    });

    const headers$ = new Headers({
        "Content-Type": "application/json",
        Accept: "application/json",
        "Accept-Encoding": encodeSimple$("Accept-Encoding", payload$["Accept-Encoding"], {
            explode: false,
            charEncoding: "none",
        }),
    });

    const bearerAuth$ = await extractSecurity(client$.options$.bearerAuth);
    const security$ = bearerAuth$ == null ? {} : { bearerAuth: bearerAuth$ };
    const context = {
        operationID: "executeDefaultPolicyWithInput",
        oAuth2Scopes: [],
        securitySource: client$.options$.bearerAuth,
    };
    const securitySettings$ = resolveGlobalSecurity(security$);

    const requestRes = client$.createRequest$(
        context,
        {
            security: securitySettings$,
            method: "POST",
            path: path$,
            headers: headers$,
            query: query$,
            body: body$,
            timeoutMs: options?.timeoutMs || client$.options$.timeoutMs || -1,
        },
        options
    );
    if (!requestRes.ok) {
        return requestRes;
    }
    const request$ = requestRes.value;

    const doResult = await client$.do$(request$, {
        context,
        errorCodes: ["400", "404", "4XX", "500", "5XX"],
        retryConfig: options?.retries || client$.options$.retryConfig,
        retryCodes: options?.retryCodes || ["429", "500", "502", "503", "504"],
    });
    if (!doResult.ok) {
        return doResult;
    }
    const response = doResult.value;

    const responseFields$ = {
        HttpMeta: { Response: response, Request: request$ },
    };

    const [result$] = await m$.match<
        operations.ExecuteDefaultPolicyWithInputResponse,
        | errors.ClientError
        | errors.ServerError
        | SDKError
        | SDKValidationError
        | UnexpectedClientError
        | InvalidRequestError
        | RequestAbortedError
        | RequestTimeoutError
        | ConnectionError
    >(
        m$.json(200, operations.ExecuteDefaultPolicyWithInputResponse$inboundSchema, {
            hdrs: true,
            key: "result",
        }),
        m$.jsonErr([400, 404], errors.ClientError$inboundSchema),
        m$.jsonErr(500, errors.ServerError$inboundSchema),
        m$.fail(["4XX", "5XX"])
    )(response, request$, { extraFields: responseFields$ });
    if (!result$.ok) {
        return result$;
    }

    return result$;
}
