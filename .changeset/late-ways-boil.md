---
"@styra/opa-react": minor
---

Remove default export: It seems simpler to only rely the three exports we have here:

1. `AuthzProvider`
2. `Authz`
3. `useAuthz`

(Besides types and interfaces.)
