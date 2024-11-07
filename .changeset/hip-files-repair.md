---
"@styra/ucast-prisma": patch
---

support translating table and column names via extra options

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
