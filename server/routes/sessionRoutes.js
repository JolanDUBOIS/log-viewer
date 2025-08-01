import express from 'express';
import { trySetLogPath } from '../managers/logsManager.js';

export default function createSessionRouter({ sessionFilters, logFilePathRef, logFileHistory }) {
  const router = express.Router();

  router.get('/filters', (req, res) => {
    console.log('Fetching session parameters');
    res.json(sessionFilters);
  });

  router.post('/filters', express.json(), (req, res) => {
    console.log('Updating session parameters');
    sessionFilters = req.body;
    res.sendStatus(204);
  });

  router.get('/path', (req, res) => {
    console.log('Fetching current log file path');
    res.json({ path: logFilePathRef.value });
  });

  router.post('/path', express.json(), (req, res) => {
    const ok = trySetLogPath(req.body.path, logFilePathRef, logFileHistory);
    if (ok) {
      res.sendStatus(204);
    } else {
      res.status(400).send('Invalid path provided');
    }
  });

  return router;
}