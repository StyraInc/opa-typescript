import { RewriteRequestPathHook } from "./request-path-hook.js";
import { Hooks } from "./types.js";

export function initHooks(hooks: Hooks) {
  // Add hooks by calling hooks.register{ClientInit/BeforeRequest/AfterRequest/AfterError}Hook
  // with an instance of a hook that implements that specific Hook interface
  // Hooks are registered per SDK instance, and are valid for the lifetime of the SDK instance
  hooks.registerBeforeCreateRequestHook(new RewriteRequestPathHook());
}
