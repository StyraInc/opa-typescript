# Development Notes

## Maintenance

For most things, `@styra/opa` (in packages/opa/) is the odd one out: it's our Speakeasy-managed SDK, built from the [OpenAPI spec](https://github.com/StyraInc/enterprise-opa/tree/main/openapi), and generated through the [Generate action](.github/workflows/sdk_generation.yaml).

As such, it's package.json and package-lock.json are *generated*, and not where you would do any changes manually.
For updating dependencies, that means that dependabot PRs are not useful for packages/opa/.
Dependabot PRs that include that package.json file thus need to be **closed**.

To update a dependency of `@styra/opa` that is not part of the SE-managed set, you need to update [.speakeasy/gen.yaml](.speakeasy/gen.yaml)'s `additionalDependencies` field **manually**.
You can do the same to its package.json and package-lock.json, since the next Generate action run will then merely change the ordering etc.
But you can also just trigger another Generate action, either on the branch of your gen.yaml change, or against main when the gen.yaml change has been merged.

For other packages, dependabot should take care of their dependencies.
Dependabot also updates the workflow actions themselves.


## Releasing

All our releases are managed by Changesets and GitHub Workflows, but in different ways:

### `@styra/opa`

The version (in [packages/opa/package.json](packages/opa/package.json)) and changelog ([packages/opa/RELEASES.md](packages/opa/RELEASES.md)) are controlled by the SE Generate action:
When the SDK Generate action noticies any significant changes, it'll open a PR that contains the generated changes, including the version bump **as needed** (determined by SE).

The version bump can be adjusted -- we can decide to release a new major version -- by manually editing [.speakeasy/gen.yaml](.speakeasy/gen.yaml):

> To override the automatic versioning logic for the next generation, set the `version` field in the gen.yaml file.


### Other packages: Changsets

Independent of merged PRs, changesets lets us control what is about to be released in the next version of a package.
To record a changeset for a package, run `npx changeset` in the top-level of the repository.
It will query you about the desired changeset.

> [!WARNING]
> *DO NOT* select `@styra/opa`, as that is managed by SE.

When the "Release" workflow (using Changesets' action) notices that there are active changests, it will open a "Version Packages" PR that contains the relevant changes to the repository.
When you decide that a release is ready, merging that PR will cause
1. the `package.json` to be updated accordingly (major/minor/patch bump)
2. the changesets for each affected package are combined into the package's CHANGELOG.


### Publishing packages and releases

Publishing packages and releases is managed by the Changsets action in the  Generate workflow:

When it finds **no changsets**, it will check npmjs.com for the version we have in the repository, and will publish the packages so that both are in sync.

This process also takes care of publishing our SE-generated `@styra/opa` package: the action notices that the latest version on `main` is newer than what's on NPM, and will publish the package there.

It also takes care of pushing tags to github, in the format `PACKAGE@VERSION`, e.g. `@styra/opa@1.2.2`.

Additional steps have been added over the plain Changesets action to take care of:

1. Publishing `@styra/opa` to https://jsr.io:
   The process is idempotent and just runs for every merge. If the package is present, nothing happens.
2. Publishing a Release for @styra/opa on GitHub:
   This is left as an extra step -- when only using SE, SE would do it; when only using Changesets, Changesets would do it. But in combination, we need to do it ourselves.

**When Changeset finds changes**, the process is **on hold** until those changes are "flushed", i.e. until the "Version Packages" PR is merged.
This also means that `@styra/opa` is **not** published to npmjs.com until the Changeset PR is merged.


## Testing

### `@styra/opa`

For testing, we use NodeJS' builtin test runner, together with testcontainers-node.
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

### Other packages

```shell
npx -w package/$PACKAGE test
# for example
npx -w package/opa-react test
```
