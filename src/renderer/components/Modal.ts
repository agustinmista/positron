// ----------------------------------------
// The Modal component class
// ----------------------------------------

// Keeps track of the state of a modal dialog

export default class Modal {

  // Is the modal currently open?
  isOpen: boolean

  // Optional data to pass to the open method
  data: string

  // A promise that holds until the user presses close
  resolve: () => void

  constructor() {
    this.isOpen = false;
    this.data = null;
    this.resolve = null;
  }

  // ----------------------------------------
  // Open/close

  open = function (data: string = null): Promise<void> {
    this.isOpen = true;
    this.data = data;
    return new Promise(resolve => this.resolve = resolve);
  }

  close = async function (): Promise<void> {
    this.isOpen = false;
    await this.resolve(null);
  }
}