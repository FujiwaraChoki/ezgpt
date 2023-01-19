// Expose clipboard to renderer

const { contextBridge, clipboard } = require("electron");

contextBridge.exposeInMainWorld("clipboard", {
  readText: () => clipboard.readText(),
  writeText: (text) => clipboard.writeText(text),
});
