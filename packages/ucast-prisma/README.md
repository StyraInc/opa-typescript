# @styra/ucast-prisma

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![NPM Version](https://img.shields.io/npm/v/%40styra%2Fucast-prisma?style=flat&color=%2324b6e0)](https://www.npmjs.com/package/@styra/ucast-prisma)

This package contains helpers for using UCAST conditions with Prisma queries.


## Usage

This package can be used to add filtering to Prisma queries from UCAST conditions.
The conditions returned by the [Enterprise OPA Compile API](https://docs.styra.com/enterprise-opa/reference/api-reference/partial-evaluation-api)
look like this:

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

A call to `ucastToPrisma(conditions, "tickets")` turns it into this
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

A similar translation for _masking rules_ is provided through the `mask` helper:
E.g. the mask rules returned from the Compile API,

```json
{
  "tickets.assignee": {
    "replace": {
      "value": "***"
    }
  },
  "users.name": {
    "replace": {
      "value": "<username>"
    }
  }
}
```

can be applied to a Prisma-returned object like

```json
{
  "id": 200,
  "assignee": "bob",
  "users": {
    "id": 10,
    "name": "bobby"
  }
}
```

via `mask(maskRules, obj, "tickets")`, masking the appropriate fields.


## Community

For questions, discussions and announcements related to Styra products, services and open source projects, please join
the Styra community on [Slack](https://communityinviter.com/apps/styracommunity/signup)!
