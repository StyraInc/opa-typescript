# @styra/ucast-prisma

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![NPM Version](https://img.shields.io/npm/v/%40styra%2Fucast-prisma?style=flat&color=%2324b6e0)](https://www.npmjs.com/package/@styra/ucast-prisma)

This package contains helpers for using the Enterprise OPA Compile API with Prisma queries.

> [!WARNING]
> This is an experimental package and is subject to change.

## Usage

This package can be used to add filtering and masking to Prisma queries from the
[Enterprise OPA Compile API](https://docs.styra.com/enterprise-opa/reference/api-reference/partial-evaluation-api).
It wraps [`@styra/opa`](https://www.npmjs.com/package/@styra/opa) and provides all the settings required to work with Prisma:

```diff
+ import { Adapter } from "@styra/ucast-prisma";

+ const opa = new Adapter("http://127.0.0.1:8181");

  router.get("/tickets", async (req, res) => {
+   const { query, mask } = opa.filters("filters/include", "tickets", { action: "list" });
+   if (!query) return res.status(FORBIDDEN).json({ reason: "not authorized" });

    const tickets = (
      await prisma.tickets.findMany({
+       where: query,
        include: {
          customers: true,
          users: true,
        },
      })
-     ).map((ticket) => toTicket(ticket));
+     ).map((ticket) => toTicket(mask(ticket)));
    return res.status(OK).json({ tickets });
  });
```


## Community

For questions, discussions and announcements related to Styra products, services and open source projects, please join
the Styra community on [Slack](https://communityinviter.com/apps/styracommunity/signup)!
