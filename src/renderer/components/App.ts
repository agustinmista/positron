import { v4 as uuid } from 'uuid';
import { type KeyValuePair, type HomeAssistantRequestParams, type HomeAssistantServer } from "../../lib/homeAssistant";

// ----------------------------------------
// Interfaces
// ----------------------------------------

// Shortcuts
export interface Shortcut {
  id: string,
  name: string,
  acc: string,
  enabled: boolean,
  params: HomeAssistantRequestParams,
  handler: { enabled: boolean, code: string }
}

// User configuration (saved to disk)
export interface UserConfig {
  server: HomeAssistantServer,
  shortcuts: [Shortcut],
  darkTheme: boolean,
  autoSave: boolean
}


// ----------------------------------------
// The main App component class
// ----------------------------------------

// Keeps track of the changes in the application's business logic.

export default class App {

  // The Home Assistant server to make requests to
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
  initialize = async function (): Promise<void> {

    // Read the user config from the config file
    await this.loadUserConfig();

    // Try to reinitialize any previously enabled shortcut
    this.shortcuts.forEach(async (shortcut: Shortcut) => {
      if (shortcut.enabled) {
        await this.disableShortcut(shortcut); // Needed in case the app is already running
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
        body: []
      },
      handler: {
        enabled: false,
        code: `res => res.ok ? 'Ok' : res.body`
      }
    });

    if (this.autoSave) {
      await this.saveUserConfig();
    }
  }

  // Duplicate a given shortcut
  duplicateShortcut = async function (shortcut: Shortcut): Promise<void> {

    this.shortcuts.push({
      id: uuid(),
      name: `${shortcut.name} (copy)`,
      acc: '',
      enabled: false,
      params: {
        method: shortcut.params.method,
        endpoint: shortcut.params.endpoint,
        body: shortcut.params.body
      },
      handler: {
        enabled: shortcut.handler.enabled,
        code: shortcut.handler.code
      }
    });

    if (this.autoSave) {
      await this.saveUserConfig();
    }
  }

  // Create a new shortcut
  deleteShortcut = async function (index: number): Promise<void> {

    this.shortcuts.splice(index, 1);

    if (this.autoSave) {
      await this.saveUserConfig();
    }
  }

  // Enable an existing shortcut
  // Returns false if there was a problem registering the shortcut accelerator
  enableShortcut = async function (shortcut: Shortcut): Promise<boolean> {

    // Validate the request body (shouldn't be needed)
    if (!this.isValidRequestBody(shortcut.params.body)) {
      return false;
    }

    // Try to register the shortcut in the main process
    shortcut.enabled = await window.api.registerShortcut(
      shortcut.acc,
      clone(this.server),
      clone(shortcut.params),
      clone(shortcut.handler.enabled ? shortcut.handler.code : null)
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
    let ok: boolean = true;

    if (!shortcut.enabled) {
      ok = await this.enableShortcut(shortcut);
    } else {
      await this.disableShortcut(shortcut);
    }

    if (this.autoSave) {
      await this.saveUserConfig();
    }

    return ok;
  }

  // Manually trigger a shortcut request
  // Returns a stringified JSON response
  triggerShortcut = async function (shortcut: Shortcut): Promise<string> {

    // Validate the request body (shouldn't be needed)
    if (!this.isValidRequestBody(shortcut.params.body)) {
      return 'Invalid request body';
    }

    // Send the request
    const response = await window.api.triggerRequest(
      clone(this.server),
      clone(shortcut.params),
      clone(shortcut.handler.enabled ? shortcut.handler.code : null)
    );
    return response;
  }

  // Toggle a custom shortcut handler
  toggleShortcutHandler = function (shortcut: Shortcut): void {
    shortcut.handler.enabled = !shortcut.handler.enabled;
  }

  // Add a key value pair to a shortcut's request body
  createRequestBodyEntry = function (shortcut: Shortcut): void {
    shortcut.params.body.push({ key: '', value: '' });
  }

  // Delete a key value pair from a shortcut's request body
  deleteRequestBodyEntry = function (shortcut: Shortcut, index: number): void {
    shortcut.params.body.splice(index, 1);
  }

  // Validate the key/value pairs of a shortcut's request body
  isValidRequestBody = function (body: Array<KeyValuePair>): boolean {

    // Extract the keys
    const keys: Array<string> = body.map(pair => pair.key);

    // Check empty keys
    if (keys.includes('')) {
      return false
    };

    // Check duplicates
    if ((new Set(keys)).size !== keys.length) {
      return false;
    };

    // All good otherwise
    return true;
  }

  // Save the user config to the config file
  saveUserConfig = async function (): Promise<void> {
    await window.api.saveUserConfig({
      server: clone(this.server),
      shortcuts: clone(this.shortcuts),
      darkTheme: clone(this.darkTheme),
      autoSave: clone(this.autoSave)
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

  // Toggle preferences

  toggleDarkTheme = function (): void {
    this.darkTheme = !this.darkTheme;
  }

  toggleAutoSave = function (): void {
    this.autoSave = !this.autoSave;
  }

  getAppVersion = async function (): Promise<string> {
    const version = await window.api.getAppVersion();
    return version;
  }

  openExternal = async function (url: string): Promise<void> {
    return window.api.openExternal(url);
  };

};

// ----------------------------------------
// Helpers
// ----------------------------------------

// Clone an object, removing all reactivity
function clone(obj: Object) {
  return JSON.parse(JSON.stringify(obj));
}

// Wait for a bit
function delay(ms: number) {
  return new Promise(resolve =>
    setTimeout(resolve, ms)
  );
}
