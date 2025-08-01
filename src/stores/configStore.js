import { writable } from 'svelte/store';

export const userConfigColumns = writable({}); // Contains for each column: alias, shown, orderBy, type

export async function loadUserConfigColumns() {
  try {
    const res = await fetch('/api/user-config/columns');
    if (res.ok) {
      let configData = await res.json();
    
      const snapshot = JSON.parse(JSON.stringify(configData));
      console.log('Loaded config snapshot:', snapshot);
    
      userConfigColumns.set(configData);
    } else {
      const errorText = await res.text();
      console.error('Failed to load config:', res.status, errorText);
    }
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

export async function updateAndSaveUserConfigColumns(newUserConfigColumns) {
  userConfigColumns.set(newUserConfigColumns);

  // Save to backend
  const res = await fetch('/api/user-config/columns', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newUserConfigColumns),
  });

  if (!res.ok) {
    console.error('Failed to save config');
  }
}