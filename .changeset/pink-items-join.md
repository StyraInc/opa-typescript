---
"@styra/opa-react": minor
---

Introduce `@tanstack/react-query` for policy evaluation request caching

With this release, multiple uses of `useAuthz` and `<Authz>` with the same inputs no longer unconditionally lead to API requests.
Using `@tanstack/react-query` underneath, `useAuthz` will now return cached results when applicable.

Furthermore, API requests are retried on transient errors.
You can control the retry count via `AuthzProvider`'s `retry` property.

**NOTE** The `fromResult` property/argument is currently exempt from the cache key -- so two requests with the same `path` and `input` will produce the same result even if their `fromResult` differs.
We believe that this is quite uncommon, please file an issue if it is a problem in your use case.

For details on how and when the cache is invalidated, please refer to the docs here: https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults
