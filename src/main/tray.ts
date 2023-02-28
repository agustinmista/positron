import { app, Tray, Menu, BrowserWindow } from "electron";
import path from 'path';

import icon from '../img/logo.ico';

// ----------------------------------------
// Tray icon
// ----------------------------------------

// A global tray icon object
export var trayIcon: Tray;

// Create the tray icon
export function createTrayIcon(mainWindow: BrowserWindow) {

  // Create a new tray icon with the given icon
  trayIcon = new Tray(path.join(__dirname, icon));

  // Show the app's name in the tray icon tooltip
  trayIcon.setToolTip(app.getName());

  // Set the icon's menu option
  trayIcon.setContextMenu(
    Menu.buildFromTemplate([
      { label: 'Show', click: () => { mainWindow.show(); } },
      { label: 'Exit', click: () => { app.quit(); } }
    ]));

  // Restore the main window on double click
  trayIcon.on('double-click', (_event) => {
    mainWindow.show();
  });
}

