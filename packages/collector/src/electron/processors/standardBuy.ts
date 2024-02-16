import { Processor } from "../processor.js";
import { Context } from "../context.js";
import { EventEmitter } from "node:events";
import { bracket } from "../parse-util.js";

export class StandardBuyProcessor extends EventEmitter implements Processor {
  constructor() {
    super();
  }

  get name(): string {
    return "standard-buy";
  }

  process(line: string, context: Context): void {
    const [time, notice, event, ...parts] = line.split(" ");

    if (event !== "<CEntityComponentShoppingProvider::SendStandardItemBuyRequest>") {
      return;
    }

    const obj = bracket(parts);

    parts.find(v => v.startsWith("playerId")).split("[")[1].split("]")[0]

  }
}
