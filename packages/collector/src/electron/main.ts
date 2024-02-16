import { app, Tray, Menu, nativeImage, BrowserWindow, ipcMain, dialog } from "electron";
import { Config } from "./config.js";
import { GameStream } from "./game-stream.js";
import { absolute } from "./path-util.js";

async function handleFileOpen(window: BrowserWindow) {
  const { canceled, filePaths } = await dialog.showOpenDialog(window, {
    filters: [{
      name: "Game.log",
      extensions: ["log"]
    }],
    properties: ["openFile", "showHiddenFiles"]
  });
  if (!canceled) {
    return filePaths[0]
  }
}

app.whenReady().then(async () => {
  const config = new Config(app);
  await config.load();

  const gamestream = new GameStream(config.cursor);

  // @ts-ignore
  const logo = nativeImage.createFromPath(absolute("../../build/client/logo.png", import.meta.url));

  const tray = new Tray(logo);

  const contextMenu = Menu.buildFromTemplate([
    { label: "Exit", type: "normal" }
  ]);

  tray.setContextMenu(contextMenu);

  tray.setToolTip("Star Citizen Transaction Log Collector");
  tray.setTitle("Star Citizen Transaction Log Collector");

  const preloadScript = absolute("../../build/client/preload.js", import.meta.url);

  console.log(preloadScript);

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // @ts-ignore
      preload: preloadScript
    }
  });
  win.loadFile("build/client/index.html");

  config.on("changed", () => {
    win.webContents.send("config", JSON.stringify(config));

    gamestream.stream(config.gameLogPath, config.cursor);
  });

  gamestream.on("line", (line) => {
    config.cursor = gamestream.cursor;
    win.webContents.send("line", line);
  });

  ipcMain.on("open-file-dialog", async () => {
    const gameLogPath = await handleFileOpen(win);

    config.gameLogPath = gameLogPath;
    await config.save();
  });

  ipcMain.on("config", async () => {
    win.webContents.send("config", JSON.stringify(config));
  });

  gamestream.stream(config.gameLogPath, config.cursor);
});


