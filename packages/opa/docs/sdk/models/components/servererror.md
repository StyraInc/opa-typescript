# ServerError

## Example Usage

```typescript
import { ServerError } from "@styra/opa/sdk/models/components";

let value: ServerError = {
  code: "<value>",
  message: "<value>",
  decisionId: "b84cf736-213c-4932-a8e4-bb5c648f1b4d",
};
```

## Fields

| Field                                                                         | Type                                                                          | Required                                                                      | Description                                                                   | Example                                                                       |
| ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `code`                                                                        | *string*                                                                      | :heavy_check_mark:                                                            | N/A                                                                           |                                                                               |
| `message`                                                                     | *string*                                                                      | :heavy_check_mark:                                                            | N/A                                                                           |                                                                               |
| `errors`                                                                      | [errors.ServerErrorErrors](../../../sdk/models/errors/servererrorerrors.md)[] | :heavy_minus_sign:                                                            | N/A                                                                           |                                                                               |
| `decisionId`                                                                  | *string*                                                                      | :heavy_minus_sign:                                                            | N/A                                                                           | b84cf736-213c-4932-a8e4-bb5c648f1b4d                                          |