---
"@styra/opa-react": minor
---

expose AuthzContext

The prepared `sdk` instance of `AuthzProvider` can now be retrieved
from any components wrapped into `AuthzProvider`. For example:

```tsx
import { AuthzContext } from "@styra/opa-react";

export default function Component() {
  const { sdk } = useContext(AuthzContext);
  // now you can use `sdk.evaluate()` etc directly
}
```
