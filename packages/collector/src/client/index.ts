import { ElectronRendererToMainEvent } from "./global.js";

class OpenFileDialogEvent extends ElectronRendererToMainEvent {
  constructor() {
    super("open-file-dialog");
  }
}

class LoadConfigEvent extends ElectronRendererToMainEvent {
  constructor() {
    super("config");
  }
}

class ConfigChangedEvent extends Event {
  constructor() {
    super("changed");
  }
}

class Config extends EventTarget {
  public gameLogPath: string;
  public cursor: string;

  constructor() {
    super();
  }

  update(value: string) {
    const obj = JSON.parse(value);

    for (const key of Object.getOwnPropertyNames(obj)) {
      this[key] = obj[key];
    }

    this.dispatchEvent(new ConfigChangedEvent());
  }
}

function log(message) {
  const logEl = document.getElementById("log") as HTMLTextAreaElement;
  logEl.value += message;
}

(() => {
  const config = new Config();

  const cursor = document.getElementById("cursor") as HTMLInputElement;
  const gameLogPath = document.getElementById("game-log-path") as HTMLInputElement;
  const gameLogSelect = document.getElementById("game-log-select") as HTMLButtonElement;

  config.addEventListener("changed", () => {
    gameLogPath.value = config.gameLogPath;
    cursor.value = config.cursor;
  });

  gameLogSelect.addEventListener("click", () => {
    window.electronAPI.dispatchEvent(new OpenFileDialogEvent());
  });

  window.electronAPI.addEventListener("config", (e) => {
    config.update(e);
  });

  window.electronAPI.addEventListener("line", (e) => {
    log(e);
  });

  window.electronAPI.dispatchEvent(new LoadConfigEvent());
})();
