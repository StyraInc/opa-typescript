---
"@styra/ucast-prisma": patch
---

ucast-prisma: support NOT and {starts,ends}with, contains

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
