import { app, ipcMain, globalShortcut, Notification, shell } from "electron";
import Store from 'electron-store';
import vm from 'vm';

import { homeAssistantRequest, type HomeAssistantRequestParams, type HomeAssistantResponse, type HomeAssistantServer } from "../lib/homeAssistant";
import { setAutoLaunch } from "./autolaunch";

// ----------------------------------------
// IPC backend implementation
// ----------------------------------------

// Initialize the IPC event handlers for API exported to the renderer process
export function initIPCHandlers(store: Store) {

  ipcMain.handle('api/triggerRequest', async (_event, server, params, handler = null) => {
    console.log('HANDLING api/triggerRequest');
    const response: string = await handleShortcutRequest(server, params, handler);
    return response;
  });

  ipcMain.handle('api/registerShortcut', (_event, acc, server, params, handler) => {
    console.log(`HANDLING api/registerShortcut (${acc})`);
    try {
      const registered = globalShortcut.register(acc, async () => {
        console.log(`TRIGGERED: ${acc}`);
        await handleShortcutRequest(server, params, handler);
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

  ipcMain.handle('api/getAppVersion', (_event) => {
    console.log('HANDLING api/getAppVersion');
    return app.getVersion();
  });

  ipcMain.handle('api/openExternal', (_event, url) => {
    console.log(`HANDLING api/openExternal ${url}`);
    return shell.openExternal(url);
  });

  ipcMain.handle('api/setAutoLaunch', (_event, enabled) => {
    console.log(`HANDLING api/setAutoLaunch (${enabled})`);
    return setAutoLaunch(enabled);
  });

}

// ----------------------------------------
// Helpers
// ----------------------------------------

async function handleShortcutRequest(server: HomeAssistantServer, params: HomeAssistantRequestParams, handler: string): Promise<string> {
  const response = await makeRequest(server, params);
  if (handler) {
    const customResponse = runResponseHandler(handler, response);
    sendNotification(customResponse);
    return customResponse;
  } else {
    const jsonResponse = JSON.stringify(response);
    // sendNotification(jsonResponse); // Maybe a good idea too
    return jsonResponse;
  }
}

// Make a request to the Home Assistant server
async function makeRequest(server: HomeAssistantServer, params: HomeAssistantRequestParams): Promise<HomeAssistantResponse> {
  console.log(`REQUESTING: ${JSON.stringify(params)}`);
  console.log(`FROM: ${JSON.stringify(server)}`);
  const response = await homeAssistantRequest(server, params);
  console.log(`RESPONSE: ${JSON.stringify(response)}`);
  return response;
}

// Run a custom response handler
function runResponseHandler(handler: string, response: HomeAssistantResponse): string {
  console.log(`RUNNING HANDLER CODE: ${handler}`);
  try {
    const handlerFunction = evalCustomFunction(handler);
    const customResponse = handlerFunction(response);
    console.log(`CUSTOM HANDLER OUTPUT: ${customResponse}`);
    return customResponse;
  } catch (error) {
    console.log(`CUSTOM HANDLER FAILED: ${error.message}`);
    const errorResponse = `Custom response handler failed: ${error.message}`;
    return errorResponse;
  }
}

// Send a new notification
function sendNotification(message: string): void {
  console.log(`SENDING NOTIFICATION: ${message}`);
  new Notification({ body: message, silent: true }).show();
}

// Run a custom function string in an isolated context
function evalCustomFunction(code: string): ((response: HomeAssistantResponse) => string) {
  const ctx = {}; // We might want to add extra capabilities in the future
  vm.createContext(ctx);
  const fun = vm.runInContext(code, ctx);
  return fun;
}

