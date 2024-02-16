import { Context } from "./context.js";
import { Processor } from "./processor.js";

export class Contextualizer {
  public context: Context;
  private processors: Processor[];

  constructor() {
    this.context = new Context();
    this.processors = [];
  }

  use(processor: Processor) {
    this.processors.push(processor);
  }

  process(line: string) {
    for (const processor of this.processors) {
       //console.log(processor.name);
      try {
        processor.process(line, this.context);
      } catch(ex) {
        console.error(processor.name, ex);
      }
    }
  }
}
