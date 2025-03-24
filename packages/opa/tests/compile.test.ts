import { describe, before, after, it } from "node:test";
import assert from "node:assert";
import {
  GenericContainer,
  StartedTestContainer,
  Wait,
} from "testcontainers";

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
          "eopa",
        );
        container = opa.container;
        serverURL = opa.serverURL;
      });

      describe("single-target", () => {
        it("returns postgresql when requested", async () => {
          const client = new OpaApiClientCore({
            serverURL,
            debugLogger: console });
          const res = await compileQueryWithPartialEvaluation(
            client,
            {
              requestBody: {
                query: "data.filters.include",
                input: { fav_colours: ["red", "green"] },
              },
            },
            {
              acceptHeaderOverride: CompileQueryWithPartialEvaluationAcceptEnum.applicationVndStyraSqlPostgresqlPlusJson,
            });          
          if (!res.ok) {
            throw res.error;
          }
          const { value: { compileResultSQL: { result } } } = res;
          assert.deepEqual(result,
            {
              query: "WHERE fruits.colour IN (E'red', E'green')"
            });
        });
      });
    });
});

// NOTE(sr): prepareOPA here is simpler: we don't need system authz stuff.
async function prepareOPA(
  img: string,
  policies: { [k: string]: string },
  name: string,
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
    .withName(name)
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
