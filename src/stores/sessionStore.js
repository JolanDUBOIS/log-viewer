import { writable } from 'svelte/store';

export const sessionFilters = writable({});

export async function loadSessionFilters() {
  try {
    const res = await fetch('/api/session/filters');
    if (res.ok) {
      const filtersData = await res.json();
      sessionFilters.set(filtersData);
    } else {
      const errorText = await res.text();
      console.error('Failed to load session filters:', res.status, errorText);
    }
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

export async function updateSessionFilters(newSessionFilters) {
  // Update the store immediately
  console.log('Updating session filters:', newSessionFilters);
  sessionFilters.set(newSessionFilters);

  // Save to backend
  const res = await fetch('/api/session/filters', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newSessionFilters),
  });

  if (!res.ok) {
    console.error('Failed to save session filters');
  }
}