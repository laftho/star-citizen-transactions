const { contextBridge, ipcRenderer } = require("electron/renderer");

contextBridge.exposeInMainWorld("electronAPI", {
  addEventListener: (event, callback) => ipcRenderer.on(event, (_event, value) => callback(value)),
  dispatchEvent: (event) => ipcRenderer.send(event.name, event)
});
