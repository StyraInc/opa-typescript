# ExecuteDefaultPolicyWithInputResponse

## Example Usage

```typescript
import { ExecuteDefaultPolicyWithInputResponse } from "@styra/opa/sdk/models/operations";

let value: ExecuteDefaultPolicyWithInputResponse = {
  httpMeta: {
    response: new Response("{\"message\": \"hello world\"}", {
      headers: { "Content-Type": "application/json" },
    }),
    request: new Request("https://example.com"),
  },
  result: "<value>",
  headers: {
    "key": [
      "<value>",
    ],
  },
};
```

## Fields

| Field                                                                                                                                               | Type                                                                                                                                                | Required                                                                                                                                            | Description                                                                                                                                         |
| --------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `httpMeta`                                                                                                                                          | [components.HTTPMetadata](../../../sdk/models/components/httpmetadata.md)                                                                           | :heavy_check_mark:                                                                                                                                  | N/A                                                                                                                                                 |
| `result`                                                                                                                                            | *components.Result*                                                                                                                                 | :heavy_minus_sign:                                                                                                                                  | Success.<br/>Evaluating the default policy has the same response behavior as a successful policy evaluation, but with only the result as the response.<br/> |
| `headers`                                                                                                                                           | Record<string, *string*[]>                                                                                                                          | :heavy_check_mark:                                                                                                                                  | N/A                                                                                                                                                 |