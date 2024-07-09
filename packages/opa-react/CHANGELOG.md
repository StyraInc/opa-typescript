# @styra/opa-react

## 0.4.0

### Minor Changes

- b12fd17: build: switch to tshy for (dual) build
- 0caf161: add evaluateBatch to SDK interface

  So when retrieving the AuthzProvider's `sdk` instance, you can call `evaluateBatch` on it, and TypeScript will be happy.

- 2217054: expose AuthzContext

  The prepared `sdk` instance of `AuthzProvider` can now be retrieved
  from any components wrapped into `AuthzProvider`. For example:

  ```tsx
  import { AuthzContext } from "@styra/opa-react";

  export default function Component() {
    const { sdk } = useContext(AuthzContext);
    // now you can use `sdk.evaluate()` etc directly
  }
  ```

## 0.3.2

### Patch Changes

- 5bf10a5: tweak package (publint)

  1. remove test files from package
  2. package.json: move "browser" field to "exports"

## 0.3.1

### Patch Changes

- be7bcb5: `AuthzProviderContext` is a type now (was interface)

  This was done to remove code duplication. No functional changes. But since the
  interface was exported before, some care might have to be taken when updating.

## 0.3.0

### Minor Changes

- d2b2abc: Add `fromResults` to support unwrapping policy evaluation results

  This allows us to unwrap results returned from OPA to turn them into a boolean.

  Previously, anything different from undefined and false was taken to mean "authorized". Now, we can work with policy evaluation results like

  ```json
  {
    "result": false,
    "details": "..."
  }
  ```

  by providing a `fromResults` function like

  ```ts
  const fromResults = (r?: Result): boolean =>
    ((r as Record<string, any>)["foobar"] as boolean) ?? false;
  ```

  As with input and path, this can (optionally) be set with `<AuthzProvider>` (property `defaultFromResults`), and with `<Authz>` (property `fromResult`), or passed to `useAuthz()`.

## 0.2.1

### Patch Changes

- 6365272: Update README for v0.2.0 change

## 0.2.0

### Minor Changes

- aa75275: Remove function support from <Authz> component

  Allowing a function had unintended consequences for performance, given how
  React works. Now, there is only one way to do it: `fallback` for non-truthy
  results, and `children` for truthy results.

## 0.1.0

### Minor Changes

- f7eab9c: Remove default export: It seems simpler to only rely on the three exports we have:

  1. `import { AuthzProvider } from "@styra/opa-react";`
  2. `import { Authz } from "@styra/opa-react";`
  3. `import { useAuthz } from "@styra/opa-react";`

  (Besides types and interfaces.)

## 0.0.4

### Patch Changes

- 906a90c: build packages when publishing

## 0.0.3

### Patch Changes

- 770d833: fix dist/ missing in package

## 0.0.2

### Patch Changes

- ab7c009: Fix package.json (add "browser" next to "main")

  Before, create-react-app (or webpack, rather) failed to resolve @styra/opa-react.

## 0.0.1

### Patch Changes

- 0e74573: Initial Release
