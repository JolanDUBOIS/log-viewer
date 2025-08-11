import os from 'os';
import { exec } from 'child_process';

export function launchChromelessApp(frontendUrl) {
  console.log('Launching headless Chrome in app mode...');
  let launchCmd;

  if (os.platform() === 'win32') {
    launchCmd = `start chrome --app="${frontendUrl}"`;
  } else if (os.platform() === 'darwin') {
    launchCmd = `open -a "Google Chrome" --args --app="${frontendUrl}"`;
  } else if (os.platform() === 'linux') {
    // WSL2 workaround
    launchCmd = `/mnt/c/Program\\ Files/Google/Chrome/Application/chrome.exe --app="${frontendUrl}"`;
    // Consider: detect native Linux and switch to `google-chrome --app="${frontendUrl}`
  } else {
    console.warn('Unsupported platform for launching Chrome in app mode');
    return;
  }

  exec(launchCmd, (err) => {
    if (err) console.error('Failed to launch Chrome in app mode:', err);
  });
}
