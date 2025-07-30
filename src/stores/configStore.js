import { writable } from 'svelte/store';

export const userConfig = writable(null);

export async function loadConfig() {
  try {
    const res = await fetch('/api/config');
    if (res.ok) {
      let configData = await res.json();
    
      const snapshot = JSON.parse(JSON.stringify(configData));
      console.log('Loaded config snapshot:', snapshot);
    
      userConfig.set(configData);
    } else {
      const errorText = await res.text();
      console.error('Failed to load config:', res.status, errorText);
    }
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

export async function saveConfig(newConfig) {
  const res = await fetch('/api/config', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newConfig)
  });

  if (res.ok) {
    userConfig.set(newConfig);
  } else {
    console.error('Failed to save config');
  }
}
