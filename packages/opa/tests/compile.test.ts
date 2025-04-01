import { describe, before, after, it } from "node:test";
import assert from "node:assert";
import { GenericContainer, StartedTestContainer, Wait } from "testcontainers";

import { Filters, OPAClient, PrismaMask } from "../src";
import { OpaApiClientCore } from "../src/core.js";
import { compileQueryWithPartialEvaluation } from "../src/funcs/compileQueryWithPartialEvaluation.js";
import { CompileQueryWithPartialEvaluationAcceptEnum } from "../src/funcs/compileQueryWithPartialEvaluation.js";

describe("compile-api", async () => {
  const policies = {
    filters: `package filters
# METADATA
# scope: document
# custom:
#   unknowns: [input.fruits]
#   mask_rule: data.filters.mask
include if input.fruits.colour in input.fav_colours
include if {
  not input.fav_colours
  endswith(input.fruits.name, "apple")
}

mask.fruits.owner.replace.value := "***"
`,
    filters_sans_metadata: `package filters_no_md
include if input.fruits.colour in input.fav_colours
include if {
  not input.fav_colours
  endswith(input.fruits.name, "apple")
}
`,
    filters_extra_masks: `package filters_extra_masks
# METADATA
# scope: document
# custom:
#   unknowns: [input.fruits]
#   mask_rule: data.filters_extra_masks.mask
include if input.fruits.colour in input.fav_colours
include if {
  not input.fav_colours
  endswith(input.fruits.name, "apple")
}

mask.fruits.price.replace.value := 0
mask.owner.phone.replace.value := "000-000"
`,
  };

  describe(
    "with eopa",
    {
      // Skip these tests when there's no license env var (like dependabot PRs)
      skip: !process.env["EOPA_LICENSE_KEY"],
    },
    () => {
      let container: StartedTestContainer;
      let serverURL: string;

      after(async () => {
        await container.stop();
      });

      before(async () => {
        const opa = await prepareOPA(
          "ghcr.io/styrainc/enterprise-opa:edge",
          policies,
        );
        container = opa.container;
        serverURL = opa.serverURL;
      });

      describe("porcelain", () => {
        describe("single-target", () => {
          it("returns postgresql (with input)", async () => {
            const res = await new OPAClient(serverURL).getFilters(
              "filters/include",
              { fav_colours: ["red", "green"] },
              {
                target: "postgresql",
              },
            );
            const { query, masks } = res as Filters;
            assert.deepStrictEqual(masks, {
              fruits: { owner: { replace: { value: "***" } } },
            });
            assert.equal(query, "WHERE fruits.colour IN (E'red', E'green')");
          });

          it("returns postgresql (without input)", async () => {
            const res = await new OPAClient(serverURL).getFilters(
              "filters/include",
              undefined,
              {
                target: "postgresql",
              },
            );
            const { query, masks } = res as Filters;
            assert.deepStrictEqual(masks, {
              fruits: { owner: { replace: { value: "***" } } },
            });
            assert.equal(query, "WHERE fruits.name LIKE E'%apple'");
          });

          it("returns postgresql (with unknowns)", async () => {
            const res = await new OPAClient(serverURL).getFilters(
              "filters_no_md/include",
              { fav_colours: ["red", "green"] },
              {
                target: "postgresql",
                unknowns: ["input.fruits"],
              },
            );
            const { query, masks } = res as Filters;
            assert.equal(masks, undefined);
            assert.equal(query, "WHERE fruits.colour IN (E'red', E'green')");
          });

          it("returns postgresql (with mappings)", async () => {
            const res = await new OPAClient(serverURL).getFilters(
              "filters/include",
              { fav_colours: ["red", "green"] },
              {
                target: "postgresql",
                tableMappings: {
                  fruits: { $self: "F", colour: "C" },
                },
              },
            );
            const { query, masks } = res as Filters;
            assert.deepStrictEqual(masks, {
              fruits: { owner: { replace: { value: "***" } } },
            });
            assert.equal(query, "WHERE F.C IN (E'red', E'green')");
          });

          it("returns ucast-prisma (with input)", async () => {
            const res = await new OPAClient(serverURL).getFilters(
              "filters/include",
              { fav_colours: ["red", "green"] },
              {
                target: "ucastPrisma",
                ucastPrisma: {
                  primary: "fruits",
                },
              },
            );
            const { query, masks, mask } = res as Filters & PrismaMask;
            assert.notEqual(mask, undefined);
            assert.deepStrictEqual(masks, {
              fruits: { owner: { replace: { value: "***" } } },
            });
            assert.deepEqual(query, {
              colour: {
                in: ["red", "green"],
              },
            });

            // assert that the mask function is a noop here
            const fruit = { id: 1, colour: "red", name: "apple" };
            assert.deepEqual(fruit, mask(fruit));
          });

          it("returns ucast-prisma (without target)", async () => {
            const res = await new OPAClient(serverURL).getFilters(
              "filters/include",
              { fav_colours: ["red", "green"] },
              {
                ucastPrisma: {
                  primary: "fruits",
                },
              },
            );
            const { query, masks, mask } = res as Filters & PrismaMask;
            assert.deepStrictEqual(masks, {
              fruits: { owner: { replace: { value: "***" } } },
            });
            assert.notEqual(mask, undefined);
            assert.deepEqual(query, {
              colour: {
                in: ["red", "green"],
              },
            });
          });

          it("returns ucast-prisma (only with primary)", async () => {
            const res = await new OPAClient(serverURL).getFilters(
              "filters/include",
              { fav_colours: ["red", "green"] },
              "fruits",
            );
            const { query, masks, mask } = res as Filters & PrismaMask;
            assert.deepStrictEqual(masks, {
              fruits: { owner: { replace: { value: "***" } } },
            });
            assert.notEqual(mask, undefined);
            assert.deepEqual(query, {
              colour: {
                in: ["red", "green"],
              },
            });
          });

          it("returns ucast-prisma and supports direct and related masks", async () => {
            const res = await new OPAClient(serverURL).getFilters(
              "filters_extra_masks/include",
              { fav_colours: ["red", "green"] },
              "fruits",
            );
            const { masks, mask } = res as Filters & PrismaMask;
            assert.deepStrictEqual(masks, {
              fruits: { price: { replace: { value: 0 } } },
              owner: { phone: { replace: { value: "000-000" } } },
            });

            const fruit = {
              id: 1,
              name: "Apple",
              colour: "red",
              price: 100,
              owner: {
                name: "Jane",
                phone: "123",
              },
            };
            assert.deepEqual(
              {
                ...fruit,
                price: 0,
                owner: { ...fruit.owner, phone: "000-000" },
              },
              mask(fruit),
            );
          });
        });

        describe("multi-target", () => {
          it("returns postgresql (with input)", async () => {
            const res = await new OPAClient(serverURL).getMultipleFilters(
              "filters/include",
              { fav_colours: ["red", "green"] },
              {
                targets: ["ucastPrisma", "postgresql"],
              },
            );
            assert.deepStrictEqual(res, {
              postgresql: {
                query: "WHERE fruits.colour IN (E'red', E'green')",
                masks: {
                  fruits: { owner: { replace: { value: "***" } } },
                },
              },
              ucast: {
                query: {
                  field: "fruits.colour",
                  operator: "in",
                  type: "field",
                  value: ["red", "green"],
                },
                masks: {
                  fruits: { owner: { replace: { value: "***" } } },
                },
              },
            });
          });

          it("supports mappings, too", async () => {
            const res = await new OPAClient(serverURL).getMultipleFilters(
              "filters/include",
              { fav_colours: ["red", "green"] },
              {
                targets: ["mysql", "postgresql"],
                tableMappings: {
                  postgresql: {
                    fruits: { $self: "fruits_pg", colour: "colour_pg" },
                  },
                  mysql: {
                    fruits: { $self: "fruits_mysql", colour: "colour_mysql" },
                  },
                },
              },
            );
            assert.deepStrictEqual(res, {
              postgresql: {
                query: "WHERE fruits_pg.colour_pg IN (E'red', E'green')",
                masks: {
                  fruits: { owner: { replace: { value: "***" } } },
                },
              },
              mysql: {
                query: "WHERE fruits_mysql.colour_mysql IN ('red', 'green')",
                masks: {
                  fruits: { owner: { replace: { value: "***" } } },
                },
              },
            });
          });
        });
      });

      describe("low-level", () => {
        describe("single-target", () => {
          it("returns postgresql when requested", async () => {
            const client = new OpaApiClientCore({
              serverURL,
            });
            const res = await compileQueryWithPartialEvaluation(
              client,
              {
                requestBody: {
                  query: "data.filters.include",
                  input: { fav_colours: ["red", "green"] },
                },
              },
              {
                acceptHeaderOverride:
                  CompileQueryWithPartialEvaluationAcceptEnum.applicationVndStyraSqlPostgresqlPlusJson,
              },
            );
            if (!res.ok) {
              throw res.error;
            }
            const result = res?.value?.compileResultSQL?.result;
            assert.deepEqual(result, {
              query: "WHERE fruits.colour IN (E'red', E'green')",
              masks: {
                fruits: { owner: { replace: { value: "***" } } },
              },
            });
          });
        });
      });
    },
  );
});

// NOTE(sr): prepareOPA here is simpler: we don't need system authz stuff.
async function prepareOPA(
  img: string,
  policies: { [k: string]: string },
): Promise<{
  serverURL: string;
  container: StartedTestContainer;
}> {
  const container = await new GenericContainer(img)
    .withCommand([
      "run",
      "--server",
      "--addr=0.0.0.0:8181",
      "--disable-telemetry",
      "--log-level=debug",
      "--set=decision_logs.console=true",
    ])
    .withEnvironment({
      EOPA_LICENSE_KEY: process.env["EOPA_LICENSE_KEY"] ?? "",
    })
    .withExposedPorts(8181)
    .withWaitStrategy(Wait.forHttp("/health", 8181).forStatusCode(200))
    .start();
  const serverURL = `http://${container.getHost()}:${container.getMappedPort(8181)}`;

  for (const [id, body] of Object.entries(policies)) {
    const response = await fetch(serverURL + "/v1/policies/" + id, {
      method: "PUT",
      headers: { "Content-Type": "text/plain" },
      body,
    });
    assert.ok(response.ok);
  }

  return {
    container,
    serverURL,
  };
}
