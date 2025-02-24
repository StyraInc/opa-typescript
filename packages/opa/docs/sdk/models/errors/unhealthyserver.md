# UnhealthyServer

OPA service is not healthy. If the bundles option is specified this can mean any of the configured bundles have not yet been activated. If the plugins option is specified then at least one plugin is in a non-OK state.

## Example Usage

```typescript
import { UnhealthyServer } from "@styra/opa/sdk/models/errors";

// No examples available for this model
```

## Fields

| Field              | Type               | Required           | Description        |
| ------------------ | ------------------ | ------------------ | ------------------ |
| `code`             | *string*           | :heavy_check_mark: | N/A                |
| `error`            | *string*           | :heavy_minus_sign: | N/A                |
| `message`          | *string*           | :heavy_minus_sign: | N/A                |