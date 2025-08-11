import path from 'path';
import { fileURLToPath } from 'url';

import cors from 'cors';
import express from 'express';

import { parseArgs } from './cli/parseArgs.js';
import { setupLogPath } from './startup/setupLogPath.js';
import { launchChromelessApp } from './startup/launchHeadlessChromeApp.js';

import { loadUserConfig } from './managers/userConfigManager.js';
import { loadHistory } from './managers/historyManager.js';

import createSessionRouter from './routes/sessionRoutes.js';
import createLogsRouter from './routes/logsRoutes.js';
import createUserConfigRouter from './routes/userConfigRoutes.js';
import createHistoryRouter from './routes/historyRoutes.js';

console.log('Starting server...');

const cliOptions = parseArgs();

let logFilePath = null;
let sessionFilters = {};
let userConfig = loadUserConfig();
let logFileHistory = loadHistory();

let logFilePathRef = { value: logFilePath };

setupLogPath(cliOptions.logPath, logFilePathRef, logFileHistory);

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

const isDev = cliOptions.dev;
const frontendPort = isDev ? 5173 : port;
const frontendUrl = `http://localhost:${frontendPort}`

if (cliOptions.app) {
  launchChromelessApp(frontendUrl);
}