import { BrowserWindow, Notification } from "electron";
import Store from 'electron-store';

import { initIPCHandlers } from "./ipc";
import { createTrayIcon } from './tray'

import icon from '../img/icons/icon.png';

// ----------------------------------------
// Packaging stuff
// ----------------------------------------

// This allows TypeScript to pick up the magic constants that are auto-generated
// by Forge's Webpack plugin that tells the Electron app where to look for the
// Webpack-bundled app code (depending on whether you're running in development
// or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Are we in development mode?
const isDev: boolean = process.env.NODE_ENV === 'development';

// ----------------------------------------
// Main app window
// ----------------------------------------

// A global main window object
export var mainWindow: BrowserWindow;

// Create the main window
export function createMainWindow(hidden: boolean = false) {

  // Create a new browser window
  mainWindow = new BrowserWindow({
    show: !hidden,
    icon: icon,
    height: 1000,
    width: isDev ? 1200 : 600,
    webPreferences: {
      zoomFactor: 0.8,
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

  // Open the DevTools if we are in dev mode
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // Create the tray icon
  createTrayIcon(mainWindow);

  // Show a notification if we started in hidden mode
  if (hidden) {
    new Notification({ body: 'Started in the background', silent: true }).show();
  }

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
