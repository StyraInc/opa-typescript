# CompileResultMultitarget

The partially evaluated result of the query, for each target dialect. Result will be empty if the query is never true.

## Example Usage

```typescript
import { CompileResultMultitarget } from "@styra/opa/sdk/models/components";

let value: CompileResultMultitarget = {};
```

## Fields

| Field                                                                                                         | Type                                                                                                          | Required                                                                                                      | Description                                                                                                   |
| ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `result`                                                                                                      | [components.CompileResultMultitargetResult](../../../sdk/models/components/compileresultmultitargetresult.md) | :heavy_minus_sign:                                                                                            | The partially evaluated result of the query in each target dialect.                                           |