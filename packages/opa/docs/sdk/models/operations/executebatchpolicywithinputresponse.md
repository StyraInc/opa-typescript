# ExecuteBatchPolicyWithInputResponse

## Example Usage

```typescript
import { ExecuteBatchPolicyWithInputResponse } from "@styra/opa/sdk/models/operations";

let value: ExecuteBatchPolicyWithInputResponse = {
  httpMeta: {
    response: new Response("{\"message\": \"hello world\"}", {
      headers: { "Content-Type": "application/json" },
    }),
    request: new Request("https://example.com"),
  },
  batchSuccessfulPolicyEvaluation: {
    batchDecisionId: "1bef6b7d-cd13-4890-bfe1-fd2e8de32189",
    responses: {
      "key": {
        result: "<value>",
      },
    },
  },
  batchMixedResults: {
    responses: {
      "key": {
        httpStatusCode: "200",
        result: "<value>",
      },
    },
  },
  headers: {
    "key": [
      "<value>",
    ],
  },
};
```

## Fields

| Field                                                                                                                                                     | Type                                                                                                                                                      | Required                                                                                                                                                  | Description                                                                                                                                               |
| --------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `httpMeta`                                                                                                                                                | [components.HTTPMetadata](../../../sdk/models/components/httpmetadata.md)                                                                                 | :heavy_check_mark:                                                                                                                                        | N/A                                                                                                                                                       |
| `batchSuccessfulPolicyEvaluation`                                                                                                                         | [components.BatchSuccessfulPolicyEvaluation](../../../sdk/models/components/batchsuccessfulpolicyevaluation.md)                                           | :heavy_minus_sign:                                                                                                                                        | All batched policy executions succeeded.<br/>The server also returns 200 if the path refers to an undefined document. In this case, responses will be empty.<br/> |
| `batchMixedResults`                                                                                                                                       | [components.BatchMixedResults](../../../sdk/models/components/batchmixedresults.md)                                                                       | :heavy_minus_sign:                                                                                                                                        | Mixed success and failures.                                                                                                                               |
| `headers`                                                                                                                                                 | Record<string, *string*[]>                                                                                                                                | :heavy_check_mark:                                                                                                                                        | N/A                                                                                                                                                       |