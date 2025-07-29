# @styra/opa-react

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![NPM Version](https://img.shields.io/npm/v/%40styra%2Fopa-react?style=flat&color=%2324b6e0)](https://www.npmjs.com/package/@styra/opa-react)

This package contains helpers for using [@styra/opa](https://www.npmjs.com/package/@styra/opa) from React.

## Features

* High-level, declarative components for embedding authorization decisions in your frontend code.
* Built-in caching, deduplication, and state management based on `@tanstack/react-query`.
* Optional **request batching** for backends that support it (Enterprise OPA, or your own implementation of the Batch API).

## Installation

### npm

```shell
npm install @styra/opa-react
```

### yarn

```shell
yarn add @styra/opa-react
```

## Scaffolding: `<AuthzProvider>`

To be able to use the `<Authz>` component and `useAuthz` hook, the application needs to be able to access the `AuthzContext`.
The simplest way to make that happen is to wrap your `<App>` into `<AuthzProvider>`.

Add these imports to the file that defines your `App` function:

```js
import { AuthzProvider } from "@styra/opa-react";
import { OPAClient } from "@styra/opa";
```

Then instantiate an `OPAClient` that is able to reach your OPA server, and pass that along to `<AuthzProvider>`:

```jsx
const serverURL = "https://opa.internal";

export default function App() {
  const [opaClient] = useState(() => new OPAClient(serverURL));

  // other initialization logic

  return (
    <AuthzProvider opaClient={opaClient}>
      { /* your application JSX elements */ }
    </AuthzProvider>
  );
```

> [!NOTE]
> See [the API docs](https://styrainc.github.io/opa-typescript/interfaces/_styra_opa_react.AuthzProviderProps.html) for all supported properties of `AuthzProvider`. Only `opaClient` is mandatory.

If your OPA instance is reverse-proxied with a prefix of `/opa/` instead, you can use `window.location` to configure the `OPAClient`:

```js
const [opaClient] = useState(() => {
  const href = window.location.toString();
  const u = new URL(href);
  u.pathname = "opa"; // if /opa/* is reverse-proxied to your OPA service
  u.search = "";
  return new OPAClient(u.toString())
});
```

To provide a user-specific header, let's say from your frontend's authentication machinery, you could do this:

```js
const { user, tenant } = useAuthn(); // assuming there's some hook for authentication

const [opaClient] = useState(() => {
  return new OPAClient(serverURL, {
    headers: {
      "X-Tenant": tenant,
      "X-User": user,
    },
  });
}, [user, tenant]);
```

## Controlling UI elements

The `<Authz>` component provides a high-level approach to letting your UI react to policy evaluation results.

For example, to disable a button based on the outcome of a policy evaluation of `data.things.allow` with input `{"action": "delete", "resource": "thing"}`, you would add this to your JSX:

```jsx
<Authz
  path="things/allow"
  input={{ action: "delete", resource: "thing" }}
  fallback={
    <button disabled={true}>Delete Thing</button>
  }
>
  <button>Delete Thing</button>
</Authz>
```

> [!NOTE]
> See [the API docs](https://styrainc.github.io/opa-typescript/types/_styra_opa_react.AuthzProps.html) for all supported properties of `Authz`:
>
> * `loading` allows you to control what's rendered while still waiting for a result.
> * `path` and `fromResult` can fall back to `defaultPath` and `defaultFromResult` of `AuthzProvider` respectively, and
> * `input` can be merged with the `defaultInput` of `AuthzProvider`.

## Full control: `useAuthz` hook

`<Authz>` is a convenience-wrapper around the `useAuthz` hook.
If it is insufficient for your use case, you can reach to `useAuthz` for more control.

### Avoid repetition of controlled UI elements in code

In the example above, we had to define `<button>` twice: once for when the user is authorized, and as `fallback` when they are not.
We can avoid this by using `useAuthz`:

```jsx
export default function MyComponent() {
  const { result: allowed, isLoading } = useAuthz("things/allow", {
    action: "delete",
    resource: "thing",
  });

  if (isLoading) return <div>Loading...</div>;

  return <button disabled={!allowed}>Delete Thing</button>;
}
```

## Community

For questions, discussions and announcements related to Styra products, services and open source projects, please join
the Styra community on [Slack](https://communityinviter.com/apps/styracommunity/signup)!
