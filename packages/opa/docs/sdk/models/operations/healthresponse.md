# HealthResponse

## Example Usage

```typescript
import { HealthResponse } from "@styra/opa/sdk/models/operations";

let value: HealthResponse = {
    httpMeta: {
        response: new Response('{"message": "hello world"}', {
            headers: { "Content-Type": "application/json" },
        }),
        request: new Request("https://example.com"),
    },
};
```

## Fields

| Field                                                                                                                                                                               | Type                                                                                                                                                                                | Required                                                                                                                                                                            | Description                                                                                                                                                                         |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `httpMeta`                                                                                                                                                                          | [components.HTTPMetadata](../../../sdk/models/components/httpmetadata.md)                                                                                                           | :heavy_check_mark:                                                                                                                                                                  | N/A                                                                                                                                                                                 |
| `healthyServer`                                                                                                                                                                     | [components.HealthyServer](../../../sdk/models/components/healthyserver.md)                                                                                                         | :heavy_minus_sign:                                                                                                                                                                  | OPA service is healthy. If the bundles option is specified then all configured bundles have been activated. If the plugins option is specified then all plugins are in an OK state. |