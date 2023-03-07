// ----------------------------------------
// The busy button component class
// ----------------------------------------

// Keeps track of the state of a button that gets disable while busy waiting for
// some async operation.

export default class BusyButton {

  // Is the button busy?
  busy: boolean

  constructor() {
    this.busy = false;
  }

  // Stay busy until the given callback finishes executing
  busyWhile = async function (callback: () => Promise<unknown>) {
    this.busy = true;
    const res = await callback()
    this.busy = false;
    return res;
  }

}