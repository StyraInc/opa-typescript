---
"@styra/ucast-prisma": patch
---

Introduce laxer handling of empty compound conditions

This aligns better with common Rego patterns, like using multi-value
rules for generating conditions:

```rego
conditions.or contains {"tickets.resolved": false} if { ... }
```

If the RHS is not satisfied, the conditions would yield

```json
{
  "conditions": {
    "or": []
  }
}
```

and with this change, this will be valid. The condition itself is
going to be dropped.
