# OpaApiClient SDK


## Overview

Enterprise OPA documentation
<https://docs.styra.com/enterprise-opa>
### Available Operations

* [executeDefaultPolicyWithInput](#executedefaultpolicywithinput) - Execute the default decision  given an input
* [executePolicy](#executepolicy) - Execute a policy
* [executePolicyWithInput](#executepolicywithinput) - Execute a policy given an input
* [executeBatchPolicyWithInput](#executebatchpolicywithinput) - Execute a policy given a batch of inputs
* [health](#health) - Verify the server is operational

## executeDefaultPolicyWithInput

Execute the default decision  given an input

### Example Usage

```typescript
import { OpaApiClient } from "@styra/opa";

const opaApiClient = new OpaApiClient();

async function run() {
  const result = await opaApiClient.executeDefaultPolicyWithInput(8203.11);

  // Handle the result
  console.log(result)
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

| Error Object       | Status Code        | Content Type       |
| ------------------ | ------------------ | ------------------ |
| errors.ClientError | 400,404            | application/json   |
| errors.ServerError | 500                | application/json   |
| errors.SDKError    | 4xx-5xx            | */*                |

## executePolicy

Execute a policy

### Example Usage

```typescript
import { OpaApiClient } from "@styra/opa";

const opaApiClient = new OpaApiClient();

async function run() {
  const result = await opaApiClient.executePolicy({
    path: "app/rbac",
  });

  // Handle the result
  console.log(result)
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

| Error Object       | Status Code        | Content Type       |
| ------------------ | ------------------ | ------------------ |
| errors.ClientError | 400                | application/json   |
| errors.ServerError | 500                | application/json   |
| errors.SDKError    | 4xx-5xx            | */*                |

## executePolicyWithInput

Execute a policy given an input

### Example Usage

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
  console.log(result)
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

| Error Object       | Status Code        | Content Type       |
| ------------------ | ------------------ | ------------------ |
| errors.ClientError | 400                | application/json   |
| errors.ServerError | 500                | application/json   |
| errors.SDKError    | 4xx-5xx            | */*                |

## executeBatchPolicyWithInput

Execute a policy given a batch of inputs

### Example Usage

```typescript
import { OpaApiClient } from "@styra/opa";

const opaApiClient = new OpaApiClient();

async function run() {
  const result = await opaApiClient.executeBatchPolicyWithInput({
    path: "app/rbac",
    requestBody: {
      inputs: {
        "key": "<value>",
      },
    },
  });

  // Handle the result
  console.log(result)
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

| Error Object            | Status Code             | Content Type            |
| ----------------------- | ----------------------- | ----------------------- |
| errors.ClientError      | 400                     | application/json        |
| errors.BatchServerError | 500                     | application/json        |
| errors.SDKError         | 4xx-5xx                 | */*                     |

## health

The health API endpoint executes a simple built-in policy query to verify that the server is operational. Optionally it can account for bundle activation as well (useful for “ready” checks at startup).

### Example Usage

```typescript
import { OpaApiClient } from "@styra/opa";

const opaApiClient = new OpaApiClient();

async function run() {
  const result = await opaApiClient.health();

  // Handle the result
  console.log(result)
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

| Error Object           | Status Code            | Content Type           |
| ---------------------- | ---------------------- | ---------------------- |
| errors.UnhealthyServer | 500                    | application/json       |
| errors.SDKError        | 4xx-5xx                | */*                    |
