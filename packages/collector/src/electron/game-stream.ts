import { createInterface, Interface } from "node:readline";
import { createReadStream } from "node:fs";
import { EventEmitter } from "node:events";

export class GameStream extends EventEmitter {
  private file: string;
  private rl: Interface;
  public cursor: string;

  constructor(cursor: string) {
    super();

    this.cursor = cursor;
  }

  stream(file: string, cursor?: string) {
    if (!file || file === this.file) {
      return;
    }

    this.file = file;
    this.cursor = cursor;

    this.close();

    this.rl = createInterface(createReadStream(file, { encoding: "utf-8", start: 0 }));

    this.rl.on("line", (line) => {
      if (!line || line.length < 27) return;

      const timestamp = line.substring(1, 25);

      if (this.cursor) {
        const dt = Date.parse(timestamp);
        const lt = Date.parse(this.cursor);

        if (dt < lt) {
          return;
        }
      }

      this.cursor = timestamp;

      console.log(line);
      this.emit("line", line);
    });
  }

  close() {
    if (this.rl) {
      this.rl.close();
      this.rl = undefined;
    }
  }
}