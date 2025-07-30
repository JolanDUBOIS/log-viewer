import { writable, get } from 'svelte/store';

export const userConfig = writable({});

export async function loadUserConfig() {
  try {
    const res = await fetch('/api/user-config');
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

export async function updateAndSaveUserConfig(newUserConfig) {
  // Merge newUserConfig into the existing userConfig store
  const currentConfig = get(userConfig);
  const updatedConfig = { ...currentConfig, ...newUserConfig };

  // Update the store immediately
  userConfig.set(updatedConfig);

  // Save to backend
  const res = await fetch('/api/user-config', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedConfig),
  });

  if (!res.ok) {
    console.error('Failed to save config');
  }
}