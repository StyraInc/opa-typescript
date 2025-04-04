import {
  BeforeCreateRequestContext,
  BeforeCreateRequestHook,
} from "./types.js";
import { RequestInput } from "../lib/http.js";

export class RewriteRequestPathHook implements BeforeCreateRequestHook {
  beforeCreateRequest(
    _hookCtx: BeforeCreateRequestContext,
    input: RequestInput,
  ): RequestInput {
    const url = new URL(input.url);
    if (
      url.pathname.indexOf("/v1/data/") != -1 ||
      url.pathname.indexOf("/v1/batch/data/") != -1 ||
      url.pathname.indexOf("/v1/compile/") != -1
    ) {
      url.pathname = decodeURIComponent(url.pathname);
      return { ...input, url };
    }
    return input;
  }
}
