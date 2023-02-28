import { BrowserWindow } from "electron";
import Store from 'electron-store';

import { initIPCHandlers } from "./ipc";
import { createTrayIcon, trayIcon } from './tray'

// ----------------------------------------
// Packaging stuff
// ----------------------------------------

// This allows TypeScript to pick up the magic constants that are auto-generated
// by Forge's Webpack plugin that tells the Electron app where to look for the
// Webpack-bundled app code (depending on whether you're running in development
// or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// ----------------------------------------
// Main app window
// ----------------------------------------

// A global main window object
export var mainWindow: BrowserWindow;

// Create the main window
export function createMainWindow() {

  // Create a new browser window
  mainWindow = new BrowserWindow({
    height: 1200,
    width: 800,
    webPreferences: {
      contextIsolation: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY
    },
  });

  // Create a user config store
  const store = new Store();

  // Handle events from the renderer process
  initIPCHandlers(store);

  // Load the index.html of the app
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Hide the menu bar
  mainWindow.setMenuBarVisibility(false);

  // Open the DevTools
  // mainWindow.webContents.openDevTools();

  // Create the tray icon
  createTrayIcon(mainWindow);

  // Minimize to tray
  mainWindow.on('minimize', (event: Event) => {
    event.preventDefault();
    mainWindow.hide();
  });

  // Restore from tray
  mainWindow.on('restore', () => {
    mainWindow.show();
  });
};
