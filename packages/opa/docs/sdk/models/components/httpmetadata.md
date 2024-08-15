# HTTPMetadata

## Example Usage

```typescript
import { HTTPMetadata } from "@styra/opa/sdk/models/components";

let value: HTTPMetadata = {
    response: new Response('{"message": "hello world"}', {
        headers: { "Content-Type": "application/json" },
    }),
    request: new Request("https://example.com"),
};
```

## Fields

| Field                                                                 | Type                                                                  | Required                                                              | Description                                                           |
| --------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `response`                                                            | [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) | :heavy_check_mark:                                                    | Raw HTTP response; suitable for custom response parsing               |
| `request`                                                             | *Request*                                                             | :heavy_check_mark:                                                    | Raw HTTP request; suitable for debugging                              |