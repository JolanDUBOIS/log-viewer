export async function getHistory() {
  const res = await fetch('/api/history');
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || 'Failed to fetch history');
  }
  return res.json();
}

export async function postAddToHistory(data) {
  const res = await fetch('/api/history/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || 'Failed to add to history');
  }
  return res.json();
}

export async function removeFromHistory(path) {
  const res = await fetch('/api/history/remove', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path }),
  });
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || 'Failed to remove from history');
  }
  return res.json();
}
