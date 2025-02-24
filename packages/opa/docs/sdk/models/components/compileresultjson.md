# CompileResultJSON

The partially evaluated result of the query. Result will be empty if the query is never true.

## Example Usage

```typescript
import { CompileResultJSON } from "@styra/opa/sdk/models/components";

let value: CompileResultJSON = {};
```

## Fields

| Field                                                                                           | Type                                                                                            | Required                                                                                        | Description                                                                                     |
| ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `result`                                                                                        | [components.CompileResultJSONResult](../../../sdk/models/components/compileresultjsonresult.md) | :heavy_minus_sign:                                                                              | The partially evaluated result of the query.                                                    |