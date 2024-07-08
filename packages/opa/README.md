# OPA Typescript SDK

The Styra-supported driver to connect to Open Policy Agent (OPA) and Enterprise OPA deployments.

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![NPM Version](https://img.shields.io/npm/v/%40styra%2Fopa?style=flat&color=%2324b6e0)](https://www.npmjs.com/package/@styra/opa)
[![JSR](https://jsr.io/badges/@styra/opa)](https://jsr.io/@styra/opa)

> The documentation for this SDK lives at https://docs.styra.com/sdk, with reference documentation available at https://styrainc.github.io/opa-typescript

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

<!-- Start Requirements [requirements] -->
## Requirements

For supported JavaScript runtimes, please consult [RUNTIMES.md](RUNTIMES.md).
<!-- End Requirements [requirements] -->

## SDK Example Usage (high-level)

All the code examples that follow assume that the high-level SDK module has been imported, and that an `OPA` instance was created:

```ts
import { OPAClient } from "@styra/opa";

const serverURL = "http://opa-host:8181";
const path = "authz/allow";
const opa = new OPAClient(serverURL);
```

### Simple query

For a simple boolean response without input, use the SDK as follows:

```ts
const allowed = await opa.evaluate(path);
console.log(allowed ? "allowed!" : "denied!");
```

Note that `allowed` will be of type `any`. You can change that by providing type parameters to `evaluate`:

```ts
const allowed = await opa.evaluate<never, boolean>(path);
```

The first parameter is the type of `input` passed into `evaluate`; we don't have any in this example, so you can use anything for it (`any`, `unknown`, or `never`).

<details><summary>HTTP Request</summary>

```http
POST /v1/data/authz/allow
Content-Type: application/json

{}
```

</details>

### Input

Input is provided as a second (optional) argument to `evaluate`:

```ts
const input = { user: "alice" };
const allowed = await opa.evaluate(path, input);
console.log(allowed ? "allowed!" : "denied!");
```

For providing types, use

```ts
interface myInput {
  user: string;
}
const input: myInput = { user: "alice" };
const allowed = await opa.evaluate<myInput, boolean>(path, input);
console.log(allowed ? "allowed!" : "denied!");
```

<details><summary>HTTP Request</summary>

```http
POST /v1/data/authz/allow
Content-Type: application/json

{ "input": { "user": "alice" } }
```

</details>

### Result Types

When the result of the policy evaluation is more complex, you can pass its type to `evaluate` and get a typed result:

```ts
interface myInput {
  user: string;
}
interface myResult {
  authorized: boolean;
  details: string[];
}
const input: myInput = { user: "alice" };
const result = await opa.evaluate<myInput, myResult>(path, input);
console.log(result.evaluated ? "allowed!" : "denied!");
```

### Input Transformations

If you pass in an arbitrary object as input, it'll be stringified (`JSON.stringify`):

```ts
class A {
  // With these names, JSON.stringify() returns the right thing.
  name: string;
  list: any[];

  constructor(name: string, list: any[]) {
    this.name = name;
    this.list = list;
  }
}
const inp = new A("alice", [1, 2, true]);
const allowed = await opa.evaluate<myInput, boolean>(path, inp);
console.log(allowed ? "allowed!" : "denied!");
```

You can control the input that's constructed from an object by implementing `ToInput`:

```ts
class A implements ToInput {
  // With these names, JSON.stringify() doesn't return the right thing.
  private n: string;
  private l: any[];

  constructor(name: string, list: any[]) {
    this.n = name;
    this.l = list;
  }

  toInput(): Input {
    return { name: this.n, list: this.l };
  }
}
const inp = new A("alice", [1, 2, true]);
const allowed = await opa.evaluate<myInput, boolean>(path, inp);
console.log(allowed ? "allowed!" : "denied!");
```

<details><summary>HTTP Request</summary>

```http
POST /v1/data/authz/allow
Content-Type: application/json

{ "input": { "name": "alice", "list": [ 1, 2, true ] } }
```

</details>

### Result Transformations

If the result format of the policy evaluation does not match what you want it to be, you can provide a _third argument_, a function that transforms the API result.

Assuming that the policy evaluates to

```json
{
  "allowed": true,
  "details": ["property-a is OK", "property-B is OK"]
}
```

you can turn it into a boolean result like this:

```ts
const allowed = await opa.evaluate<any, boolean>(path, undefined, {
  fromResult: (r?: Result) => (r as Record<string, any>)["allowed"] ?? false,
});
console.log(allowed ? "allowed!" : "denied!");
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

In [StyraInc/opa-typescript-example-nestjs](https://github.com/StyraInc/opa-typescript-example-nestjs), we have an decorator-based API authorization example using `@styra/opa`:

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

Please refer to [the repository's README.md](https://github.com/StyraInc/opa-typescript-example-nestjs/tree/main#opa-typescript-nestjs-example) for more details.

> **Note**: For low-level SDK usage, see the sections below.

---

# OPA OpenAPI SDK (low-level)

<!--
We've removed most of the auto-generated Speakeasy examples because they generate the wrong import path.
-->

<!-- No SDK Example Usage [usage] -->

<!-- Start Available Resources and Operations [operations] -->
## Available Resources and Operations

### [OpaApiClient SDK](docs/sdks/opaapiclient/README.md)

* [executeDefaultPolicyWithInput](docs/sdks/opaapiclient/README.md#executedefaultpolicywithinput) - Execute the default decision  given an input
* [executePolicy](docs/sdks/opaapiclient/README.md#executepolicy) - Execute a policy
* [executePolicyWithInput](docs/sdks/opaapiclient/README.md#executepolicywithinput) - Execute a policy given an input
* [executeBatchPolicyWithInput](docs/sdks/opaapiclient/README.md#executebatchpolicywithinput) - Execute a policy given a batch of inputs
* [health](docs/sdks/opaapiclient/README.md#health) - Verify the server is operational
<!-- End Available Resources and Operations [operations] -->

<!-- No Error Handling [errors] -->

<!-- No Server Selection [server] -->

<!-- No Custom HTTP Client [http-client] -->

<!-- Placeholder for Future Speakeasy SDK Sections -->

## Community

For questions, discussions and announcements related to Styra products, services and open source projects, please join
the Styra community on [Slack](https://communityinviter.com/apps/styracommunity/signup)!
