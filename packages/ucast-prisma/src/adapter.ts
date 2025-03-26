import {
  OPAClient,
  type Input,
  ToInput,
  FiltersRequestOptions,
} from "@styra/opa";
import { ObjectQueryParser, type Condition } from "@ucast/core";
import * as instructions from "./instructions.js";
import { createPrismaInterpreter } from "./interpreter.js";
import * as interpreters from "./interpreters.js";
import { mask } from "./masks.js";

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

export interface Filters {
  query: Record<string, any>;
  mask<T extends Record<string, any>>(item: T): T;
}

export class Adapter extends OPAClient {
  async filters<In extends Input | ToInput>(
    path: string,
    primary: string,
    input?: In,
    opts?: Exclude<FiltersRequestOptions, "target">
  ): Promise<Filters> {
    const { query, masks } = await super.getFilters(path, input, {
      ...opts,
      target: "ucastPrisma",
    });

    return {
      query: ucastToPrisma(query as Record<string, any>, primary),
      mask<T extends Record<string, any>>(item: T): T {
        if (!masks) return item; // pass-through

        return mask(masks, item, primary);
      },
    };
  }
}
