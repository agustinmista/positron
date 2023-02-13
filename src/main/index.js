const { app, BrowserWindow } = require('electron');
const path = require('path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) app.quit();

// Create the main window
const createMainWindow = () => {

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    // frame: false,
    width: 500,
    height: 300,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Set the app title
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.setTitle('Positron');
  });

};

// Create a main window when Electron has finished initialization.
app.on('ready', createMainWindow);

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// For macOS, re-create a window when the dock icon is clicked.
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

