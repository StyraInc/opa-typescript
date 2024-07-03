---
"@styra/opa-react": minor
---

Add `fromResults` to support unwrapping policy evaluation results

This allows us to unwrap results returned from OPA to turn them into a boolean.

Previously, anything different from undefined and false was taken to mean "authorized". Now, we can work with policy evaluation results like

```json
{
  "result": false,
  "details": "..."
}
```

by providing a `fromResults` function like

```ts
const fromResults = (r?: Result): boolean =>
  ((r as Record<string, any>)["foobar"] as boolean) ?? false;
```

As with input and path, this can (optionally) be set with `<AuthzProvider>` (property `defaultFromResults`), and with `<Authz>` (property `fromResult`), or passed to `useAuthz()`.
