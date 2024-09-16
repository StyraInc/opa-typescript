# Errors

## Example Usage

```typescript
import { Errors } from "@styra/opa/sdk/models/errors";

let value: Errors = {
  code: "<value>",
  message: "<value>",
};
```

## Fields

| Field                                                     | Type                                                      | Required                                                  | Description                                               |
| --------------------------------------------------------- | --------------------------------------------------------- | --------------------------------------------------------- | --------------------------------------------------------- |
| `code`                                                    | *string*                                                  | :heavy_check_mark:                                        | N/A                                                       |
| `message`                                                 | *string*                                                  | :heavy_check_mark:                                        | N/A                                                       |
| `location`                                                | [errors.Location](../../../sdk/models/errors/location.md) | :heavy_minus_sign:                                        | N/A                                                       |