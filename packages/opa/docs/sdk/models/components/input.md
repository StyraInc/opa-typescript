# Input

Arbitrary JSON used within your policies by accessing `input`


## Supported Types

### `boolean`

```typescript
const value: boolean = true;
```

### `string`

```typescript
const value: string = "<value>";
```

### `number`

```typescript
const value: number = 1284.03;
```

### `any[]`

```typescript
const value: any[] = [
  "<value 1>",
  "<value 2>",
  "<value 3>",
];
```

### `{ [k: string]: any }`

```typescript
const value: { [k: string]: any } = {
  "user": "alice",
  "action": "read",
  "object": "id123",
  "type": "dog",
};
```

