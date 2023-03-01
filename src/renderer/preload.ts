import { contextBridge, ipcRenderer } from 'electron';

import { type HomeAssistantServer, type HomeAssistantRequestParams } from '../lib/homeAssistant';
import { type UserConfig } from './components/App';

// ----------------------------------------
// IPC interface between main and renderer
// ----------------------------------------

export const api = {
  triggerRequest: async (server: HomeAssistantServer, params: HomeAssistantRequestParams, handler: string) =>
    await ipcRenderer.invoke('api/triggerRequest', server, params, handler),
  registerShortcut: async (acc: string, server: HomeAssistantServer, params: HomeAssistantRequestParams, handler: string) =>
    await ipcRenderer.invoke('api/registerShortcut', acc, server, params, handler),
  unregisterShortcut: async (acc: string) =>
    await ipcRenderer.invoke('api/unregisterShortcut', acc),
  isShortcutRegistered: async (acc: string) =>
    await ipcRenderer.invoke('api/isShortcutRegistered', acc),
  saveUserConfig: async (config: UserConfig) =>
    await ipcRenderer.invoke('api/saveUserConfig', config),
  loadUserConfig: async () =>
    await ipcRenderer.invoke('api/loadUserConfig'),
  openUserConfig: async () =>
    await ipcRenderer.invoke('api/openUserConfig'),
  getAppVersion: async () =>
    await ipcRenderer.invoke('api/getAppVersion')
};

contextBridge.exposeInMainWorld('api', api);

// Declare the type of the API so TypeScript doesn't complain
declare global {
  interface Window { api: typeof api }
}