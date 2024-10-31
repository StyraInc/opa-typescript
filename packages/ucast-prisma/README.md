# @styra/ucast-prisma

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![NPM Version](https://img.shields.io/npm/v/%40styra%2Fucast-prisma?style=flat&color=%2324b6e0)](https://www.npmjs.com/package/@styra/ucast-prisma)

This package contains helpers for using ucast conditions with Prisma queries.

> [!WARNING]
> This is an experimental package and is subject to change.


## Usage

This package can be used to add filtering to Prisma queries from ucast conditions.

```diff
router.get("/tickets", async (req, res) => {
- const { allow, reason } = await authz.authorized(
+ const { allow, reason, conditions } = await authz.authorized(path, { action: "list" }, req);
  if (!allow) return res.status(FORBIDDEN).json({ reason });

+ const filters = ucastToPrisma(conditions, "tickets");
  const tickets = (
    await prisma.tickets.findMany({
      where: {
        tenant: req.auth.tenant.id,
+       ...filters,
      },
      include: {
        customers: true,
        users: true,
      },
    })
    ).map((ticket) => toTicket(ticket));
  return res.status(OK).json({ tickets });
});
```

The conditions returned by the OPA policy evaluation looks like this:

```json
{
  "conditions": {
    "or": [
      { "tickets.resolved": false },
      { "users.name": "ceasar" }
    ]
  }
}
```

and the call to `ucastToPrisma(conditions, "tickets")` turns it into this
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
