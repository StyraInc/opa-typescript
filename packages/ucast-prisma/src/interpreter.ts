import {
  createInterpreter,
  Condition,
  InterpretationContext,
} from "@ucast/core";
import merge from "lodash.merge";

export class Query {
  private _tableConditions: Record<string, Object> = {};

  addCondition(table: string, cond: Object) {
    this._tableConditions[table] = merge(this._tableConditions[table], cond);
    return this;
  }

  child(): Query {
    return new Query();
  }

  merge(other: Query): Query {
    this._tableConditions = merge(
      this._tableConditions,
      other._tableConditions
    );
    return this;
  }

  toJSON() {
    return this._tableConditions;
  }
}

export type PrismaOperator<C extends Condition> = (
  condition: C,
  query: Query,
  context: InterpretationContext<PrismaOperator<C>>
) => Query;

export function createPrismaInterpreter(
  operators: Record<string, PrismaOperator<any>> // TODO(sr): this <any> doesn't feel right.
) {
  const interpret = createInterpreter<PrismaOperator<any>>(operators);
  return (condition: Condition) => interpret(condition, new Query()).toJSON();
}
