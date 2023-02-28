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

export default class App {

  // The HomeAssistant server to make requests to
  server: HomeAssistantServer

  // The user-defined shortcuts
  shortcuts: Array<Shortcut>

  // Other user preferences
  darkTheme: boolean
  autoSave: boolean

  // App constructor
  constructor() {
    this.server = {
      protocol: 'http',
      hostname: 'localhost',
      port: 8123,
      token: ''
    };
    this.shortcuts = Array(0);
    this.darkTheme = true;
    this.autoSave = true;
  }

  // ----------------------------------------
  // Public methods

  // Read the user config file and initialize the app state
  initialize = async function(): Promise<void> {

    // Read the user config from the config file
    await this.loadUserConfig();

    // Try to reinitialize any previously enabled shortcut
    this.shortcuts.forEach(async (shortcut: Shortcut) => {
      if (shortcut.enabled) {
        await this.enableShortcut(shortcut);
      }
    });
  }

  // Create a new empty shortcut
  createShortcut = async function (): Promise<void> {

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
  }

  // Create a new shortcut
  deleteShortcut = async function (shortcut: Shortcut): Promise<void> {

    this.shortcuts = this.shortcuts.filter((elem: Shortcut) => {
      return elem.id !== shortcut.id;
    });

    if (this.autoSave) {
      await this.saveUserConfig();
    }
  }

  // Enable an existing shortcut
  // Returns false if there was a problem registering the shortcut accelerator
  enableShortcut = async function (shortcut: Shortcut): Promise<boolean> {

    // Try to register the shortcut in the main process
    shortcut.enabled = await window.api.registerShortcut(
      shortcut.acc,
      clone(this.server),
      clone(shortcut.params)
    );

    return shortcut.enabled;
  }

  // Disable an existing shortcut
  disableShortcut = async function (shortcut: Shortcut): Promise<void> {

    // Unregister the shortcut in the main process
    await window.api.unregisterShortcut(shortcut.acc);
    shortcut.enabled = false;
  }


  // Toggle the state of an existing shortcut
  toggleShortcut = async function (shortcut: Shortcut): Promise<boolean> {
    let ok: boolean;

    if (!shortcut.enabled) {
      ok = await this.enableShortcut(shortcut);
    } else {
      await this.disableShortcut(shortcut);
      ok = true;
    }

    if (this.autoSave) {
      await this.saveUserConfig();
    }

    return ok;
  }

  // Manually trigger a shortcut request
  // Returns a stringified JSON response
  triggerShortcut = async function (shortcut: Shortcut): Promise<string> {
    const response = await window.api.triggerRequest(
      clone(this.server),
      clone(shortcut.params)
    );
    return JSON.stringify(response);
  }

  // Save the user config to the config file
  saveUserConfig = async function (): Promise<void> {
    await window.api.saveUserConfig({
      server: clone(this.server),
      shortcuts: clone(this.shortcuts),
      darkTheme: clone(this.darkTheme)
    });
  }

  // Load the user config from the config file
  loadUserConfig = async function (): Promise<void> {
    const config: UserConfig = await window.api.loadUserConfig();
    this.server = config.server;
    this.shortcuts = config.shortcuts;
    this.darkTheme = config.darkTheme;
  }

  // Open the config file using the OS editor
  openUserConfig = async function (): Promise<void> {
    await window.api.openUserConfig();
  }

  // Toggle dark mode
  toggleDarkTheme = function (): void {
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