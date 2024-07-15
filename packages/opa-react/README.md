# @styra/opa-react

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![NPM Version](https://img.shields.io/npm/v/%40styra%2Fopa-react?style=flat&color=%2324b6e0)](https://www.npmjs.com/package/@styra/opa-react)

This package contains helpers for using [@styra/opa](https://www.npmjs.com/package/@styra/opa) from React.

## Features

* High-level, declarative components for embedding authorization decisions in your frontend code.
* Built-in caching, deduplication, and state management based on `@tanstack/react-query`.
* Optional **request batching** for backends that support it (Enterprise OPA, or your own implementation of the Batch API).

## Details

The package provides an `useAuthz` hook and a high-level `<Authz>` component.

They are enabled by wrapping your App into `<AuthzProvider>`:

```tsx
<AuthzProvider opaClient={opaClient} defaultPath="policy" defaultInput={{ user, tenant }}>
  <Nav />
  <Outlet />
</AuthzProvider>
```

This example provides a previously-configured `opaClient` instance (`OPAClient` from `@styra/opa`), a request path, and default input (which is merged with per-call inputs).

They can either be used by providing static children (`<button>Press Here</button>`) and optionally `fallback` and `loading` JSX elements:
```tsx
<Authz
  path={path}
  input={input}
  loading={<div>...</div>}
  fallback={<button disabled={true}>Press Here</button>}>
  <button>Press Here</button>
</Authz>
```

The `useAuthz` hook can be used if you need more low-level control about the authorization call.
Furthermore, you can retrieve the prepared `sdk` instance of `AuthzProvider` for even more control, if need be:

```tsx
import { AuthzContext } from "@styra/opa-react";

export default function Component() {
  const { sdk } = useContext(AuthzContext);
  // now you can use `sdk.evaluate()` etc directly
}
```


## Community

For questions, discussions and announcements related to Styra products, services and open source projects, please join
the Styra community on [Slack](https://communityinviter.com/apps/styracommunity/signup)!
