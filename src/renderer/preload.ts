import { contextBridge, ipcRenderer } from 'electron';

import { type UserConfig } from '.';
import { type HomeAssistantServer, type HomeAssistantRequestParams } from '../lib/homeAssistant';

declare global {
  interface Window { api: typeof api }
}

export const api = {
  triggerRequest: async (server: HomeAssistantServer, params: HomeAssistantRequestParams) =>
    await ipcRenderer.invoke('api/triggerRequest', server, params),
  registerShortcut: async (acc: string, server: HomeAssistantServer, params: HomeAssistantRequestParams) =>
    await ipcRenderer.invoke('api/registerShortcut', acc, server, params),
  unregisterShortcut: async (acc: string) =>
    await ipcRenderer.invoke('api/unregisterShortcut', acc),
  isShortcutRegistered: async (acc: string) =>
    await ipcRenderer.invoke('api/isShortcutRegistered', acc),
  saveUserConfig: async (config: UserConfig) =>
    await ipcRenderer.invoke('api/saveUserConfig', config),
  loadUserConfig: async () =>
    await ipcRenderer.invoke('api/loadUserConfig'),
  openUserConfig: async () =>
    await ipcRenderer.invoke('api/openUserConfig')
};

contextBridge.exposeInMainWorld('api', api);
