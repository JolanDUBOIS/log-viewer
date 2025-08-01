import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

import cors from 'cors';
import express from 'express';

import { loadUserConfig } from './managers/userConfigManager.js';
import { loadHistory } from './managers/historyManager.js';
import { trySetLogPath } from './managers/logsManager.js';

import createSessionRouter from './routes/sessionRoutes.js';
import createLogsRouter from './routes/logsRoutes.js';
import createUserConfigRouter from './routes/userConfigRoutes.js';
import createHistoryRouter from './routes/historyRoutes.js';

console.log('Starting server...');

let logFilePath = null;
let sessionFilters = {};
let userConfig = loadUserConfig();
let logFileHistory = loadHistory();

let logFilePathRef = { value: logFilePath };

const cliArgs = process.argv.slice(2);
if (cliArgs[0]) {
  const ok = trySetLogPath(cliArgs[0], logFilePathRef, logFileHistory);
  if (!ok) {
    console.warn('Invalid log path at startup, using empty path.');
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDir = path.join(__dirname, '../dist');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.static(frontendDir));

app.use('/api/logs', createLogsRouter({ logFilePathRef }));
app.use('/api/user-config', createUserConfigRouter({ userConfig }));
app.use('/api/history', createHistoryRouter({ logFileHistory }));
app.use('/api/session', createSessionRouter({ sessionFilters, logFilePathRef, logFileHistory }));

const url = `http://localhost:${port}`

app.listen(port, () => {
  console.log(`Log viewer running at ${url}`);
});

const isDev = cliArgs.includes('--dev');
const frontendPort = isDev ? 5173 : port;
const frontendUrl = `http://localhost:${frontendPort}`

if (cliArgs.includes('--app')) {  // if (cliArgs.includes('--app') || userConfig.openInChromeless) for when I change userConfig structure
  let launchCmd;

  if (os.platform() === 'win32') {
    launchCmd = `start chrome --app="${frontendUrl}"`;  // Native Windows (not WSL)
  } else if (os.platform() === 'darwin') {
    launchCmd = `open -a "Google Chrome" --args --app="${frontendUrl}"`;  // macOS
  } else if (os.platform() === 'linux') {
    // WSL2 workaround — assumes Chrome is installed on Windows and accessible via this path
    // TODO - differentiate between WSL and native Linux
    launchCmd = `/mnt/c/Program\\ Files/Google/Chrome/Application/chrome.exe --app="${frontendUrl}"`;
    // Real linux would use: launchCmd = `google-chrome --app="${frontendUrl}"`
  } else {
    console.warn('Unsupported platform for launching Chrome in app mode');
  }

  exec(launchCmd, (err) => {
    if (err) console.error('Failed to launch Chrome in app mode:', err);
  });
}