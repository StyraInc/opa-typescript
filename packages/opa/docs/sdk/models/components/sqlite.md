# Sqlite

## Example Usage

```typescript
import { Sqlite } from "@styra/opa/sdk/models/components";

let value: Sqlite = {};
```

## Fields

| Field                                                                                                                                                      | Type                                                                                                                                                       | Required                                                                                                                                                   | Description                                                                                                                                                |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `query`                                                                                                                                                    | *string*                                                                                                                                                   | :heavy_minus_sign:                                                                                                                                         | String representing the SQL equivalent of the conditions under which the query is true                                                                     |
| `masks`                                                                                                                                                    | Record<string, Record<string, *components.MaskingRule*>>                                                                                                   | :heavy_minus_sign:                                                                                                                                         | Column masking rules, where the first two nested keys represent the table name and the column name, and the value describes which masking function to use. |