import { Processor } from "../processor.js";
import { Context } from "../context.js";
import { EventEmitter } from "node:events";

export class StandardSellProcessor extends EventEmitter implements Processor {
  constructor() {
    super();
  }

  get name(): string {
    return "standard-buy";
  }

  process(line: string, context: Context): void {

  }
}
