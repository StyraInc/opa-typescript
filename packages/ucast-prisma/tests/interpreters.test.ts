import { FieldCondition, CompoundCondition } from "@ucast/core";
import {
  createPrismaInterpreter,
  eq,
  neq,
  lte,
  lt,
  gte,
  gt,
  and,
  or,
} from "../src";
import { describe, it, expect } from "vitest";

describe("Condition interpreter", () => {
  describe("field operators", () => {
    const interpret = createPrismaInterpreter({ eq, neq, lt, lte, gt, gte });

    it('generates query with `equals operator for "eq"', () => {
      const condition = new FieldCondition("eq", "table.name", "test");
      const f = interpret(condition);
      expect(f).toStrictEqual({ table: { name: { equals: "test" } } });
    });

    it('generates query with `not` operator for "neq"', () => {
      const condition = new FieldCondition("neq", "table.name", "test");
      const f = interpret(condition);
      expect(f).toStrictEqual({ table: { name: { not: "test" } } });
    });
  });

  describe("compound operators", () => {
    const interpret = createPrismaInterpreter({
      or,
      and,
      eq,
      lt,
      gt,
    });

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
