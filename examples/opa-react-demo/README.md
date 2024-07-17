# `@styra/opa-react` Demos

This React application is show-casing specific features of `@styra/opa-react`.

Currently, it includes a demo of batching requests when used with [Enterprise OPA](https://docs.styra.com/enterprise-opa), or a custom implemetation of its [Batch API](https://docs.styra.com/enterprise-opa/reference/api-reference/batch-api).


## How to use

1. Download and start Enterprise OPA with the `policies` loaded: `eopa run --log-level debug --server policies/`
2. Start the app: `npm install && npm run start`
3. Go to http://127.0.0.1:3000


## Note on using OPA

You can use the demo apps with OPA. The only thing that won't work is enabling batching.
