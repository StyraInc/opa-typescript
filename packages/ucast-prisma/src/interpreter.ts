import {
  createInterpreter,
  Condition,
  InterpretationContext,
} from "@ucast/core";
import merge from "lodash.merge";

export class Query {
  private _primary: string;
  private _tableConditions: Record<string, Object> = {};

  constructor(primary: string) {
    this._primary = primary;
  }

  isPrimary(tbl: string): boolean {
    return tbl === this._primary;
  }

  addPrimaryCondition(cond: Object) {
    this.addCondition(this._primary, cond);
  }

  addCondition(table: string, cond: Object) {
    if (table !== this._primary) {
      this._tableConditions[table] = merge(this._tableConditions[table], cond);
    } else {
      this._tableConditions = merge(this._tableConditions, cond);
    }
    return this;
  }

  child(): Query {
    return new Query(this._primary);
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
  primary: string,
  operators: Record<string, PrismaOperator<any>> // TODO(sr): this <any> doesn't feel right.
) {
  const interpret = createInterpreter<PrismaOperator<any>>(operators);
  return (condition: Condition) =>
    interpret(condition, new Query(primary)).toJSON();
}
