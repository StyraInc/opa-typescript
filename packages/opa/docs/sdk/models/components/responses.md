# Responses


## Supported Types

### `components.SuccessfulPolicyResponseWithStatusCode`

```typescript
const value: components.SuccessfulPolicyResponseWithStatusCode = {
  httpStatusCode: "200",
  result: {
    "allow": true,
    "user_is_admin": true,
    "user_is_granted": [],
  },
};
```

### `components.ServerErrorWithStatusCode`

```typescript
const value: components.ServerErrorWithStatusCode = {
  httpStatusCode: "200",
  code: "<value>",
  message: "<value>",
  decisionId: "b84cf736-213c-4932-a8e4-bb5c648f1b4d",
};
```

