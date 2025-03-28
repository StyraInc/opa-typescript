# CompileOptions

Additional options to use during partial evaluation. Only the disableInlining option is currently supported in OPA. Enterprise OPA may support additional options.

## Example Usage

```typescript
import { CompileOptions } from "@styra/opa/sdk/models/components";

let value: CompileOptions = {};
```

## Fields

| Field                                                                                         | Type                                                                                          | Required                                                                                      | Description                                                                                   |
| --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `disableInlining`                                                                             | *string*[]                                                                                    | :heavy_minus_sign:                                                                            | A list of paths to exclude from partial evaluation inlining.                                  |
| `targetDialects`                                                                              | [components.TargetDialects](../../../sdk/models/components/targetdialects.md)[]               | :heavy_minus_sign:                                                                            | The output targets for partial evaluation. Different targets will have different constraints. |
| `targetSQLTableMappings`                                                                      | [components.TargetSQLTableMappings](../../../sdk/models/components/targetsqltablemappings.md) | :heavy_minus_sign:                                                                            | N/A                                                                                           |