import {
  createInterpreter,
  Condition,
  InterpretationContext,
} from "@ucast/core";
import merge from "lodash.merge";

export class Query {
  private _primary: string;
  private _tableConditions: Record<string, Object> = {};
  private _relatedConditions: Record<string, Object> = {};

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
      this._relatedConditions[table] = merge(
        this._relatedConditions[table],
        cond
      );
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
    this._relatedConditions = merge(
      this._relatedConditions,
      other._relatedConditions
    );
    return this;
  }

  toJSON() {
    return { ...this._tableConditions, ...this._relatedConditions };
  }
}

export type PrismaOperator<C extends Condition> = (
  condition: C,
  query: Query,
  context: InterpretationContext<PrismaOperator<C>>
) => Query;

export type interpreterOpts = {
  interpreters: Record<string, PrismaOperator<any>>; // TODO(sr): this <any> doesn't feel right.
} & translateOpts;

export type translateOpts = {
  translate?: (tbl: string, col: string) => [string, string];
};

export function createPrismaInterpreter(
  primary: string,
  { interpreters, translate }: interpreterOpts
) {
  const interpret = createInterpreter<PrismaOperator<any>, translateOpts>(
    interpreters,
    {
      translate,
    }
  );
  return (condition: Condition) =>
    interpret(condition, new Query(primary)).toJSON();
}
