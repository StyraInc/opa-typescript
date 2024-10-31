# @styra/ucast-prisma

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
