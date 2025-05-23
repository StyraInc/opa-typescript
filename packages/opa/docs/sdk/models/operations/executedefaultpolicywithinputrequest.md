# ExecuteDefaultPolicyWithInputRequest

## Example Usage

```typescript
import { ExecuteDefaultPolicyWithInputRequest } from "@styra/opa/sdk/models/operations";

let value: ExecuteDefaultPolicyWithInputRequest = {
  input: {
    "user": "alice",
    "action": "read",
    "object": "id123",
    "type": "dog",
  },
};
```

## Fields

| Field                                                                                                                                                                                                         | Type                                                                                                                                                                                                          | Required                                                                                                                                                                                                      | Description                                                                                                                                                                                                   |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pretty`                                                                                                                                                                                                      | *boolean*                                                                                                                                                                                                     | :heavy_minus_sign:                                                                                                                                                                                            | If parameter is `true`, response will formatted for humans.                                                                                                                                                   |
| `acceptEncoding`                                                                                                                                                                                              | [components.GzipAcceptEncoding](../../../sdk/models/components/gzipacceptencoding.md)                                                                                                                         | :heavy_minus_sign:                                                                                                                                                                                            | Indicates the server should respond with a gzip encoded body. The server will send the compressed response only if its length is above `server.encoding.gzip.min_length` value. See the configuration section |
| `input`                                                                                                                                                                                                       | *components.Input*                                                                                                                                                                                            | :heavy_check_mark:                                                                                                                                                                                            | The input document                                                                                                                                                                                            |