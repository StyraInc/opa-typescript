# Ucast

## Example Usage

```typescript
import { Ucast } from "@styra/opa/sdk/models/components";

let value: Ucast = {};
```

## Fields

| Field                                                                                                                                                         | Type                                                                                                                                                          | Required                                                                                                                                                      | Description                                                                                                                                                   |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `query`                                                                                                                                                       | [components.CompileResultMultitargetQuery](../../../sdk/models/components/compileresultmultitargetquery.md)                                                   | :heavy_minus_sign:                                                                                                                                            | UCAST JSON object describing the conditions under which the query is true.                                                                                    |
| `masks`                                                                                                                                                       | Record<string, Record<string, *components.MaskingRule*>>                                                                                                      | :heavy_minus_sign:                                                                                                                                            | Column masking rules, where the first two nested keys represent the entity name and the property name, and the value describes which masking function to use. |