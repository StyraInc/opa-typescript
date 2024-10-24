import { ucastToPrisma } from "../src";
import { describe, it, expect } from "vitest";

describe("ucastToPrisma", () => {
  describe("field operators", () => {
    it("converts (implicit) 'eq' to 'equals'", () => {
      const p = ucastToPrisma({ "table.name": "test" });
      expect(p).toStrictEqual({ table: { name: { equals: "test" } } });
    });

    it("converts 'eq' to 'equals'", () => {
      const p = ucastToPrisma({ "table.name": { eq: "test" } });
      expect(p).toStrictEqual({ table: { name: { equals: "test" } } });
    });

    // NOTE(sr): interesting because the interpreter for `in` is `in_` (keyword clash)
    it("converts 'in' to 'in'", () => {
      const p = ucastToPrisma({ "table.name": { in: ["a", "b"] } });
      expect(p).toStrictEqual({ table: { name: { in: ["a", "b"] } } });
    });

    it("converts 'notIn' to 'notIn'", () => {
      const p = ucastToPrisma({ "table.name": { notIn: ["a", "b"] } });
      expect(p).toStrictEqual({ table: { name: { notIn: ["a", "b"] } } });
    });
  });
});
