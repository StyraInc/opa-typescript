# Development Notes

## Releasing

> [!WARNING] "Releasing" is in flux right now, and will be updated when the dust has settled.

## Testing

For testing, we use NodeJS' builtin test runner together with testcontainers-node.
The tests are defined in a TS file, `tests/authorizer.test.ts`.

Run all tests with

```shell
npx tsx --test tests/**/*.ts
```

and with testcontainers-node's debug logging:

```shell
DEBUG='testcontainers*' npx tsx --test tests/**/*.ts
```

Single out a test case by name:

```shell
npx tsx --test-name-pattern="can be called with input==false"  --test tests/**/*.ts
```
