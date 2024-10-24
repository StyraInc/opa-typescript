import { ObjectQueryParser } from "@ucast/core";
import { createPrismaInterpreter } from "./interpreter.js";
import * as instructions from "./instructions.js";
import * as interpreters from "./interpreters.js";

export function ucastToPrisma(ucast: Record<string, any>): Record<string, any> {
  const parsed = new ObjectQueryParser(instructions).parse(ucast);
  return createPrismaInterpreter(interpreters)(parsed);
}
