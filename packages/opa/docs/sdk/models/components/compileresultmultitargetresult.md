# CompileResultMultitargetResult

The partially evaluated result of the query in each target dialect.

## Example Usage

```typescript
import { CompileResultMultitargetResult } from "@styra/opa/sdk/models/components";

let value: CompileResultMultitargetResult = {};
```

## Fields

| Field                                                           | Type                                                            | Required                                                        | Description                                                     |
| --------------------------------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------- |
| `targets`                                                       | [components.Targets](../../../sdk/models/components/targets.md) | :heavy_minus_sign:                                              | N/A                                                             |
| `additionalProperties`                                          | Record<string, *any*>                                           | :heavy_minus_sign:                                              | N/A                                                             |