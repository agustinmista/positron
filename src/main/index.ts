import { app, BrowserWindow } from 'electron';

// This allows TypeScript to pick up the magic constants that's auto-generated
// by Forge's Webpack plugin that tells the Electron app where to look for the
// Webpack-bundled app code (depending on whether you're running in development
// or production).
declare const POSITRON_WEBPACK_ENTRY: string;
declare const POSITRON_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { app.quit(); }

// Create the main window
const createMainWindow = (): void => {

  // Create a new browser window
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      preload: POSITRON_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // Load the index.html of the app
  mainWindow.loadURL(POSITRON_WEBPACK_ENTRY);

  // Hide the menu bar
  mainWindow.setMenuBarVisibility(false);

  // Open the DevTools
  // mainWindow.webContents.openDevTools();
};

// Create a main window when Electron has finished initialization.
app.on('ready', (): void => {
  createMainWindow();
});

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', (): void => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// For macOS, re-create a window when the dock icon is clicked.
app.on('activate', (): void => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});
