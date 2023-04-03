import AutoLaunch from 'auto-launch';

const autoLauncher = new AutoLaunch({
  name: 'Positron',
  isHidden: true,
})

// Enable or disable auto launch on startup
export function setAutoLaunch(enable: boolean) {
  if (enable) {
    autoLauncher.enable()
  } else {
    autoLauncher.disable()
  }
}