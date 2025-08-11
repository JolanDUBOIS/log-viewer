import express from 'express';
import { saveHistory } from '../managers/historyManager.js';

export default function createHistoryRouter({ logFileHistory }) {
  const router = express.Router();

  router.get('/', (req, res) => {
    console.log('Fetching log file history');
    res.json(logFileHistory);
  });
  
  // Update history and save it
  router.post('/', express.json(), (req, res) => {
    logFileHistory = req.body;
    saveHistory(logFileHistory);
    console.log('Log file history updated');
    res.sendStatus(204);
  });

  return router;
}