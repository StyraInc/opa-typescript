# BatchSuccessfulPolicyEvaluation

All batched policy executions succeeded.
The server also returns 200 if the path refers to an undefined document. In this case, responses will be empty.


## Example Usage

```typescript
import { BatchSuccessfulPolicyEvaluation } from "@styra/opa/sdk/models/components";

let value: BatchSuccessfulPolicyEvaluation = {
  batchDecisionId: "1bef6b7d-cd13-4890-bfe1-fd2e8de32189",
  responses: {
    "key": {
      result: [
        "<value>",
      ],
    },
  },
};
```

## Fields

| Field                                                                                                                                  | Type                                                                                                                                   | Required                                                                                                                               | Description                                                                                                                            | Example                                                                                                                                |
| -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `batchDecisionId`                                                                                                                      | *string*                                                                                                                               | :heavy_minus_sign:                                                                                                                     | N/A                                                                                                                                    | 1bef6b7d-cd13-4890-bfe1-fd2e8de32189                                                                                                   |
| `metrics`                                                                                                                              | Record<string, *any*>                                                                                                                  | :heavy_minus_sign:                                                                                                                     | If query metrics are enabled, this field contains query performance metrics collected during the parse, compile, and evaluation steps. |                                                                                                                                        |
| `responses`                                                                                                                            | Record<string, [components.SuccessfulPolicyResponse](../../../sdk/models/components/successfulpolicyresponse.md)>                      | :heavy_minus_sign:                                                                                                                     | N/A                                                                                                                                    |                                                                                                                                        |