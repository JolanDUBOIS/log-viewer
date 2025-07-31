import express from 'express';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { fileURLToPath } from 'url';
// import open from 'open';
import { loadUserConfig, saveUserConfig } from './configManager.js';
import { loadHistory, saveHistory, touchHistoryPath } from './historyManager.js';
import cors from 'cors';

console.log('Starting server...');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001;

// Enable CORS
app.use(cors());

let history = loadHistory();
let sessionColumnFilters = {};

// ---------- CLI ARG PARSING ----------
const cliArgs = process.argv.slice(2);
let logFilePath = null;

if (cliArgs[0] && fs.existsSync(cliArgs[0])) {
  logFilePath = path.resolve(cliArgs[0]);
  touchHistoryPath(history, logFilePath); 
  saveHistory(history);
} else {
  console.warn('No valid log file path provided at startup, starting with empty path.');
}

// ---------- PATH MANAGEMENT ----------

function expandHomeDir(filepath) {
  if (filepath.startsWith('~')) {
    return path.join(os.homedir(), filepath.slice(1));
  }
  return filepath;
}

// ---------- STATIC FRONTEND ----------
const frontendDir = path.join(__dirname, '../dist');
app.use(express.static(frontendDir));

// ---------- API ----------

// Log file endpoint
app.get('/api/log', (req, res) => {
  if (!logFilePath) {
    res.status(400).send('No log file path set.');
    return;
  }
  console.log('Reading log from:', logFilePath);
  fs.readFile(logFilePath, 'utf-8', (err, data) => {
    if (err) {
      res.status(500).send('Could not read log file.');
      return;
    }
    res.type('text/plain').send(data);
  });
});

// Load or create user config on server start
let userConfig = loadUserConfig();

// Get current config
app.get('/api/user-config', (req, res) => {
  res.json(userConfig);
});

// Update config and save it
app.post('/api/user-config', express.json(), (req, res) => {
  userConfig = req.body;
  saveUserConfig(userConfig);
  res.sendStatus(204);
});

// Get current history
app.get('/api/history', (req, res) => {
  res.json(history);
});

// Update history and save it
app.post('/api/history', express.json(), (req, res) => {
  history = req.body;
  saveHistory(history);
  res.sendStatus(204);
});

// Get current path
app.get('/api/current-path', (req, res) => {
  res.json({ path: logFilePath });
});

// Update current path
app.post('/api/current-path', express.json(), (req, res) => {
  let newPath = req.body.path;
  newPath = expandHomeDir(newPath);
  if (newPath && fs.existsSync(newPath)) {
    logFilePath = path.resolve(newPath);
    touchHistoryPath(history, logFilePath);  // Update history with new path
    res.sendStatus(204);
  } else {
    res.status(400).send('Invalid path provided: ' + newPath);
  }
});

// Get current session parameters
app.get('/api/session-params', (req, res) => {
  res.json(sessionColumnFilters);
});

// Update session parameters (no save logic here)
app.post('/api/session-params', express.json(), (req, res) => {
  sessionColumnFilters = req.body;
});

// ---------- SERVER LAUNCH ----------
app.listen(port, () => {
  console.log(`Log viewer running at http://localhost:${port}`);
  // open(`http://localhost:${port}`);
});
