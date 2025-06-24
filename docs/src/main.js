const { app, BrowserWindow, ipcMain } = require('electron');

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