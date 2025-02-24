# CompileResultUCAST

The partially evaluated result of the query, in UCAST format. Result will be empty if the query is never true.

## Example Usage

```typescript
import { CompileResultUCAST } from "@styra/opa/sdk/models/components";

let value: CompileResultUCAST = {};
```

## Fields

| Field                                                                                             | Type                                                                                              | Required                                                                                          | Description                                                                                       |
| ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `result`                                                                                          | [components.CompileResultUCASTResult](../../../sdk/models/components/compileresultucastresult.md) | :heavy_minus_sign:                                                                                | The partially evaluated result of the query as UCAST.                                             |