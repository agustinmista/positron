import { app, BrowserWindow, Notification} from 'electron';

import { createMainWindow, mainWindow } from './window';

// ----------------------------------------
// Packaging stuff
// ----------------------------------------

// Handle creating/removing shortcuts on Windows when installing/uninstalling
if (require('electron-squirrel-startup')) { app.quit(); }

// ----------------------------------------
// Event handlers
// ----------------------------------------

// Create a main window when Electron has finished initialization
app.on('ready', (): void => {
  const hidden = process.argv.includes('--hidden');
  createMainWindow(hidden);
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', (): void => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// For macOS, re-create a window when the dock icon is clicked
app.on('activate', (): void => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});
