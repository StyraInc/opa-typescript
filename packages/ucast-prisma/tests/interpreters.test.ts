import { FieldCondition, CompoundCondition } from "@ucast/core";
import { createPrismaInterpreter } from "../src/interpreter.js";
import * as interpreters from "../src/interpreters.js";
import { describe, it, expect } from "vitest";

describe("Condition interpreter", () => {
  describe("field operators", () => {
    const interpret = createPrismaInterpreter("table", { interpreters });

    it('generates query with `equals` operator for "eq"', () => {
      const condition = new FieldCondition("eq", "table.name", "test");
      const f = interpret(condition);
      expect(f).toStrictEqual({ name: { equals: "test" } });
    });

    it('generates query with `startsWith` operator for "startswith"', () => {
      const condition = new FieldCondition("startswith", "table.name", "test");
      const f = interpret(condition);
      expect(f).toStrictEqual({ name: { startsWith: "test" } });
    });

    it('generates query with `not` operator for "ne"', () => {
      const condition = new FieldCondition("ne", "table.name", "test");
      const f = interpret(condition);
      expect(f).toStrictEqual({ name: { not: "test" } });
    });

    it('generates query with `in` operator for "in" with array value', () => {
      const condition = new FieldCondition("in", "table.name", [
        "test",
        "another",
      ]);
      const f = interpret(condition);
      expect(f).toStrictEqual({ name: { in: ["test", "another"] } });
    });

    it('generates query with `notIn` operator for "notIn" with array value', () => {
      const condition = new FieldCondition("notIn", "table.name", [
        "test",
        "another",
      ]);
      const f = interpret(condition);
      expect(f).toStrictEqual({ name: { notIn: ["test", "another"] } });
    });
  });

  describe("compound operators", () => {
    const interpret = createPrismaInterpreter("user", { interpreters });

    it.skip('generates query without extra fluff for "AND"', () => {
      // NOTE(sr): Correctness is more important than conciseness of generated
      // query filters. So let's deal with this if we find a real reason to.
      const condition = new CompoundCondition("and", [
        new FieldCondition("lt", "user.age", 12),
        new FieldCondition("gt", "user.age", 40),
      ]);
      const f = interpret(condition);

      expect(f).toStrictEqual({
        age: {
          lt: 12,
          gt: 40,
        },
      });
    });

    it('keeps "AND" when it has to', () => {
      const condition = new CompoundCondition("and", [
        new FieldCondition("ne", "user.name", "bob"),
        new FieldCondition("ne", "user.name", "alice"),
      ]);
      const f = interpret(condition);

      expect(f).toStrictEqual({
        AND: [
          {
            name: {
              not: "bob",
            },
          },
          {
            name: {
              not: "alice",
            },
          },
        ],
      });
    });

    it('generates query with OR for "or"', () => {
      const condition = new CompoundCondition("or", [
        new FieldCondition("lt", "user.age", 12),
        new FieldCondition("gt", "user.age", 40),
      ]);
      const f = interpret(condition);

      expect(f).toStrictEqual({
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
      });
    });

    it("drops empty OR conditions", () => {
      const condition = new CompoundCondition("or", []);
      const f = interpret(condition);

      expect(f).toStrictEqual({});
    });

    it('generates query with OR for "or", projected to primary table (user)', () => {
      const condition = new CompoundCondition("or", [
        new FieldCondition("eq", "user.id", 12),
        new FieldCondition("gt", "user.age", 20),
        new FieldCondition("eq", "customer.id", 40),
      ]);
      const f = interpret(condition);

      expect(f).toStrictEqual({
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
          {
            customer: {
              id: {
                equals: 40,
              },
            },
          },
        ],
      });
    });

    it('generates query with NOT for "not", projected to primary table (user)', () => {
      const condition = new CompoundCondition("not", [
        new FieldCondition("lt", "user.age", 18),
      ]);
      const f = interpret(condition);

      expect(f).toStrictEqual({
        NOT: {
          age: {
            lt: 18,
          },
        },
      });
    });

    it('generates query with NOT for "not", threaded in for secondary table (customer)', () => {
      const condition = new CompoundCondition("not", [
        new FieldCondition("eq", "customer.id", 40),
      ]);
      const f = interpret(condition);
      expect(f).toStrictEqual({
        customer: {
          NOT: { id: { equals: 40 } },
        },
      });
    });

    it('can deal with "AND" within "OR"', () => {
      const condition = new CompoundCondition("or", [
        new CompoundCondition("and", [
          new FieldCondition("eq", "user.id", 12),
          new FieldCondition("gt", "user.age", 20),
        ]),
        new FieldCondition("eq", "customer.id", 40),
      ]);
      const f = interpret(condition);

      expect(f).toStrictEqual({
        OR: [
          {
            AND: [
              {
                id: { equals: 12 },
              },
              {
                age: { gt: 20 },
              },
            ],
          },
          {
            customer: { id: { equals: 40 } },
          },
        ],
      });
    });
  });
});
