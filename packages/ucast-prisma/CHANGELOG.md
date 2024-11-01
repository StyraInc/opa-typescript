# @styra/ucast-prisma

## 0.0.4

### Patch Changes

- 3920db7: Introduce laxer handling of empty compound conditions

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

## 0.0.3

### Patch Changes

- 73b18d1: ucastToPrisma takes primary table to project conditions

  Previously, the conversion logic for OR conditions was faulty.
  It's not possible to properly translate OR conditions to Prisma
  query filters without knowing the primary table of the query.

  That table is now passed as an argument to ucastToPrisma.

## 0.0.2

### Patch Changes

- 0f2a82a: add minimal README and keywords
