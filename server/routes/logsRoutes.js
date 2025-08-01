import fs from 'fs';
import express from 'express';

export default function createLogsRouter({ logFilePathRef }) {
  const router = express.Router();

  router.get('/', (req, res) => {
    if (!logFilePathRef.value) {
      res.status(400).send('No log file path set.');
      return;
    }
    console.log('Reading log from:', logFilePathRef.value);
    fs.readFile(logFilePathRef.value, 'utf-8', (err, data) => {
      if (err) {
        res.status(500).send('Could not read log file.');
        return;
      }
      res.type('text/plain').send(data);
    });
  });

  return router;
}