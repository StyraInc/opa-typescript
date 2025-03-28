# @styra/ucast-prisma

## 0.1.2

### Patch Changes

- 4d70da6: update README

## 0.1.1

### Patch Changes

- 3ceaab0: ucast-prisma: add missing @styra/opa dependency

## 0.1.0

### Minor Changes

- ceb250e: add helper methods for column masking in filter results

  A new `mask` method for masking column values in database lookup results,
  according to mask rules provided by the Compile API, has been added.

  Also, an `Adapter` class was added to make calls for filtering and masking with Prisma more streamlined.

## 0.0.9

### Patch Changes

- e05edba: ucast-prisma: support NOT and {starts,ends}with, contains

  The helpers now support NOT, encoded as a compound condition with a single
  child condition in **an array** in `value`:

  ```js
  {
    type: "compound",
    operator: "not",
    value: [
      {
        type: "field",
        field: "price",
        operator: "lt",
        value: 10
      }
    ]
  }
  ```

  Furthermore, `startswith`, `endswith` and `contains` are know known operators.
  The first two are replaced with `startsWith` and `endsWith` respectively, since
  this is what prisma understands.

## 0.0.8

### Patch Changes

- 8a6007d: ucast-prisma: switch to non-concise AND encoding of conjuncts

  This isn't as concise as before, but it's free of edge cases.
  Also, as far as I can tell from the [Prisma docs](https://www.prisma.io/docs/orm/reference/prisma-client-reference#and), it doesn't
  matter if multiple conditions are wrapped in AND or not.

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
