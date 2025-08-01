import express from 'express';
import { saveUserConfig } from '../managers/userConfigManager.js';


export default function createUserConfigRouter({ userConfig }) {
  const router = express.Router();

  router.get('/', (req, res) => {
    console.log('Fetching user config');
    res.json(userConfig);
  });

  // Update config and save it
  router.post('/', express.json(), (req, res) => {
    userConfig = req.body;
    saveUserConfig(userConfig);
    console.log('User config updated');
    res.sendStatus(204);
  });

  return router;
}