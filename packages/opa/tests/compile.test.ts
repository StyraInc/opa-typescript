import { describe, before, after, it } from "node:test";
import assert from "node:assert";
import { GenericContainer, StartedTestContainer, Wait } from "testcontainers";

import { Filters, OPAClient } from "../src";
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
include if input.fruits.colour in input.fav_colours
include if {
  not input.fav_colours
  endswith(input.fruits.name, "apple")
}
`,
    filters_sans_metadata: `package filters_no_md
include if input.fruits.colour in input.fav_colours
include if {
  not input.fav_colours
  endswith(input.fruits.name, "apple")
}
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
          "ghcr.io/styrainc/enterprise-opa:1.37.0",
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
            assert.equal(masks, undefined);
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
            assert.equal(masks, undefined);
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
            assert.equal(masks, undefined);
            assert.equal(query, "WHERE F.C IN (E'red', E'green')");
          });

          it("returns ucast-prisma (with input)", async () => {
            const res = await new OPAClient(serverURL).getFilters(
              "filters/include",
              { fav_colours: ["red", "green"] },
              {
                target: "ucastPrisma",
              },
            );
            const { query, masks } = res as Filters;
            assert.equal(masks, undefined);
            assert.deepEqual(query, {
              field: "fruits.colour",
              operator: "in",
              type: "field",
              value: ["red", "green"],
            });
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
              },
              ucast: {
                query: {
                  field: "fruits.colour",
                  operator: "in",
                  type: "field",
                  value: ["red", "green"],
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
              },
              mysql: {
                query: "WHERE fruits_mysql.colour_mysql IN ('red', 'green')",
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
