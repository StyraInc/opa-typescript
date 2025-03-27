import { describe, before, after, it } from "node:test";
import assert from "node:assert";
import { GenericContainer, StartedTestContainer, Wait } from "testcontainers";

import { FilterCompileTargetsEnum, Filters, OPAClient } from "../src";
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
                target: FilterCompileTargetsEnum.postgresql,
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
                target: FilterCompileTargetsEnum.postgresql,
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
                target: FilterCompileTargetsEnum.postgresql,
                unknowns: ["input.fruits"],
              },
            );
            const { query, masks } = res as Filters;
            assert.equal(masks, undefined);
            assert.equal(query, "WHERE fruits.colour IN (E'red', E'green')");
          });

          // TODO(sr): Support table mappings (needs OpenAPI spec fixes)
          it.skip("returns postgresql (with mappings)", async () => {
            const res = await new OPAClient(serverURL).getFilters(
              "filters/include",
              { fav_colours: ["red", "green"] },
              {
                target: FilterCompileTargetsEnum.postgresql,
                tableMappings: {
                  fruits: { $self: "F", colour: "C" },
                },
              },
            );
            const { query, masks } = res as Filters;
            assert.equal(masks, undefined);
            assert.equal(query, "WHERE fruits.colour IN (E'red', E'green')");
          });

          it("returns ucast-prisma (with input)", async () => {
            const res = await new OPAClient(serverURL).getFilters(
              "filters/include",
              { fav_colours: ["red", "green"] },
              {
                target: FilterCompileTargetsEnum.ucastPrisma,
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
                targets: [
                  FilterCompileTargetsEnum.ucastPrisma,
                  FilterCompileTargetsEnum.postgresql,
                ],
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
