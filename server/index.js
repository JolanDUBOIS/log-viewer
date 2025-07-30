import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import open from 'open';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

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
app.get('/api/log', (req, res) => {
  fs.readFile(logFilePath, 'utf-8', (err, data) => {
    if (err) {
      res.status(500).send('Could not read log file.');
      return;
    }
    res.type('text/plain').send(data); // send raw text to frontend
  });
});

const configPath = path.join(__dirname, 'config/user.config.json');
app.get('/api/config', (req, res) => {
  if (!fs.existsSync(configPath)) {
    return res.json({ recentFile: logFilePath });
  }
  const config = JSON.parse(fs.readFileSync(configPath));
  res.json(config);
});

// Optional: save config
app.post('/api/config', express.json(), (req, res) => {
  fs.writeFileSync(configPath, JSON.stringify(req.body, null, 2));
  res.sendStatus(204);
});

// ---------- SERVER LAUNCH ----------
app.listen(port, () => {
  console.log(`Log viewer running at http://localhost:${port}`);
  open(`http://localhost:${port}`);
});
