---
"@styra/ucast-prisma": patch
---

ucast-prisma: switch to non-concise AND encoding of conjuncts

This isn't as concise as before, but it's free of edge cases.
Also, as far as I can tell from the [Prisma docs](https://www.prisma.io/docs/orm/reference/prisma-client-reference#and), it doesn't
matter if multiple conditions are wrapped in AND or not.
