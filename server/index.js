import path from 'path';
import { fileURLToPath } from 'url';

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

app.listen(port, () => {
  console.log(`Log viewer running at http://localhost:${port}`);
});
