---
"@styra/ucast-prisma": patch
---

ucastToPrisma takes primary table to project conditions

Previously, the conversion logic for OR conditions was faulty.
It's not possible to properly translate OR conditions to Prisma
query filters without knowing the primary table of the query.

That table is now passed as an argument to ucastToPrisma.
