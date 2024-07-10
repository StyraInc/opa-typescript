---
"@styra/opa-react": minor
---

change exported interfaces names, and AuthzProvider property

The export iterface `SDK` is now called `OPAClient` for consistency with `@styra/opa`.

It is used in `AuthzProviderContext` and `AuthzProviderProps`, and has been renamed from `sdk` to `opaClient`.
