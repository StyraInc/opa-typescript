# CompileResultJSONResult

The partially evaluated result of the query.

## Example Usage

```typescript
import { CompileResultJSONResult } from "@styra/opa/sdk/models/components";

let value: CompileResultJSONResult = {};
```

## Fields

| Field                                                           | Type                                                            | Required                                                        | Description                                                     |
| --------------------------------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------- |
| `query`                                                         | [components.Query](../../../sdk/models/components/query.md)     | :heavy_minus_sign:                                              | N/A                                                             |
| `support`                                                       | [components.Support](../../../sdk/models/components/support.md) | :heavy_minus_sign:                                              | N/A                                                             |
| `additionalProperties`                                          | Record<string, *any*>                                           | :heavy_minus_sign:                                              | N/A                                                             |