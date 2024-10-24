import { FieldCondition, CompoundCondition } from "@ucast/core";
import { createPrismaInterpreter } from "../src/interpreter.js";
import * as interpreters from "../src/interpreters.js";
import { describe, it, expect } from "vitest";

describe("Condition interpreter", () => {
  describe("field operators", () => {
    const interpret = createPrismaInterpreter(interpreters);

    it('generates query with `equals operator for "eq"', () => {
      const condition = new FieldCondition("eq", "table.name", "test");
      const f = interpret(condition);
      expect(f).toStrictEqual({ table: { name: { equals: "test" } } });
    });

    it('generates query with `not` operator for "ne"', () => {
      const condition = new FieldCondition("ne", "table.name", "test");
      const f = interpret(condition);
      expect(f).toStrictEqual({ table: { name: { not: "test" } } });
    });

    it('generates query with `in` operator for "in" with array value', () => {
      const condition = new FieldCondition("in", "table.name", [
        "test",
        "another",
      ]);
      const f = interpret(condition);
      expect(f).toStrictEqual({ table: { name: { in: ["test", "another"] } } });
    });

    it('generates query with `notIn` operator for "notIn" with array value', () => {
      const condition = new FieldCondition("notIn", "table.name", [
        "test",
        "another",
      ]);
      const f = interpret(condition);
      expect(f).toStrictEqual({
        table: { name: { notIn: ["test", "another"] } },
      });
    });
  });

  describe("compound operators", () => {
    const interpret = createPrismaInterpreter(interpreters);

    it('generates query without extra fluff for "AND"', () => {
      const condition = new CompoundCondition("and", [
        new FieldCondition("lt", "user.age", 12),
        new FieldCondition("gt", "user.age", 40),
      ]);
      const f = interpret(condition);

      expect(f).toStrictEqual({
        user: {
          age: {
            lt: 12,
            gt: 40,
          },
        },
      });
    });

    it('generates query with with OR for "or"', () => {
      const condition = new CompoundCondition("or", [
        new FieldCondition("lt", "user.age", 12),
        new FieldCondition("gt", "user.age", 40),
      ]);
      const f = interpret(condition);

      expect(f).toStrictEqual({
        user: {
          OR: [
            {
              age: {
                lt: 12,
              },
            },
            {
              age: {
                gt: 40,
              },
            },
          ],
        },
      });
    });

    it('generates query with OR for "or" per table', () => {
      const condition = new CompoundCondition("or", [
        new FieldCondition("eq", "user.id", 12),
        new FieldCondition("gt", "user.age", 20),
        // This OR will be dropped as for this table, there is only one condition.
        new FieldCondition("eq", "customer.id", 40),
      ]);
      const f = interpret(condition);

      expect(f).toStrictEqual({
        user: {
          OR: [
            {
              id: {
                equals: 12,
              },
            },
            {
              age: {
                gt: 20,
              },
            },
          ],
        },
        customer: {
          id: {
            equals: 40,
          },
        },
      });
    });
  });
});
