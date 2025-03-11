# CompileResultUCASTResult

The partially evaluated result of the query as UCAST.

## Example Usage

```typescript
import { CompileResultUCASTResult } from "@styra/opa/sdk/models/components";

let value: CompileResultUCASTResult = {};
```

## Fields

| Field                                                                                                          | Type                                                                                                           | Required                                                                                                       | Description                                                                                                    |
| -------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `query`                                                                                                        | [components.CompileResultUCASTQuery](../../../sdk/models/components/compileresultucastquery.md)                | :heavy_minus_sign:                                                                                             | UCAST JSON object describing the conditions under which the query is true.                                     |
| `masks`                                                                                                        | Record<string, *components.MaskingRule*>                                                                       | :heavy_minus_sign:                                                                                             | Column masking rules, where the key is the column name, and the value describes which masking function to use. |
| `additionalProperties`                                                                                         | Record<string, *any*>                                                                                          | :heavy_minus_sign:                                                                                             | N/A                                                                                                            |