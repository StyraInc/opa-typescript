# BatchMixedResults

Mixed success and failures.

## Example Usage

```typescript
import { BatchMixedResults } from "@styra/opa/sdk/models/components";

let value: BatchMixedResults = {
  responses: {
    "key": {
      httpStatusCode: "200",
    },
  },
};
```

## Fields

| Field                                                                                                                                  | Type                                                                                                                                   | Required                                                                                                                               | Description                                                                                                                            |
| -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `batchDecisionId`                                                                                                                      | *string*                                                                                                                               | :heavy_minus_sign:                                                                                                                     | N/A                                                                                                                                    |
| `metrics`                                                                                                                              | Record<string, *any*>                                                                                                                  | :heavy_minus_sign:                                                                                                                     | If query metrics are enabled, this field contains query performance metrics collected during the parse, compile, and evaluation steps. |
| `responses`                                                                                                                            | Record<string, *components.Responses*>                                                                                                 | :heavy_minus_sign:                                                                                                                     | N/A                                                                                                                                    |