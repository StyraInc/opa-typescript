# Result

The base or virtual document referred to by the URL path. If the path is undefined, this key will be omitted.

## Example Usage

```typescript
import { Result } from "@styra/opa/sdk/models/components";

let value: Result = {
  "allow": true,
  "user_is_admin": true,
  "user_is_granted": [
    "<value>",
  ],
};
```

## Supported Types

### `boolean`

```typescript
const value: boolean = /* values here */
```

### `string`

```typescript
const value: string = /* values here */
```

### `number`

```typescript
const value: number = /* values here */
```

### `any[]`

```typescript
const value: any[] = /* values here */
```

### `{ [k: string]: any }`

```typescript
const value: { [k: string]: any } = /* values here */
```

