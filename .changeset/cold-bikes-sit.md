---
"@styra/opa-react": minor
---

Support batching requests sent to the backend (optional)

When used with [Enterprise OPA's Batch API](https://docs.styra.com/enterprise-opa/reference/api-reference/batch-api), this mode allows for sending much
fewer requests to the backend. It's enabled by setting `batch={true}` on `<AuthzProvider>`.

Note that the Batch API has no notion of "default query", so it's not possible
to use batching without having either `defaultPath` (`<AuthzProvider>`) or
`path` (`useAuthz()`, `<Authz>`) set.

Please note that `fromResult` is exempt from the cache key, so multiple requests
with the same path and input, but different `fromResult` settings will lead to
unforeseen results.
This is on par with the regular (non-batching) caching, and we'll revisit this
if it becomes a problem for users. Please create an issue on Github if it is
problematic for you.

Furthermore, batching queries are not wired up with `AbortController` like the
non-batching equivalents are.
