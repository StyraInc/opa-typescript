# CompileResultMultitargetSqlite

## Example Usage

```typescript
import { CompileResultMultitargetSqlite } from "@styra/opa/sdk/models/components";

let value: CompileResultMultitargetSqlite = {};
```

## Fields

| Field                                                                                                              | Type                                                                                                               | Required                                                                                                           | Description                                                                                                        |
| ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| `query`                                                                                                            | *string*                                                                                                           | :heavy_minus_sign:                                                                                                 | String representing the SQL equivalent of the conditions under which the query is true                             |
| `masks`                                                                                                            | Record<string, *components.MaskingRule*>                                                                           | :heavy_minus_sign:                                                                                                 | Column masking functions, where the key is the column name, and the value describes which masking function to use. |