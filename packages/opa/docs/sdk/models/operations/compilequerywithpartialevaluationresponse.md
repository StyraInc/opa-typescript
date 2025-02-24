# CompileQueryWithPartialEvaluationResponse

## Example Usage

```typescript
import { CompileQueryWithPartialEvaluationResponse } from "@styra/opa/sdk/models/operations";

let value: CompileQueryWithPartialEvaluationResponse = {
  httpMeta: {
    response: new Response("{\"message\": \"hello world\"}", {
      headers: { "Content-Type": "application/json" },
    }),
    request: new Request("https://example.com"),
  },
};
```

## Fields

| Field                                                                                             | Type                                                                                              | Required                                                                                          | Description                                                                                       |
| ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `httpMeta`                                                                                        | [components.HTTPMetadata](../../../sdk/models/components/httpmetadata.md)                         | :heavy_check_mark:                                                                                | N/A                                                                                               |
| `compileResultJSON`                                                                               | [components.CompileResultJSON](../../../sdk/models/components/compileresultjson.md)               | :heavy_minus_sign:                                                                                | Successful response                                                                               |
| `compileResultMultitarget`                                                                        | [components.CompileResultMultitarget](../../../sdk/models/components/compileresultmultitarget.md) | :heavy_minus_sign:                                                                                | Successful response                                                                               |
| `compileResultUCAST`                                                                              | [components.CompileResultUCAST](../../../sdk/models/components/compileresultucast.md)             | :heavy_minus_sign:                                                                                | Successful response                                                                               |
| `compileResultSQL`                                                                                | [components.CompileResultSQL](../../../sdk/models/components/compileresultsql.md)                 | :heavy_minus_sign:                                                                                | Successful response                                                                               |