import { v4 as uuid } from 'uuid';
import { type HomeAssistantRequestParams, type HomeAssistantServer } from "../../lib/homeAssistant";

export interface Shortcut {
  id: string,
  name: string,
  acc: string,
  enabled: boolean,
  params: HomeAssistantRequestParams
}

export interface UserConfig {
  server: HomeAssistantServer,
  shortcuts: [Shortcut],
  darkTheme: boolean
}

// Clone an object, loosing all reactivity
function clone(obj: Object) {
  return JSON.parse(JSON.stringify(obj));
}

// The app logic
export const app = {

  // Persistent app settings

  server: {
    protocol: 'http',
    hostname: 'localhost',
    port: 8123,
    token: ''
  },

  shortcuts: Array(0),

  darkTheme: true,

  // Helper functions

  async createShortcut() {
    const shortcut: Shortcut = {
      id: uuid(),
      name: 'New shortcut',
      acc: '',
      enabled: false,
      params: {
        method: 'POST',
        endpoint: '',
        body: ''
      }
    };
    this.shortcuts.push(shortcut);
    await this.saveUserConfig();
  },

  async deleteShortcut(shortcut: Shortcut) {
    this.shortcuts = this.shortcuts.filter((elem: Shortcut) => {
      return elem.id !== shortcut.id;
    });
    await this.saveUserConfig();
  },

  async toggleShortcut(shortcut: Shortcut) {
    if (!shortcut.enabled) {
      const server = clone(this.server);
      const params = clone(shortcut.params);
      shortcut.enabled = await window.api.registerShortcut(shortcut.acc, server, params);
      if (shortcut.enabled) {
        await this.saveUserConfig();
        return true;
      } else {
        return false;
      }
    } else {
      await window.api.unregisterShortcut(shortcut.acc);
      shortcut.enabled = false;
      await this.saveUserConfig();
      return true;
    }
  },

  async triggerShortcut(shortcut: Shortcut) {
    const server = clone(this.server);
    const params = clone(shortcut.params);
    const response = await window.api.triggerRequest(server, params);
    return JSON.stringify(response);
  },

  async saveUserConfig() {
    await window.api.saveUserConfig({
      server: clone(this.server),
      shortcuts: clone(this.shortcuts),
      darkTheme: clone(this.darkTheme)
    });
  },

  async loadUserConfig() {
    const config: UserConfig = await window.api.loadUserConfig();
    this.server = config.server;
    this.shortcuts = config.shortcuts;
    this.darkTheme = config.darkTheme;
  },

  async openUserConfig() {
    await window.api.openUserConfig();
  },

  toggleDarkTheme() {
    this.darkTheme = !this.darkTheme;
  }

};