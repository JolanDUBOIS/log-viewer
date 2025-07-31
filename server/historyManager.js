import fs from 'fs';
import path from 'path';

const CONFIG_DIR = path.resolve('config');
const HISTORY_PATH = path.join(CONFIG_DIR, 'history.json');

const DEFAULT_HISTORY = { recent: [] };

export function loadHistory() {
  // Ensure config directory exists
  if (!fs.existsSync(CONFIG_DIR)) {
    console.log('Config directory missing, creating:', CONFIG_DIR);
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }

  // Create history file if missing
  if (!fs.existsSync(HISTORY_PATH)) {
    console.log('History file not found, creating default at:', HISTORY_PATH);
    fs.writeFileSync(HISTORY_PATH, JSON.stringify(DEFAULT_HISTORY, null, 2));
    return DEFAULT_HISTORY;
  }

  // Read and parse history
  const raw = fs.readFileSync(HISTORY_PATH, 'utf-8');
  console.log('Loaded history file:', HISTORY_PATH);
  try {
    const parsed = JSON.parse(raw);
    return parsed;
  } catch (e) {
    console.error('Failed to parse history JSON:', e);
    console.log('Returning default history:', DEFAULT_HISTORY);
    return DEFAULT_HISTORY;
  }
}

export function saveHistory(newHistory) {
  fs.writeFileSync(HISTORY_PATH, JSON.stringify(newHistory, null, 2));
}

export function touchHistoryPath(history, newPath, newAlias = null) {
  const now = new Date().toISOString();
  const existing = history.recent.find(entry => entry.path === newPath);

  if (existing) {
    existing.lastUsed = now;
    if (newAlias !== null && newAlias !== existing.alias) {
      existing.alias = newAlias;
    }
  } else {
    history.recent.unshift({ path: newPath, lastUsed: now, alias: newAlias || newPath });
    if (history.recent.length > 10) history.recent.length = 10;
  }

  // Sort history by lastUsed descending
  history.recent.sort((a, b) => new Date(b.lastUsed) - new Date(a.lastUsed));

  saveHistory(history);
}

// TODO - This script is very similar to configManager.js, consider refactoring to share code