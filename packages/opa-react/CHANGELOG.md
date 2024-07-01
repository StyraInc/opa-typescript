# @styra/opa-react

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
