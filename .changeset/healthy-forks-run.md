---
"@styra/opa-react": minor
---

Let `useAuthz` handle multiple queries at once

If you don't know the number of evaluations you need, or if you want to do evaluations in a loop, you cannot do that with the "single-decision" `useAuthz` call.

So now, you can provide an array of evaluation queries,
```ts
{
    path?: string;
    input?: Input;
    fromResult?: (_?: Result) => boolean;
  }[],
```
instead, and you'll get a `UseAuthzResult<T>[]` in return.
