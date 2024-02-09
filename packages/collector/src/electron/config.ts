import { App } from "electron";
import * as path from "node:path";
import { readFile, writeFile } from "node:fs/promises";
import { EventEmitter } from "node:events";

export const DEFAULTS = {
  gameLogPath: "",
  cursor: ""
};

export class Config extends EventEmitter {
  private readonly app: App;
  private readonly filePath: string;

  public _gameLogPath: string;
  public get gameLogPath(): string {
    return this._gameLogPath;
  }

  public set gameLogPath(value: string) {
    this._gameLogPath = value;
    this.emit("changed");
  }

  public _cursor: string;
  public get cursor(): string {
    return this._cursor;
  }

  public set cursor(value: string) {
    this._cursor = value;
    this.emit("changed");
  }

  constructor(app: App) {
    super();

    this.app = app;
    this.filePath = path.join(this.app.getPath("userData"), "./config.json");
  }

  reset() {
    this.gameLogPath = DEFAULTS.gameLogPath;
    this.cursor = DEFAULTS.cursor;
  }

  async load() {
    let file;

    try {
      file = await readFile(this.filePath, {encoding: "utf-8"});
    } catch(ex) {
      console.warn(ex, "missing config file");
    }

    if (!file) {
      this.reset();
      await this.save();
      return;
    }

    const opts = JSON.parse(file);

    this._gameLogPath = opts.gameLogPath ?? DEFAULTS.gameLogPath;
    this._cursor = opts.cursor ?? DEFAULTS.cursor;

    this.emit("changed");
  }

  async save() {
    await writeFile(this.filePath, JSON.stringify(this), { encoding: "utf-8" });
  }

  toJSON() {
    return {
      gameLogPath: this.gameLogPath,
      cursor: this.cursor
    };
  }
}