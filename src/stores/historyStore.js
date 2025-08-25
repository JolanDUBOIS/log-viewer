import { writable } from 'svelte/store';
import { getHistory, postAddToHistory, removeFromHistory } from '../api/history';

export const history = writable([]);

export async function loadHistory() {
  try {
    const historyData = await getHistory();
    history.set(historyData.history || historyData);
  } catch (err) {
    console.error('Failed to load history:', err);
  }
}

/**
 * Adds an item to history store and backend.
 * @param {{path: string, alias?: string, read_at?: string}} item
 * @returns {Promise<Object>} The added or updated history item from backend
 */
export async function addToHistory(item) {
  console.log('Adding to history:', item);
  if (!item || !item.path) {
    throw new Error('Invalid history item');
  }
  const newItem = await postAddToHistory(item);
  updateHistoryItem(newItem);
  return newItem;
}

function updateHistoryItem(newItem) {
  console.log('Updating history with item:', newItem);
  history.update(currentHistory => {
    const existingIndex = currentHistory.findIndex(item => item.path === newItem.path);
    if (existingIndex !== -1) {
      const updated = [...currentHistory];
      updated[existingIndex] = newItem;
      return updated;
    } else {
      return [...currentHistory, newItem];
    }
  });
}

export async function deleteHistoryItem(path) {
  console.log('Deleting history item with path:', path);
  if (!path) {
    throw new Error('Invalid path for history item removal');
  }
  const deletedItem = await removeFromHistory(path);
  removeItemFromHistory(deletedItem.path);
  return deletedItem;
}

function removeItemFromHistory(path) {
  history.update(currentHistory => {
    return currentHistory.filter(item => item.path !== path);
  });
}
