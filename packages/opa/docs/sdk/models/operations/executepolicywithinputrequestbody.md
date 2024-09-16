# ExecutePolicyWithInputRequestBody

The input document

## Example Usage

```typescript
import { ExecutePolicyWithInputRequestBody } from "@styra/opa/sdk/models/operations";

let value: ExecutePolicyWithInputRequestBody = {
  input: [
    "<value>",
  ],
};
```

## Fields

| Field                                                         | Type                                                          | Required                                                      | Description                                                   |
| ------------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------- |
| `input`                                                       | *components.Input*                                            | :heavy_check_mark:                                            | Arbitrary JSON used within your policies by accessing `input` |