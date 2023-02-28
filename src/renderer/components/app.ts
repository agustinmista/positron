import { v4 as uuid } from 'uuid';
import { type HomeAssistantRequestParams, type HomeAssistantServer } from "../../lib/homeAssistant";

// ----------------------------------------
// Interfaces
// ----------------------------------------

// Shortcuts
export interface Shortcut {
  id: string,
  name: string,
  acc: string,
  enabled: boolean,
  params: HomeAssistantRequestParams
}

// User configuration (saved to disk)
export interface UserConfig {
  server: HomeAssistantServer,
  shortcuts: [Shortcut],
  darkTheme: boolean
}


// ----------------------------------------
// The main app component
// ----------------------------------------

export const app = {

  // ----------------------
  // Persistent user config

  server: {
    protocol: 'http',
    hostname: 'localhost',
    port: 8123,
    token: ''
  },

  shortcuts: Array(0),

  darkTheme: true,

  autoSave: true,

  // ----------------------
  // Helper functions

  // Create a new empty shortcut
  async createShortcut(): Promise<void> {

    this.shortcuts.push({
      id: uuid(),
      name: 'New shortcut',
      acc: '',
      enabled: false,
      params: {
        method: 'POST',
        endpoint: '',
        body: ''
      }
    });

    if (this.autoSave) {
      await this.saveUserConfig();
    }
  },

  // Create a new shortcut
  async deleteShortcut(shortcut: Shortcut): Promise<void> {

    this.shortcuts = this.shortcuts.filter((elem: Shortcut) => {
      return elem.id !== shortcut.id;
    });

    if (this.autoSave) {
      await this.saveUserConfig();
    }
  },

  // Toggle the state of an existing shortcut
  // Returns false if there was a problem registering the shortcut accelerator
  async toggleShortcut(shortcut: Shortcut): Promise<boolean> {

    if (!shortcut.enabled) { // The shortcut was previously disabled

      // Try to register the shortcut in the main process
      shortcut.enabled = await window.api.registerShortcut(
        shortcut.acc,
        clone(this.server),
        clone(shortcut.params)
      );

      if (shortcut.enabled) { // The shortcut got registered
        if (this.autoSave) {
          await this.saveUserConfig();
        }
        return true;

      } else { // The shortcut was invalid or already taken
        return false;
      }

    } else {// If the shortcut was previously enabled

      await window.api.unregisterShortcut(shortcut.acc);
      shortcut.enabled = false;

      if (this.autoSave) {
        await this.saveUserConfig();
      }

      return true;
    }
  },

  // Manually trigger a shortcut request
  // Returns a stringified JSON response
  async triggerShortcut(shortcut: Shortcut): Promise<string> {
    const server = clone(this.server);
    const params = clone(shortcut.params);
    const response = await window.api.triggerRequest(server, params);
    return JSON.stringify(response);
  },

  // Save the user config to the config file
  async saveUserConfig() {
    await window.api.saveUserConfig({
      server: clone(this.server),
      shortcuts: clone(this.shortcuts),
      darkTheme: clone(this.darkTheme)
    });
  },

  // Load the user config from the config file
  async loadUserConfig() {
    const config: UserConfig = await window.api.loadUserConfig();
    this.server = config.server;
    this.shortcuts = config.shortcuts;
    this.darkTheme = config.darkTheme;
  },

  // Open the config file using the OS editor
  async openUserConfig() {
    await window.api.openUserConfig();
  },

  // Toggle dark mode
  toggleDarkTheme() {
    this.darkTheme = !this.darkTheme;
  }

};

// ----------------------------------------
// Helpers
// ----------------------------------------

// Clone an object, removing all reactivity
function clone(obj: Object) {
  return JSON.parse(JSON.stringify(obj));
}