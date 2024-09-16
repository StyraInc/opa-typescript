# ServerErrorErrors

## Example Usage

```typescript
import { ServerErrorErrors } from "@styra/opa/sdk/models/errors";

let value: ServerErrorErrors = {
  code: "<value>",
  message: "<value>",
};
```

## Fields

| Field                                                                           | Type                                                                            | Required                                                                        | Description                                                                     |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `code`                                                                          | *string*                                                                        | :heavy_check_mark:                                                              | N/A                                                                             |
| `message`                                                                       | *string*                                                                        | :heavy_check_mark:                                                              | N/A                                                                             |
| `location`                                                                      | [errors.ServerErrorLocation](../../../sdk/models/errors/servererrorlocation.md) | :heavy_minus_sign:                                                              | N/A                                                                             |