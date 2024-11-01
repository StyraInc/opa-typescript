import { ucastToPrisma } from "../src";
import { describe, it, expect } from "vitest";

describe("ucastToPrisma", () => {
  describe("field operators", () => {
    it("converts (implicit) 'eq' to 'equals'", () => {
      const p = ucastToPrisma({ "table.name": "test" }, "table");
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
  });
});
