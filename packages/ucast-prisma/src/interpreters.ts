import { CompoundCondition, FieldCondition, Comparable } from "@ucast/core";
import { PrismaOperator } from "./interpreter.js";

export const eq = op("equals");
export const ne = op("not");
export const lt = op<Comparable>("lt");
export const lte = op<Comparable>("lte");
export const gt = op<Comparable>("gt");
export const gte = op<Comparable>("gte");
const in_ = op<unknown[]>("in");
export { in_ as in };
export const notIn = op<unknown[]>("notIn");

// TODO(sr): This `and` returns a flat object, but this would be wrong for
// conditions that are for the same field. E.g. lt: 12 AND lt: 13.
// It's an edge case, but it shouldn't be wrong.
export const and: PrismaOperator<CompoundCondition> = (
  condition,
  query,
  { interpret }
) => {
  const q = query.child();
  condition.value.forEach((cond) => {
    interpret(cond, q);
  });
  return query.merge(q);
};

export const or: PrismaOperator<CompoundCondition> = (
  condition,
  query,
  { interpret }
) => {
  const or: Record<string, any> = {};
  condition.value.forEach((cond) => {
    const q = query.child();
    interpret(cond, q);
    for (const [tbl, c] of Object.entries(q.toJSON())) {
      or[tbl] = or[tbl] ?? [];
      or[tbl].push(c);
    }
  });

  for (const [tbl, cs] of Object.entries(or)) {
    if (cs.length > 1) {
      query.addCondition(tbl, { OR: cs });
    } else {
      query.addCondition(tbl, cs[0]);
    }
  }

  return query;
};

function op<T>(name: string): PrismaOperator<FieldCondition<T>> {
  return (condition, query) => {
    const [tbl, field] = condition.field.split(".");
    return query.addCondition(tbl, { [field]: { [name]: condition.value } });
  };
}
