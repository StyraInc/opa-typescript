---
"@styra/opa-react": patch
---

`AuthzProviderContext` is a type now (was interface)

This was done to remove code duplication. No functional changes. But since the
interface was exported before, some care might have to be taken when updating.
