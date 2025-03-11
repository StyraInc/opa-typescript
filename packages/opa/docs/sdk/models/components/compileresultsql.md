# CompileResultSQL

The partially evaluated result of the query, in SQL format. Result will be empty if the query is never true.

## Example Usage

```typescript
import { CompileResultSQL } from "@styra/opa/sdk/models/components";

let value: CompileResultSQL = {};
```

## Fields

| Field                                                                                         | Type                                                                                          | Required                                                                                      | Description                                                                                   |
| --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `result`                                                                                      | [components.CompileResultSQLResult](../../../sdk/models/components/compileresultsqlresult.md) | :heavy_minus_sign:                                                                            | The partially evaluated result of the query as SQL.                                           |