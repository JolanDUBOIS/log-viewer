import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
// import open from 'open';
import { loadUserConfig, saveUserConfig } from './configManager.js';
import cors from 'cors';

console.log('Starting server...');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001;

// Enable CORS
app.use(cors());

// ---------- CLI ARG PARSING ----------
const cliArgs = process.argv.slice(2);
const logFilePath = cliArgs[0] ? path.resolve(cliArgs[0]) : null;

if (!logFilePath || !fs.existsSync(logFilePath)) {
  console.error('Please provide a valid path to a log file.');
  process.exit(1);
}

// ---------- STATIC FRONTEND ----------
const frontendDir = path.join(__dirname, '../dist');
app.use(express.static(frontendDir));

// ---------- API ----------

// Log file endpoint
app.get('/api/log', (req, res) => {
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

// Load or create session parameters
let sessionColumnFilters = {};  // For now, the session parameters are only composed of column filters

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
