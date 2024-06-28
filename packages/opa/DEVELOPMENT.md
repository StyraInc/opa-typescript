# Development Notes

## Releasing

Currently, the workflow for releasing a new version is owned by the Speakeasy
workflow setup.
A new version of @styra/opa is released whenever the PR that the "Generate"
workflow creates is **merged**.
Those PRs are generated when a change to the code generation tooling occurrs,
when the OpenAPI spec changes, or when it's forced through the GitHub Workflow
UI.

To create a release that's not tied to a change in SE or the OpenAPI spec, go
to [this workflow](https://github.com/StyraInc/opa-typescript/actions/workflows/sdk_generation.yaml)
and choose "Run workflow" with branch `main` and **force** enabled.

The Publish workflow that runs after the resulting PR was merged will take care
of:

1. building and pushing the NPM package (secrets are set up in the repo)
2. building and pushing the typedoc docs to gh-pages.

## Testing

For testing, we use NodeJS' builtin test runner together with testcontainers-node.
The tests are defined in a TS file, `tests/authorizer.test.ts`.

Run all tests with

```shell
node --import tsx --test tests/**/*.ts
```

and with testcontainers-node's debug logging:

```shell
DEBUG='testcontainers*' node --import tsx --test tests/**/*.ts
```

Single out a test case by name:

```shell
node --import tsx --test-name-pattern="can be called with input==false"  --test tests/**/*.ts
```
