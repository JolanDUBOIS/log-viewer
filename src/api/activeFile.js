async function getActiveFile() {
  const res = await fetch('/api/active-file');
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || 'Failed to fetch active file');
  }
  return res.json();
}

async function postSelectActiveFile(data) {
  const res = await fetch('/api/active-file/select', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || 'Failed to select active file');
  }
  return res.json();
}

async function postOpenActiveFile(path) {
  const res = await fetch('/api/active-file/open', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path }),
  });
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || 'Failed to open active file');
  }
  return res.json();
}

export { getActiveFile, postSelectActiveFile, postOpenActiveFile };