// ----------------------------------------
// The two-step button component class
// ----------------------------------------

// Keeps track of the state of a button that requires two presses to confirm.
// The confirmation step rolls back after some idle time.

export default class TwoStepButton {

  // Is the button waiting for confimation?
  waiting: boolean

  constructor() {
    this.waiting = false;
  }

  // Run the given callback when the user calls this function twice within 3
  // seconds. Reverts back the 'waiting' state if it times out.
  waitConfirmation = function (callback: () => unknown) {
    if (this.waiting) {
      callback();
    } else {
      this.waiting = true;
      setTimeout(() => this.waiting = false, 3000);
    }
  }
}