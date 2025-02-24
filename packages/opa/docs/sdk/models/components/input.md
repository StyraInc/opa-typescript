# Input

Arbitrary JSON used within your policies by accessing `input`


## Supported Types

### `boolean`

```typescript
const value: boolean = false;
```

### `string`

```typescript
const value: string = "<value>";
```

### `number`

```typescript
const value: number = 8326.2;
```

### `any[]`

```typescript
const value: any[] = [
  "<value>",
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

