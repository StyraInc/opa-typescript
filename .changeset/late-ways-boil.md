---
"@styra/opa-react": minor
---

Remove default export: It seems simpler to only rely on the three exports we have:

1. `import { AuthzProvider } from "@styra/opa-react";`
2. `import { Authz } from "@styra/opa-react";`
3. `import { useAuthz } from "@styra/opa-react";`

(Besides types and interfaces.)
