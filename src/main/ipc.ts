import { ipcMain, globalShortcut } from "electron";
import Store from 'electron-store';

import { homeAssistantRequest } from "../lib/homeAssistant";

// Initialize the IPC event handlers for API exported to the renderer process
export function initIPCHandlers(store: Store) {

  ipcMain.handle('api/triggerRequest', async (_event, server, params) => {
    console.log('HANDLING api/triggerRequest');
    console.log(`REQUESTING: ${JSON.stringify(params)}`);
    console.log(`FROM: ${JSON.stringify(server)}`);
    const response = await homeAssistantRequest(server, params);
    console.log(`REQUEST RESPONSE: ${JSON.stringify(response)}`);
    return response;
  });

  ipcMain.handle('api/registerShortcut', (_event, acc, server, params) => {
    console.log(`HANDLING api/registerShortcut (${acc})`);
    try {
      const registered = globalShortcut.register(acc, async () => {
        console.log(`TRIGGERED: ${acc}`);
        const response = await homeAssistantRequest(server, params);
        console.log(`REQUEST RESPONSE: ${JSON.stringify(response)}`);
        return response;
      });
      return registered;
    } catch (_error) {
      return false;
    }
  });

  ipcMain.handle('api/unregisterShortcut', (_event, acc) => {
    console.log(`HANDLING api/unregisterShortcut (${acc})`);
    globalShortcut.unregister(acc);
  });

  ipcMain.handle('api/isShortcutRegistered', (_event, acc) => {
    console.log(`HANDLING api/isShortcutRegistered (${acc})`);
    return globalShortcut.isRegistered(acc);
  });

  ipcMain.handle('api/saveUserConfig', (_event, config) => {
    console.log('HANDLING api/saveUserConfig');
    store.set('config', config);
  });

  ipcMain.handle('api/loadUserConfig', (_event) => {
    console.log('HANDLING api/loadUserConfig');
    return store.get('config');
  });

  ipcMain.handle('api/openUserConfig', (_event) => {
    console.log('HANDLING api/openUserConfig');
    store.openInEditor();
  });

}