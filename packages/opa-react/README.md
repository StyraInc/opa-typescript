# @styra/opa-react

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![NPM Version](https://img.shields.io/npm/v/%40styra%2Fopa-react?style=flat&color=%2324b6e0)](https://www.npmjs.com/package/@styra/opa-react)

This package contains helpers for using [@styra/opa](https://www.npmjs.com/package/@styra/opa) from React.

The package provides an `useAuthz` hook and a high-level `<Authz>` component.

They are enabled by wrapping your App into `<AuthzProvider>`:

```tsx
<AuthzProvider sdk={sdk} path="policy" defaultInput={{ user, tenant }}>
  <Nav />
  <Outlet />
</AuthzProvider>
```

This example provides a previously-configured `sdk` instance (`OPAClient` from `@styra/opa`), a request path, and default input (which is merged with per-call inputs).

They can either be used with a function as child:
```tsx
<Authz path={path} input={input} loading={<div>loading</div>}>
  {(result) => <button disabled={!result}>Press Here</button>}
</Authz>
```

Or by providing static children (`<button>Press Here</button>`) and optionally `fallback` JSX elements:
```tsx
<Authz path={path} input={input} fallback={<div>unauthorized</div>}>
  <button>Press Here</button>
</Authz>
```

The `useAuthz` hook can be used if you need more low-level control about the authorization call.
