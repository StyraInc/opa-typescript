import { GenericContainer, StartedTestContainer, Wait } from "testcontainers";
import { ucastToPrisma, Adapter } from "../src";
import { describe, it, expect, beforeAll, afterAll } from "vitest";

describe("adapter", async () => {
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

      afterAll(async () => {
        await container.stop();
      });

      beforeAll(async () => {
        const opa = await prepareOPA(
          "ghcr.io/styrainc/enterprise-opa:latest",
          policies
        );
        container = opa.container;
        serverURL = opa.serverURL;
      });

      it("returns prisma-specific query (without specifying it)", async () => {
        const res = await new Adapter(serverURL).filters(
          "filters/include",
          "fruits",
          { fav_colours: ["red", "green"] }
        );
        const { query, mask } = res;
        expect(mask).toBeInstanceOf(Function);
        expect(query).toEqual({
          colour: {
            in: ["red", "green"],
          },
        });
        // ensure noop mask:
        const fruit = { name: "apple", colour: "red" };
        expect(mask(fruit)).toEqual(fruit);
      });
    }
  );
});

describe("ucastToPrisma", () => {
  describe("field operators", () => {
    it("converts (implicit) 'eq' to 'equals'", () => {
      const p = ucastToPrisma({ "table.name": "test" }, "table");
      expect(p).toStrictEqual({ name: { equals: "test" } });
    });

    it("deals with expanded input", () => {
      const p = ucastToPrisma(
        { type: "field", operator: "eq", value: "test", field: "table.name" },
        "table"
      );
      expect(p).toStrictEqual({ name: { equals: "test" } });
    });

    it("converts 'eq' to 'equals'", () => {
      const p = ucastToPrisma({ "table.name": { eq: "test" } }, "table");
      expect(p).toStrictEqual({ name: { equals: "test" } });
    });

    // NOTE(sr): interesting because the interpreter for `in` is `in_` (keyword clash)
    it("converts 'in' to 'in'", () => {
      const p = ucastToPrisma({ "table.name": { in: ["a", "b"] } }, "table");
      expect(p).toStrictEqual({ name: { in: ["a", "b"] } });
    });

    it("converts 'notIn' to 'notIn'", () => {
      const p = ucastToPrisma({ "table.name": { notIn: ["a", "b"] } }, "table");
      expect(p).toStrictEqual({ name: { notIn: ["a", "b"] } });
    });
  });
  describe("compound operators", () => {
    it("allows empty 'or' (drops it)", () => {
      const p = ucastToPrisma({ or: [] }, "table");
      expect(p).toStrictEqual({});
    });

    it("projects 'or' by primary table", () => {
      const p = ucastToPrisma(
        { or: [{ "tickets.resolved": false }, { "users.name": "ceasar" }] },
        "tickets"
      );
      expect(p).toStrictEqual({
        OR: [
          { resolved: { equals: false } },
          { users: { name: { equals: "ceasar" } } },
        ],
      });
    });

    it("handles 'or' with multiple conditions in one disjunct", () => {
      const p = ucastToPrisma(
        {
          or: [
            { "tickets.resolved": false, "tickets.private": true },
            { "users.name": "ceasar" },
          ],
        },
        "tickets"
      );
      expect(p).toStrictEqual({
        OR: [
          {
            AND: [
              { resolved: { equals: false } },
              { private: { equals: true } },
            ],
          },
          { users: { name: { equals: "ceasar" } } },
        ],
      });
    });

    it("handles 'or' with multiple conditions in one disjunct (expanded format)", () => {
      const p = ucastToPrisma(
        {
          type: "compound",
          operator: "or",
          value: [
            {
              type: "compound",
              operator: "and",
              value: [
                {
                  type: "field",
                  operator: "eq",
                  field: "tickets.resolved",
                  value: false,
                },
                {
                  type: "field",
                  operator: "eq",
                  field: "tickets.assignee",
                  value: null,
                },
              ],
            },
            {
              type: "field",
              operator: "eq",
              field: "users.name",
              value: "ceasar",
            },
          ],
        },
        "tickets"
      );
      expect(p).toStrictEqual({
        OR: [
          {
            AND: [
              { resolved: { equals: false } },
              { assignee: { equals: null } },
            ],
          },
          { users: { name: { equals: "ceasar" } } },
        ],
      });
    });
  });

  describe("translations", () => {
    describe("field operators", () => {
      it("converts column names", () => {
        const p = ucastToPrisma({ "table.name": "test" }, "table", {
          translations: { table: { name: "name_col" } },
        });
        expect(p).toStrictEqual({ name_col: { equals: "test" } });
      });

      it("converts table names", () => {
        const p = ucastToPrisma({ "table.name": "test" }, "tbl", {
          translations: { table: { $self: "tbl" } },
        });
        expect(p).toStrictEqual({ name: { equals: "test" } });
      });

      it("converts multiple table+col names", () => {
        const p = ucastToPrisma(
          { "table.name": "test", "user.name": "alice" },
          "tbl",
          {
            translations: {
              table: { $self: "tbl", name: "name_col" },
              user: { $self: "usr", name: "name_col_0" },
            },
          }
        );
        expect(p).toStrictEqual({
          AND: [
            { name_col: { equals: "test" } },
            { usr: { name_col_0: { equals: "alice" } } },
          ],
        });
      });
    });

    describe("compound operators", () => {
      it("supports translations for 'or'", () => {
        const p = ucastToPrisma(
          { or: [{ "tickets.resolved": false }, { "users.name": "ceasar" }] },
          "tickets0",
          {
            translations: {
              tickets: { $self: "tickets0", resolved: "resolved0" },
              users: { $self: "users0", name: "name0" },
            },
          }
        );
        expect(p).toStrictEqual({
          OR: [
            { resolved0: { equals: false } },
            { users0: { name0: { equals: "ceasar" } } },
          ],
        });
      });
    });
  });
});

async function prepareOPA(
  img: string,
  policies: { [k: string]: string }
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
  const serverURL = `http://${container.getHost()}:${container.getMappedPort(
    8181
  )}`;

  for (const [id, body] of Object.entries(policies)) {
    const response = await fetch(serverURL + "/v1/policies/" + id, {
      method: "PUT",
      headers: { "Content-Type": "text/plain" },
      body,
    });
    expect(response.ok);
  }

  return {
    container,
    serverURL,
  };
}
