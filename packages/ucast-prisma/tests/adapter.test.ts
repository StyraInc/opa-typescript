import { ucastToPrisma } from "../src";
import { describe, it, expect } from "vitest";

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
          { resolved: { equals: false }, private: { equals: true } },
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
          { resolved: { equals: false }, assignee: { equals: null } },
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
          name_col: { equals: "test" },
          usr: { name_col_0: { equals: "alice" } },
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
