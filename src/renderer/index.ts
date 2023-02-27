import alpine from 'alpinejs';
import { v4 as uuid } from 'uuid';

import { type HomeAssistantRequestParams, type HomeAssistantServer } from '../lib/homeAssistant';

import './css/style.css';

export interface Shortcut {
  id: string,
  name: string,
  acc: string,
  enabled: boolean,
  open: boolean,
  invalid: boolean,
  params: HomeAssistantRequestParams
}

export interface UserConfig {
  server: HomeAssistantServer,
  shortcuts: [Shortcut],
  darkTheme: boolean
}


// The app logic
const app = {

  // Persistent settings

  server: {
    protocol: 'http',
    hostname: 'localhost',
    port: 8123,
    token: ''
  },

  shortcuts: Array(0),

  darkTheme: true,

  // Dynamic state

  modals: {
    settings: {
      open: false
    },
    about: {
      open: false
    },
    response: {
      open: false,
      content: '',
    }
  },

  // Helper functions

  createShortcut() {
    const shortcut: Shortcut = {
      id: uuid(),
      name: 'New shortcut',
      acc: '',
      enabled: false,
      open: true,
      invalid: false,
      params: {
        method: 'POST',
        endpoint: '',
        body: ''
      }
    };
    this.shortcuts.push(shortcut);
  },

  deleteShortcut(shortcut: Shortcut) {
    this.shortcuts = this.shortcuts.filter((elem: Shortcut) => {
      return elem.id !== shortcut.id;
    });
  },

  async toggleShortcut(shortcut: Shortcut) {
    if (!shortcut.enabled) {
      const server = alpine.raw(this.server);
      const params = alpine.raw(shortcut.params);
      const registered = await window.api.registerShortcut(shortcut.acc, server, params);
      if (registered) {
        shortcut.enabled = true;
        shortcut.invalid = false;
      } else {
        shortcut.enabled = false;
        shortcut.invalid = true;
      }

    } else {
      await window.api.unregisterShortcut(shortcut.acc);
      shortcut.enabled = false;
    }
  },

  async triggerShortcut(shortcut: Shortcut) {
    const server = alpine.raw(this.server);
    const params = alpine.raw(shortcut.params);
    const response = await window.api.triggerRequest(server, params);
    console.log(response);
    this.modals.response = {
      open: true,
      content: JSON.stringify(response)
    };
  },

  async saveUserConfig() {
    await window.api.saveUserConfig({
      server: alpine.raw(this.server),
      shortcuts: alpine.raw(this.shortcuts),
      darkTheme: alpine.raw(this.darkTheme)
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

// Initialize Alpine
alpine.data('app', () => app);
alpine.start();