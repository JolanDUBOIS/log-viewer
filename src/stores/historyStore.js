import { writable, get } from 'svelte/store';

export const history = writable({ recent: [] });
export const currentPath = writable('');

// History management

function orderHistoryByLastUsed(historyObj) {
  return {
    recent: [...historyObj.recent].sort((a, b) => {
      const dateA = new Date(a.lastUsed).getTime() || 0;
      const dateB = new Date(b.lastUsed).getTime() || 0;
      return dateB - dateA;
    })
  };
}

export async function loadHistory() {
  try {
    const res = await fetch('/api/history');
    if (res.ok) {
      let historyData = await res.json();
      historyData = orderHistoryByLastUsed(historyData); // order before setting
      console.log('Loaded history:', historyData);
      history.set(historyData);
    } else {
      const errorText = await res.text();
      console.error('Failed to load history:', res.status, errorText);
    }
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

export async function updateAndSaveHistory(newHistory) {
  const orderedHistory = orderHistoryByLastUsed(newHistory);
  history.set(orderedHistory);
  
  // Save to backend
  const res = await fetch('/api/history', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderedHistory),
  });

  if (!res.ok) {
    console.error('Failed to save history');
  }
}

export async function deleteHistoryItem(itemPath) {
  const currentHistory = get(history);
  const updatedHistory = {
    recent: currentHistory.recent.filter(item => item.path !== itemPath)
  };
  
  await updateAndSaveHistory(updatedHistory);
}

// Current path management

export async function loadCurrentPath() {
  try {
    const res = await fetch('/api/session/path');
    if (res.ok) {
      const data = await res.json();
      currentPath.set(data.path);
    } else {
      const errorText = await res.text();
      console.error('Failed to load current path:', res.status, errorText);
    }
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

export async function updateCurrentPath(newPath) {
  try {
    const res = await fetch('/api/session/path', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: newPath }),
    });

    if (res.ok) {
      currentPath.set(newPath);
      await loadHistory(); // Wait for updated history from backend
    } else {
      const errorText = await res.text();
      console.error('Failed to update current path:', res.status, errorText);
    }
  } catch (err) {
    console.error('Fetch error:', err);
  }
}