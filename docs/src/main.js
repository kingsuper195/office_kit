const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const fs = require("node:fs")

const createWindow = () => {
  const win = new BrowserWindow({
    // remove the default titlebar
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile('src/index.html');
}

app.whenReady().then(() => {
  createWindow();
});

ipcMain.on('close', () => {
  app.quit();
});

ipcMain.on('saveFileDialog', async (event, data) => {
  let path = await dialog.showSaveDialog({ properties: [] });
  if (path.canceled) {
    console.log("File save canceled");
    return;
  }
  fs.writeFileSync(path.filePath, data);
  console.log("saved");
});

ipcMain.handle('openFileDialog', async (event, data) => {
  let path = await dialog.showOpenDialog({ properties: ['openFile'] });
  if (path.canceled) {
    console.log("File save canceled");
    return;
  }
  let result = fs.readFileSync(path.filePaths[0],"utf-8");
  return result;
});