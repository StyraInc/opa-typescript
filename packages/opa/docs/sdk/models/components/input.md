# Input

Arbitrary JSON used within your policies by accessing `input`

## Example Usage

```typescript
import { Input } from "@styra/opa/sdk/models/components";

let value: Input = {
    user: "alice",
    action: "read",
    object: "id123",
    type: "dog",
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

