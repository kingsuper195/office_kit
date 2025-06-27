const { app, BrowserWindow, dialog, ipcMain, Menu, MenuItem } = require('electron');
const fs = require("node:fs");
let win

let fed

const createWindow = () => {
  win = new BrowserWindow({
    // remove the default titlebar
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      spellcheck: true,
    },
  });

  win.loadFile('src/index.html');
}

app.whenReady().then(() => {
  createWindow();
  win.webContents.on('context-menu', (event, params) => {
    const menu = new Menu();

    // Add each spelling suggestion
    for (const suggestion of params.dictionarySuggestions) {
      menu.append(new MenuItem({
        label: suggestion,
        click: () => win.webContents.replaceMisspelling(suggestion)
      }));
    }

    // Allow users to add the misspelled word to the dictionary
    if (params.misspelledWord) {
      menu.append(
        new MenuItem({
          label: 'Add to dictionary',
          click: () => win.webContents.session.addWordToSpellCheckerDictionary(params.misspelledWord)
        })
      );
    }

    menu.popup();
  });
});

ipcMain.on('close', () => {
  app.quit();
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

ipcMain.handle('prompt', async (event, data) => {
  let ans = dialog.showMessageBoxSync(null, { type: 'question', message: data, buttons: ["Yes", "No"], defaultId: 2 });
  return ans == 1;
});
