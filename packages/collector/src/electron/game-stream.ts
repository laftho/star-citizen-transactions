import { createInterface, Interface } from "node:readline";
import { createReadStream, readFile } from "node:fs";
import { EventEmitter } from "node:events";

export class GameStream extends EventEmitter {
  private file: string;
  private rl: Interface;
  public cursor: string;
  private current: string;
  private instances = 1;

  constructor(cursor: string) {
    super();

    this.cursor = cursor;
  }

  public stream(file: string, cursor?: string) {
    if (!file || file === this.file) {
      return;
    }

    this._stream(file, cursor);
  }

  private _stream(file: string, cursor?: string) {
    if (!file) {
      return;
    }

    this.file = file;
    this.cursor = cursor;

    this.close();

    this.rl = createInterface({
      input: createReadStream(file, { encoding: "utf-8", start: 0 }),
      crlfDelay: Infinity
    });

    this.rl.on("line", (line) => {
      if (!line || line.length < 27) return;

      const timestamp = line.substring(1, 25);

      if (this.current === timestamp) {
        this.instances += 1;
      } else {
        this.instances = 1;
      }

      this.current = timestamp;

      if (this.cursor) {
        const dt = Date.parse(timestamp);

        if (isNaN(dt)) {
          return;
        }

        const [time, count] = this.cursor.split("|");

        const lt = Date.parse(time);

        if (dt < lt) {
          return;
        }

        if (dt === lt && this.instances <= Number.parseInt(count)) {
          return;
        }
      }

      this.cursor = `${timestamp}|${this.instances}`;

      // console.log(line);
      this.emit("line", line);
    });

    this.rl.on("close", () => {
      setTimeout(() => {
        if (!this.rl) {
          return;
        }

        this._stream(this.file, this.cursor);
      }, 5000);
    });
  }

  close() {
    if (this.rl) {
      this.rl.close();
      this.rl = undefined;
    }
  }
}
