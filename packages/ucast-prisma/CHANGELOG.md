# @styra/ucast-prisma

## 0.0.7

### Patch Changes

- c31016a: support previously-expanded conditions input

## 0.0.6

### Patch Changes

- 5c7cb33: support translating table and column names via extra options

  An extra options object can be passed to `ucastToPrisma` to translate table and column names.
  This is useful when the Prisma schema uses different names than the OPA policy used to generate
  the conditions.

  ```typescript
  const p = ucastToPrisma(
    { or: [{ "tickets.resolved": false }, { "users.name": "ceasar" }] },
    "tickets0",
    {
      translations: {
        tickets: { $self: "tickets0", resolved: "resolved0" },
        users: { $self: "users0", name: "name0" },
      },
    }
  );
  ```

  In this example, the conditions `{ or: [{ "tickets.resolved": false }, { "users.name": "ceasar" }] }`
  will be rewritten to `{ OR: [{ tickets0: { resolved0: false } }, { users0: { name0: "ceasar" } }] }`,
  assuming that the Prisma schema uses `tickets0` and `users0` as table names and `resolved0` and `name0`
  as column names respectively.

## 0.0.5

### Patch Changes

- f717e3e: handle 'or' correctly when including compound disjuncts

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
