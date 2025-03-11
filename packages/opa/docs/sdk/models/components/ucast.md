# Ucast

## Example Usage

```typescript
import { Ucast } from "@styra/opa/sdk/models/components";

let value: Ucast = {};
```

## Fields

| Field                                                                                                              | Type                                                                                                               | Required                                                                                                           | Description                                                                                                        |
| ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| `query`                                                                                                            | [components.CompileResultMultitargetQuery](../../../sdk/models/components/compileresultmultitargetquery.md)        | :heavy_minus_sign:                                                                                                 | UCAST JSON object describing the conditions under which the query is true.                                         |
| `masks`                                                                                                            | Record<string, *components.MaskingRule*>                                                                           | :heavy_minus_sign:                                                                                                 | Column masking functions, where the key is the column name, and the value describes which masking function to use. |