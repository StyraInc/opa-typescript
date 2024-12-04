# @styra/ucast-prisma

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![NPM Version](https://img.shields.io/npm/v/%40styra%2Fucast-prisma?style=flat&color=%2324b6e0)](https://www.npmjs.com/package/@styra/ucast-prisma)

This package contains helpers for using ucast conditions with Prisma queries.

> [!WARNING]
> This is an experimental package and is subject to change.

## Usage

This package can be used to add filtering to Prisma queries from ucast conditions.

```diff
+ import { ucastToPrisma } from "@styra/ucast-prisma";

  router.get("/tickets", async (req, res) => {
-   const { allow, reason } = await authz.authorized(
+   const { allow, reason, conditions } = await authz.authorized(path, { action: "list" }, req);
    if (!allow) return res.status(FORBIDDEN).json({ reason });

+   const filters = ucastToPrisma(conditions, "tickets");
    const tickets = (
      await prisma.tickets.findMany({
+       where: filters,
        include: {
          customers: true,
          users: true,
        },
      })
      ).map((ticket) => toTicket(ticket));
    return res.status(OK).json({ tickets });
  });
```

The conditions returned by the OPA policy evaluation look like this:

```json
{
  "conditions": {
    "or": [{ "tickets.resolved": false }, { "users.name": "caesar" }]
  }
}
```

Note that an expanded, more verbose format is supported, too:

```json
{
  "conditions": {
    "type": "compound",
    "operator": "or",
    "value": [
      {
        "type": "field",
        "operator": "eq",
        "field": "tickets.resolved",
        "value": false
      },
      {
        "type": "field",
        "operator": "eq",
        "field": "users.name",
        "value": "caesar"
      }
    ]
  }
}
```

The call to `ucastToPrisma(conditions, "tickets")` turns both into this
Prisma query:

```json
{
  "OR": [
    {
      "resolved": {
        "equals": false
      }
    },
    {
      "users": {
        "name": {
          "equals": "ceasar"
        }
      }
    }
  ]
}
```

## Community

For questions, discussions and announcements related to Styra products, services and open source projects, please join
the Styra community on [Slack](https://communityinviter.com/apps/styracommunity/signup)!
