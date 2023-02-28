// ----------------------------------------
// The Modal component class
// ----------------------------------------

// Keeps track of the state of a modal dialog

export default class Modal {

  // Is the modal currently open?
  isOpen: boolean

  // Optional data to pass to the open method
  data: string

  constructor() {
    this.isOpen = false;
    this.data = null;
  }

  // ----------------------------------------
  // Open/close

  open = function (data: string = null) {
    this.isOpen = true;
    this.data = data;
  }

  close = function () {
    this.isOpen = false;
  }
}