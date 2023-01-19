const { app, BrowserWindow, globalShortcut, clipboard } = require("electron");
const Alert = require("electron-alert");
const openai = require("openai-api");
const path = require("path");
const process = require("process");

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const interactWithGPT = (prompt) => {
  // Create an instance of the OpenAI API
  const openaiClient = new openai(OPENAI_API_KEY);

  // Define the GPT-3 parameters
  const params = {
    engine: "text-davinci-003",
    prompt: prompt,
    bestOf: 1,
    n: 1,
  };

  // Call the OpenAI API
  openaiClient
    .complete(params)
    .then((response) => {
      // Get the GPT-3 response
      const gptResponse = response.data.choices[0].text;

      // Copy the response to the clipboard
      if (gptResponse) {
        let swalOptions = {
          title: "ezgpt",
          text: gptResponse,
          icon: "success",
          buttons: ["Cancel", "Copy"],
          timer: 3000,
        };

        clipboard.writeText(gptResponse);

        Alert.fireToast(swalOptions);
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const createWindow = () => {
  // Define variables
  let clicks = 0;
  let lastClick = 0;

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    // Hide the menu bar and window controls
    frame: false,
    menuBarVisible: false,
  });

  // Register a global shortcut listener
  globalShortcut.register("Control+C", () => {
    // Get the current timestamp
    const now = Date.now();

    // Check if the last click was less than 500 milliseconds ago
    if (now - lastClick < 500) {
      clicks++;
    } else {
      clicks = 1;
    }
    // Update the last click timestamp
    lastClick = now;

    // Check if the user double-clicked the "Control-C" key
    if (clicks === 2) {
      // Get highlighted text
      const selectedText = clipboard.readText();

      // Pass the selected text to the GPT-3 API
      interactWithGPT(selectedText);
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "index.html"));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
