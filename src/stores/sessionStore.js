import { writable } from 'svelte/store';

export const sessionColumnFilters = writable({}); // Contains columns filters info

export async function loadSessionParams() {
  try {
    const res = await fetch('/api/session-params');
    if (res.ok) {
      const paramsData = await res.json();
      sessionColumnFilters.set(paramsData);
    } else {
      const errorText = await res.text();
      console.error('Failed to load session parameters:', res.status, errorText);
    }
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

export async function updateSessionParams(newSessionParams) {
  // Update the store immediately
  console.log('Updating session parameters:', newSessionParams);
  sessionColumnFilters.set(newSessionParams);

  // Save to backend
  const res = await fetch('/api/session-params', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newSessionParams),
  });

  if (!res.ok) {
    console.error('Failed to save session parameters');
  }
}