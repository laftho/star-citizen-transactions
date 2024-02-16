import { Context } from "./context.js";

export interface Processor {
  get name(): string;
  process(line: string, context: Context): void;
}
