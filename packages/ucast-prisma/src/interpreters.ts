import type {
  CompoundCondition,
  FieldCondition,
  Comparable,
} from "@ucast/core";
import {
  type translateOpts,
  type PrismaOperator,
  Query,
} from "./interpreter.js";

export const eq = op("equals");
export const ne = op("not");
export const lt = op<Comparable>("lt");
export const lte = op<Comparable>("lte");
export const gt = op<Comparable>("gt");
export const gte = op<Comparable>("gte");
const in_ = op<unknown[]>("in");
export { in_ as in };
export const notIn = op<unknown[]>("notIn");

export const and: PrismaOperator<CompoundCondition> = (
  condition,
  query,
  { interpret }
) => {
  const and: Record<string, any>[] = [];
  for (const cond of condition.value) {
    const q = query.child();
    interpret(cond, q);
    and.push(q.toJSON());
  }

  if (and.length > 1) {
    query.addPrimaryCondition({ AND: and });
  } else {
    query.addPrimaryCondition(and[0]);
  }

  return query;
};

export const or: PrismaOperator<CompoundCondition> = (
  condition,
  query,
  { interpret }
) => {
  const or: Record<string, any>[] = [];
  for (const cond of condition.value) {
    const q = query.child();
    interpret(cond, q);
    or.push(q.toJSON());
  }

  if (or.length > 1) {
    query.addPrimaryCondition({ OR: or });
  } else {
    query.addPrimaryCondition(or[0]);
  }

  return query;
};

export const not: PrismaOperator<CompoundCondition> = (
  condition,
  query,
  { interpret }
) => {
  if (condition.value.length > 1) {
    throw new Error("NOT condition must have exactly one child");
  }

  const [tbl] = (condition.value[0] as FieldCondition).field.split(".");
  const not = new Query(tbl);
  interpret(condition.value[0], not);

  query.addCondition(tbl, { NOT: not.toJSON() });
  return query;
};

function op<T>(name: string): PrismaOperator<FieldCondition<T>> {
  return (condition, query, options) => {
    const translate =
      (options as translateOpts)?.translate || // NOTE(sr): The 'as' here feels wrong, but I couldn't make it work otherwise.
      ((...x: string[]) => [x[0], x[1]]);
    const [tbl, field] = translate(...condition.field.split("."));
    return query.addCondition(tbl, { [field]: { [name]: condition.value } });
  };
}
