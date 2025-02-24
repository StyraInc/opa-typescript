<!-- Start SDK Example Usage [usage] -->
```typescript
import { OpaApiClient } from "@styra/opa";

const opaApiClient = new OpaApiClient();

async function run() {
  const result = await opaApiClient.executeDefaultPolicyWithInput(4963.69);

  // Handle the result
  console.log(result);
}

run();

```

```typescript
import { OpaApiClient } from "@styra/opa";

const opaApiClient = new OpaApiClient();

async function run() {
  const result = await opaApiClient.executePolicyWithInput({
    path: "app/rbac",
    requestBody: {
      input: true,
    },
  });

  // Handle the result
  console.log(result);
}

run();

```

```typescript
import { OpaApiClient } from "@styra/opa";

const opaApiClient = new OpaApiClient();

async function run() {
  const result = await opaApiClient.executeBatchPolicyWithInput({
    path: "app/rbac",
    requestBody: {
      inputs: {
        "key": 6919.52,
      },
    },
  });

  // Handle the result
  console.log(result);
}

run();

```
<!-- End SDK Example Usage [usage] -->