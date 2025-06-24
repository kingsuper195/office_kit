const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const fs = require("node:fs")

let win

let fed

const createWindow = () => {
  win = new BrowserWindow({
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

ipcMain.handle('saveFileDialog', async (event, data) => {
  if (fed) {
    fs.writeFileSync(fed, data);
    return fed;
  }
  let path = await dialog.showSaveDialog({ filters: [{ name: 'HTML Snippet', extensions: ['htmls'] }] });
  if (path.canceled) {
    console.log("File save canceled");
    return;
  }
  if (path.filePath.endsWith('.htmls')) {
    fed = path.filePath
  } else {
    fed = path.filePath + ".htmls"
  }
  fs.writeFileSync(fed, data);
  console.log("saved");
  return fed;
});

ipcMain.handle('saveFileAsDialog', async (event, data) => {
  let path = await dialog.showSaveDialog({ filters: [{ name: 'HTML Snippet', extensions: ['htmls'] }] });
  if (path.canceled) {
    console.log("File save canceled");
    return fed;
  }
  if (path.filePath.endsWith('.htmls')) {
    fed = path.filePath
  } else {
    fed = path.filePath + ".htmls"
  }
  fs.writeFileSync(path.filePath, data);
  console.log("saved");
  return fed;
});

ipcMain.handle('openFileDialog', async (event, data) => {
  let path = await dialog.showOpenDialog({ filters: [{ name: 'HTML Snippet', extensions: ['htmls'] }], properties: ['openFile'] });
  if (path.canceled) {
    console.log("File save canceled");
    return;
  }
  fed = path.filePaths[0];
  let result = fs.readFileSync(path.filePaths[0], "utf-8");
  return { data: result, fed };
});

ipcMain.on('minimize', () => {
  win.minimize()
});

ipcMain.on('maximize', () => {
  if (win.isMaximized()) {
    win.unmaximize()
  } else {
    win.maximize();
  }
});
