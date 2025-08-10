# ExecutePolicyWithInputRequestBody

The input document

## Example Usage

```typescript
import { ExecutePolicyWithInputRequestBody } from "@styra/opa/sdk/models/operations";

let value: ExecutePolicyWithInputRequestBody = {
  input: {
    "user": "alice",
    "action": "read",
    "object": "id123",
    "type": "dog",
  },
};
```

## Fields

| Field                                                         | Type                                                          | Required                                                      | Description                                                   |
| ------------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------- |
| `input`                                                       | *components.Input*                                            | :heavy_check_mark:                                            | Arbitrary JSON used within your policies by accessing `input` |