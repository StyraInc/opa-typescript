# OpaApiClient SDK

## Overview

Enterprise OPA documentation
<https://docs.styra.com/enterprise-opa>

### Available Operations

* [executeDefaultPolicyWithInput](#executedefaultpolicywithinput) - Execute the default decision  given an input
* [executePolicy](#executepolicy) - Execute a policy
* [executePolicyWithInput](#executepolicywithinput) - Execute a policy given an input
* [executeBatchPolicyWithInput](#executebatchpolicywithinput) - Execute a policy given a batch of inputs
* [compileQueryWithPartialEvaluation](#compilequerywithpartialevaluation) - Partially evaluate a query
* [health](#health) - Verify the server is operational

## executeDefaultPolicyWithInput

Execute the default decision  given an input

### Example Usage

<!-- UsageSnippet language="typescript" operationID="executeDefaultPolicyWithInput" method="post" path="/" -->
```typescript
import { OpaApiClient } from "@styra/opa";

const opaApiClient = new OpaApiClient();

async function run() {
  const result = await opaApiClient.executeDefaultPolicyWithInput({
    "user": "alice",
    "action": "read",
    "object": "id123",
    "type": "dog",
  });

  console.log(result);
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { OpaApiClientCore } from "@styra/opa/core.js";
import { executeDefaultPolicyWithInput } from "@styra/opa/funcs/executeDefaultPolicyWithInput.js";

// Use `OpaApiClientCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const opaApiClient = new OpaApiClientCore();

async function run() {
  const res = await executeDefaultPolicyWithInput(opaApiClient, {
    "user": "alice",
    "action": "read",
    "object": "id123",
    "type": "dog",
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("executeDefaultPolicyWithInput failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                                                     | Type                                                                                                                                                                                                          | Required                                                                                                                                                                                                      | Description                                                                                                                                                                                                   |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `input`                                                                                                                                                                                                       | *components.Input*                                                                                                                                                                                            | :heavy_check_mark:                                                                                                                                                                                            | The input document                                                                                                                                                                                            |
| `pretty`                                                                                                                                                                                                      | *boolean*                                                                                                                                                                                                     | :heavy_minus_sign:                                                                                                                                                                                            | If parameter is `true`, response will formatted for humans.                                                                                                                                                   |
| `acceptEncoding`                                                                                                                                                                                              | [components.GzipAcceptEncoding](../../sdk/models/components/gzipacceptencoding.md)                                                                                                                            | :heavy_minus_sign:                                                                                                                                                                                            | Indicates the server should respond with a gzip encoded body. The server will send the compressed response only if its length is above `server.encoding.gzip.min_length` value. See the configuration section |
| `options`                                                                                                                                                                                                     | RequestOptions                                                                                                                                                                                                | :heavy_minus_sign:                                                                                                                                                                                            | Used to set various options for making HTTP requests.                                                                                                                                                         |
| `options.fetchOptions`                                                                                                                                                                                        | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                                                       | :heavy_minus_sign:                                                                                                                                                                                            | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed.                                |
| `options.retries`                                                                                                                                                                                             | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                                                            | Enables retrying HTTP requests under certain failure conditions.                                                                                                                                              |

### Response

**Promise\<[operations.ExecuteDefaultPolicyWithInputResponse](../../sdk/models/operations/executedefaultpolicywithinputresponse.md)\>**

### Errors

| Error Type         | Status Code        | Content Type       |
| ------------------ | ------------------ | ------------------ |
| errors.ClientError | 400, 404           | application/json   |
| errors.ServerError | 500                | application/json   |
| errors.SDKError    | 4XX, 5XX           | \*/\*              |

## executePolicy

Execute a policy

### Example Usage

<!-- UsageSnippet language="typescript" operationID="executePolicy" method="get" path="/v1/data/{path}" -->
```typescript
import { OpaApiClient } from "@styra/opa";

const opaApiClient = new OpaApiClient();

async function run() {
  const result = await opaApiClient.executePolicy({
    path: "app/rbac",
  });

  console.log(result);
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { OpaApiClientCore } from "@styra/opa/core.js";
import { executePolicy } from "@styra/opa/funcs/executePolicy.js";

// Use `OpaApiClientCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const opaApiClient = new OpaApiClientCore();

async function run() {
  const res = await executePolicy(opaApiClient, {
    path: "app/rbac",
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("executePolicy failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.ExecutePolicyRequest](../../sdk/models/operations/executepolicyrequest.md)                                                                                         | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[operations.ExecutePolicyResponse](../../sdk/models/operations/executepolicyresponse.md)\>**

### Errors

| Error Type         | Status Code        | Content Type       |
| ------------------ | ------------------ | ------------------ |
| errors.ClientError | 400                | application/json   |
| errors.ServerError | 500                | application/json   |
| errors.SDKError    | 4XX, 5XX           | \*/\*              |

## executePolicyWithInput

Execute a policy given an input

### Example Usage

<!-- UsageSnippet language="typescript" operationID="executePolicyWithInput" method="post" path="/v1/data/{path}" -->
```typescript
import { OpaApiClient } from "@styra/opa";

const opaApiClient = new OpaApiClient();

async function run() {
  const result = await opaApiClient.executePolicyWithInput({
    path: "app/rbac",
    requestBody: {
      input: {
        "user": "alice",
        "action": "read",
        "object": "id123",
        "type": "dog",
      },
    },
  });

  console.log(result);
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { OpaApiClientCore } from "@styra/opa/core.js";
import { executePolicyWithInput } from "@styra/opa/funcs/executePolicyWithInput.js";

// Use `OpaApiClientCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const opaApiClient = new OpaApiClientCore();

async function run() {
  const res = await executePolicyWithInput(opaApiClient, {
    path: "app/rbac",
    requestBody: {
      input: {
        "user": "alice",
        "action": "read",
        "object": "id123",
        "type": "dog",
      },
    },
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("executePolicyWithInput failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.ExecutePolicyWithInputRequest](../../sdk/models/operations/executepolicywithinputrequest.md)                                                                       | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[operations.ExecutePolicyWithInputResponse](../../sdk/models/operations/executepolicywithinputresponse.md)\>**

### Errors

| Error Type         | Status Code        | Content Type       |
| ------------------ | ------------------ | ------------------ |
| errors.ClientError | 400                | application/json   |
| errors.ServerError | 500                | application/json   |
| errors.SDKError    | 4XX, 5XX           | \*/\*              |

## executeBatchPolicyWithInput

Execute a policy given a batch of inputs

### Example Usage

<!-- UsageSnippet language="typescript" operationID="executeBatchPolicyWithInput" method="post" path="/v1/batch/data/{path}" -->
```typescript
import { OpaApiClient } from "@styra/opa";

const opaApiClient = new OpaApiClient();

async function run() {
  const result = await opaApiClient.executeBatchPolicyWithInput({
    path: "app/rbac",
    requestBody: {
      inputs: {

      },
    },
  });

  console.log(result);
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { OpaApiClientCore } from "@styra/opa/core.js";
import { executeBatchPolicyWithInput } from "@styra/opa/funcs/executeBatchPolicyWithInput.js";

// Use `OpaApiClientCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const opaApiClient = new OpaApiClientCore();

async function run() {
  const res = await executeBatchPolicyWithInput(opaApiClient, {
    path: "app/rbac",
    requestBody: {
      inputs: {
  
      },
    },
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("executeBatchPolicyWithInput failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.ExecuteBatchPolicyWithInputRequest](../../sdk/models/operations/executebatchpolicywithinputrequest.md)                                                             | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[operations.ExecuteBatchPolicyWithInputResponse](../../sdk/models/operations/executebatchpolicywithinputresponse.md)\>**

### Errors

| Error Type              | Status Code             | Content Type            |
| ----------------------- | ----------------------- | ----------------------- |
| errors.ClientError      | 400                     | application/json        |
| errors.BatchServerError | 500                     | application/json        |
| errors.SDKError         | 4XX, 5XX                | \*/\*                   |

## compileQueryWithPartialEvaluation

Partially evaluate a query

### Example Usage

<!-- UsageSnippet language="typescript" operationID="compileQueryWithPartialEvaluation" method="post" path="/v1/compile/{path}" -->
```typescript
import { OpaApiClient } from "@styra/opa";

const opaApiClient = new OpaApiClient();

async function run() {
  const result = await opaApiClient.compileQueryWithPartialEvaluation({
    path: "app/rbac",
    requestBody: {
      input: {
        "user": "alice",
        "action": "read",
        "object": "id123",
        "type": "dog",
      },
    },
  });

  console.log(result);
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { OpaApiClientCore } from "@styra/opa/core.js";
import { compileQueryWithPartialEvaluation } from "@styra/opa/funcs/compileQueryWithPartialEvaluation.js";

// Use `OpaApiClientCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const opaApiClient = new OpaApiClientCore();

async function run() {
  const res = await compileQueryWithPartialEvaluation(opaApiClient, {
    path: "app/rbac",
    requestBody: {
      input: {
        "user": "alice",
        "action": "read",
        "object": "id123",
        "type": "dog",
      },
    },
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("compileQueryWithPartialEvaluation failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.CompileQueryWithPartialEvaluationRequest](../../sdk/models/operations/compilequerywithpartialevaluationrequest.md)                                                 | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[operations.CompileQueryWithPartialEvaluationResponse](../../sdk/models/operations/compilequerywithpartialevaluationresponse.md)\>**

### Errors

| Error Type         | Status Code        | Content Type       |
| ------------------ | ------------------ | ------------------ |
| errors.ClientError | 400                | application/json   |
| errors.ServerError | 500                | application/json   |
| errors.SDKError    | 4XX, 5XX           | \*/\*              |

## health

The health API endpoint executes a simple built-in policy query to verify that the server is operational. Optionally it can account for bundle activation as well (useful for “ready” checks at startup).

### Example Usage

<!-- UsageSnippet language="typescript" operationID="health" method="get" path="/health" -->
```typescript
import { OpaApiClient } from "@styra/opa";

const opaApiClient = new OpaApiClient();

async function run() {
  const result = await opaApiClient.health();

  console.log(result);
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { OpaApiClientCore } from "@styra/opa/core.js";
import { health } from "@styra/opa/funcs/health.js";

// Use `OpaApiClientCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const opaApiClient = new OpaApiClientCore();

async function run() {
  const res = await health(opaApiClient);
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("health failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                                                                                                                     | Type                                                                                                                                                                                                                                                                          | Required                                                                                                                                                                                                                                                                      | Description                                                                                                                                                                                                                                                                   |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `bundles`                                                                                                                                                                                                                                                                     | *boolean*                                                                                                                                                                                                                                                                     | :heavy_minus_sign:                                                                                                                                                                                                                                                            | Boolean parameter to account for bundle activation status in response. This includes any discovery bundles or bundles defined in the loaded discovery configuration.                                                                                                          |
| `plugins`                                                                                                                                                                                                                                                                     | *boolean*                                                                                                                                                                                                                                                                     | :heavy_minus_sign:                                                                                                                                                                                                                                                            | Boolean parameter to account for plugin status in response.                                                                                                                                                                                                                   |
| `excludePlugin`                                                                                                                                                                                                                                                               | *string*[]                                                                                                                                                                                                                                                                    | :heavy_minus_sign:                                                                                                                                                                                                                                                            | String parameter to exclude a plugin from status checks. Can be added multiple times. Does nothing if plugins is not true. This parameter is useful for special use cases where a plugin depends on the server being fully initialized before it can fully initialize itself. |
| `options`                                                                                                                                                                                                                                                                     | RequestOptions                                                                                                                                                                                                                                                                | :heavy_minus_sign:                                                                                                                                                                                                                                                            | Used to set various options for making HTTP requests.                                                                                                                                                                                                                         |
| `options.fetchOptions`                                                                                                                                                                                                                                                        | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                                                                                                                       | :heavy_minus_sign:                                                                                                                                                                                                                                                            | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed.                                                                                                |
| `options.retries`                                                                                                                                                                                                                                                             | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                                                                                                                            | Enables retrying HTTP requests under certain failure conditions.                                                                                                                                                                                                              |

### Response

**Promise\<[operations.HealthResponse](../../sdk/models/operations/healthresponse.md)\>**

### Errors

| Error Type             | Status Code            | Content Type           |
| ---------------------- | ---------------------- | ---------------------- |
| errors.UnhealthyServer | 500                    | application/json       |
| errors.SDKError        | 4XX, 5XX               | \*/\*                  |