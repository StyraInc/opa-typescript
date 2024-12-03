import { ObjectQueryParser, type Condition } from "@ucast/core";
import { createPrismaInterpreter } from "./interpreter.js";
import * as instructions from "./instructions.js";
import * as interpreters from "./interpreters.js";

export type Options = {
  translations?: Record<string, Record<string, string>>;
};

export function ucastToPrisma(
  ucast: Record<string, any>,
  primary: string,
  { translations }: Options = {}
): Record<string, any> {
  const parsed =
    "type" in ucast && "value" in ucast && "operator" in ucast
      ? (ucast as Condition<unknown>)
      : new ObjectQueryParser(instructions).parse(ucast);
  return createPrismaInterpreter(primary, {
    interpreters,
    translate: (tbl: string, col: string): [string, string] => {
      const tbl0 = translations?.[tbl]?.$self || tbl;
      const col0 = translations?.[tbl]?.[col] || col;
      return [tbl0, col0];
    },
  })(parsed);
}
