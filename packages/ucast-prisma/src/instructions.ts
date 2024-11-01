import { CompoundCondition } from "@ucast/core";

export const eq = { type: "field" };
export const ne = eq;
export const lt = eq;
export const lte = eq;
const in_ = eq;
export { in_ as in };
export const notIn = eq;

function ensureIsArray(instruction: { name: string }, value: any) {
  if (!Array.isArray(value)) {
    throw new Error(`"${instruction.name}" expects value to be an array`);
  }
}

export const and = {
  type: "compound",
  validate: ensureIsArray,
  parse(instruction: { name: string }, queries: any[], { parse }: any) {
    const conditions = queries.map((query) => parse(query));
    return new CompoundCondition(instruction.name, conditions);
  },
};
export const or = and;
