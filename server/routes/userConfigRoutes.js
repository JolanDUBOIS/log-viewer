import express from 'express';
import { saveUserConfig } from '../managers/userConfigManager.js';


export default function createUserConfigRouter({ userConfig }) {
  const router = express.Router();

  router.get('/columns', (req, res) => {
    console.log('Fetching user config');
    res.json(userConfig.columns);
  });

  // Update config and save it
  router.post('/columns', express.json(), (req, res) => {
    userConfig.columns = req.body;
    saveUserConfig(userConfig);
    console.log('User config updated');
    res.sendStatus(204);
  });

  return router;
}