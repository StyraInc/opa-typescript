<!-- Start SDK Example Usage [usage] -->
```typescript
import { OpaApiClient } from "@styra/opa";
import { GzipAcceptEncoding } from "@styra/opa/sdk/models/components";

const opaApiClient = new OpaApiClient();

async function run() {
    const result = await opaApiClient.executeDefaultPolicyWithInput(
        8203.11,
        false,
        GzipAcceptEncoding.Gzip
    );

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
            input: false,
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
                key: "<value>",
            },
        },
    });

    // Handle the result
    console.log(result);
}

run();

```
<!-- End SDK Example Usage [usage] -->