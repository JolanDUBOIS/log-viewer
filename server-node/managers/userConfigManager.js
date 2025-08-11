import fs from 'fs';
import path from 'path';

const CONFIG_DIR = path.resolve('config');
const USER_CONFIG_PATH = path.join(CONFIG_DIR, 'user.config.json');

const DEFAULT_CONFIG = {};

export function loadUserConfig() {
  // Create config directory if needed
  if (!fs.existsSync(CONFIG_DIR)) {
    console.log('Config directory missing, creating:', CONFIG_DIR);
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }

  // Create config file if it doesn't exist
  if (!fs.existsSync(USER_CONFIG_PATH)) {
    console.log('User config file not found, creating default at:', USER_CONFIG_PATH);
    fs.writeFileSync(USER_CONFIG_PATH, JSON.stringify(DEFAULT_CONFIG, null, 2));
    console.log('Default config:', DEFAULT_CONFIG);
    return DEFAULT_CONFIG;
  }

  // Else read and parse it
  const raw = fs.readFileSync(USER_CONFIG_PATH, 'utf-8');
  console.log('Loaded user config file:', USER_CONFIG_PATH);
  try {
    const parsed = JSON.parse(raw);
    return parsed;
  } catch (e) {
    console.error('Failed to parse user config JSON:', e);
    console.log('Returning default config:', DEFAULT_CONFIG);
    return DEFAULT_CONFIG;
  }
}

export function saveUserConfig(newConfig) {
  fs.writeFileSync(USER_CONFIG_PATH, JSON.stringify(newConfig, null, 2));
}
