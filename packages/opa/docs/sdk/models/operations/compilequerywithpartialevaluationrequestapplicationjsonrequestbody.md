# CompileQueryWithPartialEvaluationRequestApplicationJSONRequestBody

The query, input, and other settings for partial evaluation.

## Example Usage

```typescript
import { CompileQueryWithPartialEvaluationRequestApplicationJSONRequestBody } from "@styra/opa/sdk/models/operations";

let value: CompileQueryWithPartialEvaluationRequestApplicationJSONRequestBody =
  {
    input: false,
  };
```

## Fields

| Field                                                                                                                                                              | Type                                                                                                                                                               | Required                                                                                                                                                           | Description                                                                                                                                                        |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `options`                                                                                                                                                          | [components.CompileOptions](../../../sdk/models/components/compileoptions.md)                                                                                      | :heavy_minus_sign:                                                                                                                                                 | Additional options to use during partial evaluation. Only the disableInlining option is currently supported in OPA. Enterprise OPA may support additional options. |
| `unknowns`                                                                                                                                                         | *string*[]                                                                                                                                                         | :heavy_minus_sign:                                                                                                                                                 | The terms to treat as unknown during partial evaluation.                                                                                                           |
| `input`                                                                                                                                                            | *components.Input*                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                 | Arbitrary JSON used within your policies by accessing `input`                                                                                                      |