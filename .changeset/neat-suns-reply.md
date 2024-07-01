---
"@styra/opa-react": minor
---

Remove function support from <Authz> component

Allowing a function had unintended consequences for performance, given how
React works. Now, there is only one way to do it: `fallback` for non-truthy
results, and `children` for truthy results.
