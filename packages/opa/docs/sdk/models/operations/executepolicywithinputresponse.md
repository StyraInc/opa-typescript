# ExecutePolicyWithInputResponse

## Example Usage

```typescript
import { ExecutePolicyWithInputResponse } from "@styra/opa/sdk/models/operations";

let value: ExecutePolicyWithInputResponse = {
  httpMeta: {
    response: new Response("{\"message\": \"hello world\"}", {
      headers: { "Content-Type": "application/json" },
    }),
    request: new Request("https://example.com"),
  },
  successfulPolicyResponse: {
    result: 8472.52,
  },
  headers: {
    "key": [
      "<value>",
    ],
  },
};
```

## Fields

| Field                                                                                                                                             | Type                                                                                                                                              | Required                                                                                                                                          | Description                                                                                                                                       |
| ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `httpMeta`                                                                                                                                        | [components.HTTPMetadata](../../../sdk/models/components/httpmetadata.md)                                                                         | :heavy_check_mark:                                                                                                                                | N/A                                                                                                                                               |
| `successfulPolicyResponse`                                                                                                                        | [components.SuccessfulPolicyResponse](../../../sdk/models/components/successfulpolicyresponse.md)                                                 | :heavy_minus_sign:                                                                                                                                | Success.<br/>The server also returns 200 if the path refers to an undefined document. In this case, the response will not contain a result property.<br/> |
| `headers`                                                                                                                                         | Record<string, *string*[]>                                                                                                                        | :heavy_check_mark:                                                                                                                                | N/A                                                                                                                                               |