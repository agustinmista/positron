// ----------------------------------------
// The debounce button component class
// ----------------------------------------

// Sets a delay between button presses

export default class DebouncedButton {

  // Is the button currently busy?
  busy: boolean

  constructor() {
    this.busy = false;
  }

  // Stay busy for `ms` millisecodns after the given callback finishes executing
  debounce = async function (ms: number, callback: () => Promise<unknown>) {
    this.busy = true;
    const res = await callback();
    await delay(ms);
    this.busy = false;
    return res;
  }

}

// Wait for a bit
function delay(ms: number) {
  return new Promise(resolve =>
    setTimeout(resolve, ms)
  );
}