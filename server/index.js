import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import open from 'open';
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

// Load or create config on server start
let userConfig = loadUserConfig();

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

// Get current config
app.get('/api/config', (req, res) => {
  res.json(userConfig);
});

// Update config and save it
app.post('/api/config', express.json(), (req, res) => {
  userConfig = req.body;
  saveUserConfig(userConfig);
  res.sendStatus(204);
});

// ---------- SERVER LAUNCH ----------
app.listen(port, () => {
  console.log(`Log viewer running at http://localhost:${port}`);
  // open(`http://localhost:${port}`);
});
