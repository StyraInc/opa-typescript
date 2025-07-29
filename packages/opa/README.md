# OPA Typescript SDK

The Styra-supported driver to connect to Open Policy Agent (OPA) and Enterprise OPA deployments.

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![NPM Version](https://img.shields.io/npm/v/%40styra%2Fopa?style=flat&color=%2324b6e0)](https://www.npmjs.com/package/@styra/opa)
[![JSR](https://jsr.io/badges/@styra/opa)](https://jsr.io/@styra/opa)

> Reference documentation available at <https://styrainc.github.io/opa-typescript>

You can use the Styra OPA SDK to connect to [Open Policy Agent](https://www.openpolicyagent.org/) and [Enterprise OPA](https://www.styra.com/enterprise-opa/) deployments.

## SDK Installation

### NPM

```bash
npm add @styra/opa
```

### PNPM

```bash
pnpm add @styra/opa
```

### Bun

```bash
bun add @styra/opa
```

### Yarn

```bash
yarn add @styra/opa zod

# Note that Yarn does not install peer dependencies automatically. You will need
# to install zod as shown above.
```
<!-- No SDK Installation [installation] -->

<!-- Start Summary [summary] -->
## Summary

For more information about the API: [Enterprise OPA documentation](https://docs.styra.com/enterprise-opa)
<!-- End Summary [summary] -->

<!-- Start Table of Contents [toc] -->
## Table of Contents
<!-- $toc-max-depth=2 -->
* [OPA Typescript SDK](#opa-typescript-sdk)
  * [SDK Installation](#sdk-installation)
  * [Requirements](#requirements)
  * [SDK Example Usage (high-level)](#sdk-example-usage-high-level)
* [OPA OpenAPI SDK (low-level)](#opa-openapi-sdk-low-level)
  * [Available Resources and Operations](#available-resources-and-operations)
  * [Retries](#retries)
  * [Authentication](#authentication)
  * [Debugging](#debugging)
  * [Standalone functions](#standalone-functions)
  * [Community](#community)

<!-- End Table of Contents [toc] -->

<!-- Start Requirements [requirements] -->
## Requirements

For supported JavaScript runtimes, please consult [RUNTIMES.md](RUNTIMES.md).
<!-- End Requirements [requirements] -->

## SDK Example Usage (high-level)

The following examples assume an OPA server equipped with the following Rego policy:

```rego
package authz
import rego.v1

default allow := false
allow if input.subject == "alice"
```

and this data:

```json
{
  "roles": {
    "admin": ["read", "write"]
  }
}
```

### Simple Query

For a simple boolean response without input, use the SDK as follows:

```ts
import { OPAClient } from "@styra/opa";
const serverURL = "http://localhost:8181";
const opa = new OPAClient(serverURL);
const path = "authz/allow";

const allowed = await opa.evaluate(path);
console.log(allowed ? "allowed!" : "denied!");
```

### Default Rule

For evaluating the default rule (configured with your OPA service), use `evaluateDefault`. `input` is optional, and left out in this example:

```ts
import { OPAClient } from "@styra/opa";
const serverURL = "http://localhost:8181";
const opa = new OPAClient(serverURL);

const allowed = await opa.evaluateDefault();
console.log(allowed ? "allowed!" : "denied!");
```

### Input

Input is provided as a second (optional) argument to `evaluate`:

```ts
import { OPAClient } from "@styra/opa";
const serverURL = "http://localhost:8181";
const opa = new OPAClient(serverURL);
const path = "authz/allow";

const input = { subject: "alice" };
const allowed = await opa.evaluate(path, input);
console.log(allowed ? "allowed!" : "denied!");
```

### Default Rule with Input

Input is provided as an (optional) argument to `evaluateDefault`:

```ts
import { OPAClient } from "@styra/opa";
const serverURL = "http://localhost:8181";
const opa = new OPAClient(serverURL);

const input = { subject: "alice" };
const allowed = await opa.evaluateDefault(input);
console.log(allowed ? "allowed!" : "denied!");
```

> [!NOTE]
> Everything that follows applies in the same way to `evaluateDefault` and `evaluate`.

### Input and Result Types

It's possible to provide your own types for input and results.
The `evaluate` function will then return a typed result, and TypeScript will ensure that you pass the proper types (as declared) to `evaluated`.

```ts
import { OPAClient } from "@styra/opa";
const serverURL = "http://localhost:8181";
const opa = new OPAClient(serverURL);
const path = "authz";

interface myInput {
  subject: string;
}
interface myResult {
  allow: boolean;
}
const input: myInput = { subject: "alice" };
const result = await opa.evaluate<myInput, myResult>(path, input);
console.log(result);
```

If you pass in an arbitrary object as input, it'll be stringified (`JSON.stringify`):

```ts
import { OPAClient } from "@styra/opa";
const serverURL = "http://localhost:8181";
const opa = new OPAClient(serverURL);
const path = "authz/allow";

class User {
  subject: string;
  constructor(name: string) {
    this.subject = name;
  }
}

const inp = new User("alice");
const allowed = await opa.evaluate<User, boolean>(path, inp);
console.log(allowed);
```

You can control the input that's constructed from an object by implementing `ToInput`:

```ts
import { OPAClient, ToInput } from "@styra/opa";
const serverURL = "http://localhost:8181";
const opa = new OPAClient(serverURL);
const path = "authz/allow";

class User implements ToInput {
  private n: string;
  constructor(name: string) {
    this.n = name;
  }
  toInput(): Input {
    return { subject: this.n };
  }
}

const inp = new User("alice");
const allowed = await opa.evaluate<User, boolean>(path, inp);
console.log(allowed);
```

### Result Transformations

If the result format of the policy evaluation does not match what you want it to be, you can provide a _third argument_, a function that transforms the API result.

Assuming that the policy evaluates to

```json
{
  "allowed": true,
  "details": ["input.a is OK", "input.b is OK"]
}
```

like this (contrived) example:

```rego
package authz
import rego.v1
good_a := ["a", "A", "A!"]
good_b := ["b"]
response.allowed if input.subject == "alice"
response.details contains "input.a is OK" if input.a in good_a
response.details contains "input.b is OK" if input.b in good_b
```

you can turn it into a boolean result like this:

```ts
import { OPAClient } from "@styra/opa";
const serverURL = "http://localhost:8181";
const opa = new OPAClient(serverURL);
const path = "authz/response";
const input = { subject: "alice", a: "A", b: "b" };

const allowed = await opa.evaluate<any, boolean>(
  path,
  input,
  {
    fromResult: (r?: Result) => (r as Record<string, any>)["allowed"] ?? false,
  },
);
console.log(allowed);
```

### Batched Queries

```ts
import { OPAClient } from "@styra/opa";

const serverURL = "http://localhost:8181";
const path = "authz/allow";
const opa = new OPAClient(serverURL);

const alice = { subject: "alice" };
const bob = { subject: "bob" };
const inputs = { alice: alice, bob: bob };
const responses = await opa.evaluateBatch(path, inputs);

for (const key in responses) {
    console.log(key + ": " + (responses[key] ? "allowed!" : "denied!"));   // Logic here
}
```

<details>
  <summary>Result</summary>

```txt
alice: allowed!
bob: denied!
```

</details>

## Get Filters

To use the translation of Rego data filter policies into SQL or UCAST expressions, you need to use Enterprise OPA.
These examples assume you run Enterprise OPA with the following Rego policy:

```rego
package filters

# METADATA
# scope: document
# custom:
#   unknowns: ["input.fruits"]
#   mask_rule: masks
include if input.fruits.colour in input.fav_colours

masks.fruits.supplier.replace.value := "<supplier>"
```

### For Prisma

```ts
import { OPAClient } from "@styra/opa";
const serverURL = "http://localhost:8181";
const opa = new OPAClient(serverURL);
const path = "filters/include";
const input = { fav_colours: ["red", "green"] };
const primary = "fruits";

const { query, mask } = await opa.getFilters(path, input, primary);
console.log(query);
```

Here, `query` is an object that can readly be used in a Prisma lookup's `where` field:

```ts
{ colour: { in: [ "red", "green" ] } }
```

`mask` is a function that can be applied to the values returned by that lookup.

For example:

```ts
const { query, mask } = await opa.getFilters(path, input, primary);
const fruits = (
  await prisma.fruits.findMany({
    where: query,
  })
).map((fruit) => mask(fruit));
```

### For SQL

```ts
import { OPAClient } from "@styra/opa";
const serverURL = "http://localhost:8181";
const opa = new OPAClient(serverURL);
const path = "filters/include";
const input = { fav_colours: ["red", "green"] };
const opts = { target: "postgresql" };

const { query, masks } = await opa.getFilters(path, input, opts);
console.log({ query, masks });
```

Here we get a SQL WHERE clause as `query`,

```sql
WHERE fruits.colour IN (E'red', E'green')
```

and `masks` contains the evaluated mask rule:

```ts
{ fruits: { supplier: { replace: { value: "<supplier>" } } } }
```

#### Table name mappings

Generate a SQL filter with different column and table names via `tableMappings`:

```ts
const opts = {
  target: "postgresql",
  tableMappings: {
    "fruits": { $self: "f", colour: "col"}
  }
};
```

this will generate the SQL clause

```sql
WHERE f.col IN (E'red', E'green')
```

### For multiple data sources

```ts
import { OPAClient } from "@styra/opa";
const serverURL = "http://localhost:8181";
const opa = new OPAClient(serverURL);
const path = "filters/include";
const input = { fav_colours: ["red", "green"] };
const opts = { targets: ["postgresql", "mysql", "ucastPrisma"] };

const result = await opa.getMultipleFilters(path, input, opts);
console.dir(result, {depth: null});
```

This produces an object keyed by the requested targets:

```ts
{
  ucast: {
    query: {
      type: "field",
      operator: "in",
      field: "fruits.colour",
      value: [ "red", "green" ]
    },
    masks: {
      fruits: { supplier: { replace: { value: "<supplier>" } } }
    }
  },
  postgresql: {
    query: "WHERE fruits.colour IN (E'red', E'green')",
    masks: {
      fruits: { supplier: { replace: { value: "<supplier>" } } }
    }
  },
  mysql: {
    query: "WHERE fruits.colour IN ('red', 'green')",
    masks: {
      fruits: { supplier: { replace: { value: "<supplier>" } } }
    }
  }
}
```

## Advanced options

### Request Headers

You can provide your custom headers -- for example for bearer authorization -- via an option argument to the `OPAClient` constructor.

```ts
import { OPAClient } from "@styra/opa";
const serverURL = "http://localhost:8181";
const opa = new OPAClient(serverURL, { headers: { authorization: "Bearer opensesame" } });
const path = "authz/allow";
const allowed = await opa.evaluate(path);
console.log(allowed);
```

### HTTPClient

You can supply an instance of `HTTPClient` to supply your own hooks, for example to examine the request sent to OPA:

```ts
import { OPAClient } from "@styra/opa";
import { HTTPClient } from "@styra/opa/lib/http";
const httpClient = new HTTPClient({});
httpClient.addHook("response", (response, request) => {
  console.group("Request Debugging");
  console.log(request.headers);
  console.log(`${request.method} ${request.url} => ${response.status} ${response.statusText}`);
  console.groupEnd();
});
const serverURL = "http://localhost:8181";
const headers = { authorization: "Bearer opensesame" };
const opa = new OPAClient(serverURL, { sdk: { httpClient }, headers });
const path = "authz/allow";

const allowed = await opa.evaluate(path);
console.log(allowed);
```

### Example Projects

#### Express

In [the StyraInc/styra-demo-tickethub repository](https://github.com/StyraInc/styra-demo-tickethub/tree/main/server/node), you'll find a NodeJS backend service that is using `@styra/opa`:

```javascript
router.get("/tickets/:id", [param("id").isInt().toInt()], async (req, res) => {
  const {
    params: { id },
  } = req;
  await authz.evaluated(path, { action: "get", id }, req);

  const ticket = await prisma.tickets.findUniqueOrThrow({
    where: { id },
    ...includeCustomers,
  });
  return res.status(OK).json(toTicket(ticket));
});
```

#### NestJS

In [StyraInc/opa-sdk-demos/nestjs-demo](https://github.com/StyraInc/opa-sdk-demos/tree/main/nestjs-demo), we have an decorator-based API authorization example using `@styra/opa`:

```ts
@Controller("cats")
@AuthzQuery("cats/allow")
@AuthzStatic({ resource: "cat" })
export class CatsController {
  constructor(private catsService: CatsService) {}

  @Post()
  @Authz(({ body: { name } }) => ({ name, action: "create" }))
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }

  @Get(":name")
  @AuthzQuery("cats") // For illustration, we're querying the package extent
  @Decision((r) => r.allow)
  @Authz(({ params: { name } }) => ({
    name,
    action: "get",
  }))
  async findByName(@Param("name") name: string): Promise<Cat> {
    return this.catsService.findByName(name);
  }
}
```

Please refer to [the repository's README.md](https://github.com/StyraInc/opa-sdk-demos/tree/main/nestjs-demo) for more details.

> [!NOTE]
> For low-level SDK usage, see the sections below.

---

# OPA OpenAPI SDK (low-level)

<!--
We've removed most of the auto-generated Speakeasy examples because they generate the wrong import path.
-->

<!-- No SDK Example Usage [usage] -->

<!-- Start Available Resources and Operations [operations] -->
## Available Resources and Operations

<details open>
<summary>Available methods</summary>

### [OpaApiClient SDK](docs/sdks/opaapiclient/README.md)

* [executeDefaultPolicyWithInput](docs/sdks/opaapiclient/README.md#executedefaultpolicywithinput) - Execute the default decision  given an input
* [executePolicy](docs/sdks/opaapiclient/README.md#executepolicy) - Execute a policy
* [executePolicyWithInput](docs/sdks/opaapiclient/README.md#executepolicywithinput) - Execute a policy given an input
* [executeBatchPolicyWithInput](docs/sdks/opaapiclient/README.md#executebatchpolicywithinput) - Execute a policy given a batch of inputs
* [compileQueryWithPartialEvaluation](docs/sdks/opaapiclient/README.md#compilequerywithpartialevaluation) - Partially evaluate a query
* [health](docs/sdks/opaapiclient/README.md#health) - Verify the server is operational

</details>
<!-- End Available Resources and Operations [operations] -->

<!-- No Error Handling [errors] -->

<!-- No Server Selection [server] -->

<!-- No Custom HTTP Client [http-client] -->

<!-- Start Retries [retries] -->
## Retries

Some of the endpoints in this SDK support retries.  If you use the SDK without any configuration, it will fall back to the default retry strategy provided by the API.  However, the default retry strategy can be overridden on a per-operation basis, or across the entire SDK.

To change the default retry strategy for a single API call, simply provide a retryConfig object to the call:

```typescript
import { OpaApiClient } from "@styra/opa";

const opaApiClient = new OpaApiClient();

async function run() {
  const result = await opaApiClient.executeDefaultPolicyWithInput(4963.69, {
    retries: {
      strategy: "backoff",
      backoff: {
        initialInterval: 1,
        maxInterval: 50,
        exponent: 1.1,
        maxElapsedTime: 100,
      },
      retryConnectionErrors: false,
    },
  });

  // Handle the result
  console.log(result);
}

run();

```

If you'd like to override the default retry strategy for all operations that support retries, you can provide a retryConfig at SDK initialization:

```typescript
import { OpaApiClient } from "@styra/opa";

const opaApiClient = new OpaApiClient({
  retryConfig: {
    strategy: "backoff",
    backoff: {
      initialInterval: 1,
      maxInterval: 50,
      exponent: 1.1,
      maxElapsedTime: 100,
    },
    retryConnectionErrors: false,
  },
});

async function run() {
  const result = await opaApiClient.executeDefaultPolicyWithInput(4963.69);

  // Handle the result
  console.log(result);
}

run();

```
<!-- End Retries [retries] -->

<!-- Start Authentication [security] -->
## Authentication

### Per-Client Security Schemes

This SDK supports the following security scheme globally:

| Name         | Type | Scheme      |
| ------------ | ---- | ----------- |
| `bearerAuth` | http | HTTP Bearer |

To authenticate with the API the `bearerAuth` parameter must be set when initializing the SDK client instance. For example:

```typescript
import { OpaApiClient } from "@styra/opa";

const opaApiClient = new OpaApiClient({
  bearerAuth: "<YOUR_BEARER_TOKEN_HERE>",
});

async function run() {
  const result = await opaApiClient.executeDefaultPolicyWithInput(4963.69);

  // Handle the result
  console.log(result);
}

run();

```
<!-- End Authentication [security] -->

<!-- Start Debugging [debug] -->
## Debugging

You can setup your SDK to emit debug logs for SDK requests and responses.

You can pass a logger that matches `console`'s interface as an SDK option.

> [!WARNING]
> Beware that debug logging will reveal secrets, like API tokens in headers, in log messages printed to a console or files. It's recommended to use this feature only during local development and not in production.

```typescript
import { OpaApiClient } from "@styra/opa";

const sdk = new OpaApiClient({ debugLogger: console });
```
<!-- End Debugging [debug] -->

<!-- Start Standalone functions [standalone-funcs] -->
## Standalone functions

All the methods listed above are available as standalone functions. These
functions are ideal for use in applications running in the browser, serverless
runtimes or other environments where application bundle size is a primary
concern. When using a bundler to build your application, all unused
functionality will be either excluded from the final bundle or tree-shaken away.

To read more about standalone functions, check [FUNCTIONS.md](./FUNCTIONS.md).

<details>

<summary>Available standalone functions</summary>

* [`compileQueryWithPartialEvaluation`](docs/sdks/opaapiclient/README.md#compilequerywithpartialevaluation) - Partially evaluate a query
* [`executeBatchPolicyWithInput`](docs/sdks/opaapiclient/README.md#executebatchpolicywithinput) - Execute a policy given a batch of inputs
* [`executeDefaultPolicyWithInput`](docs/sdks/opaapiclient/README.md#executedefaultpolicywithinput) - Execute the default decision  given an input
* [`executePolicy`](docs/sdks/opaapiclient/README.md#executepolicy) - Execute a policy
* [`executePolicyWithInput`](docs/sdks/opaapiclient/README.md#executepolicywithinput) - Execute a policy given an input
* [`health`](docs/sdks/opaapiclient/README.md#health) - Verify the server is operational

</details>
<!-- End Standalone functions [standalone-funcs] -->

<!-- Placeholder for Future Speakeasy SDK Sections -->

## Community

For questions, discussions and announcements related to Styra products, services and open source projects, please join
the Styra community on [Slack](https://communityinviter.com/apps/styracommunity/signup)!
