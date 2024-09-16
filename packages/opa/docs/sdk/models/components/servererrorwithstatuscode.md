# ServerErrorWithStatusCode

## Example Usage

```typescript
import { ServerErrorWithStatusCode } from "@styra/opa/sdk/models/components";

let value: ServerErrorWithStatusCode = {
  httpStatusCode: "200",
  code: "<value>",
  message: "<value>",
  decisionId: "b84cf736-213c-4932-a8e4-bb5c648f1b4d",
};
```

## Fields

| Field                                                           | Type                                                            | Required                                                        | Description                                                     | Example                                                         |
| --------------------------------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------- |
| `httpStatusCode`                                                | *string*                                                        | :heavy_minus_sign:                                              | N/A                                                             | 200                                                             |
| `code`                                                          | *string*                                                        | :heavy_check_mark:                                              | N/A                                                             |                                                                 |
| `message`                                                       | *string*                                                        | :heavy_check_mark:                                              | N/A                                                             |                                                                 |
| `errors`                                                        | [components.Errors](../../../sdk/models/components/errors.md)[] | :heavy_minus_sign:                                              | N/A                                                             |                                                                 |
| `decisionId`                                                    | *string*                                                        | :heavy_minus_sign:                                              | N/A                                                             | b84cf736-213c-4932-a8e4-bb5c648f1b4d                            |