---
"@styra/ucast-prisma": minor
---

add helper methods for column masking in filter results

A new `mask` method for masking column values in database lookup results,
according to mask rules provided by the Compile API, has been added.

Also, an `Adapter` class was added to make calls for filtering and masking with Prisma more streamlined.
