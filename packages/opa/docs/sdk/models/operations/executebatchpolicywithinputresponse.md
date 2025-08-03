# ExecuteBatchPolicyWithInputResponse

## Example Usage

```typescript
import { ExecuteBatchPolicyWithInputResponse } from "@styra/opa/sdk/models/operations";

let value: ExecuteBatchPolicyWithInputResponse = {
  headers: {
    "key": [],
    "key1": [
      "<value 1>",
      "<value 2>",
    ],
    "key2": [
      "<value 1>",
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