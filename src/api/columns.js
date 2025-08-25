async function getColumn(name) {
  const res = await fetch(`/api/column?name=${encodeURIComponent(name)}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch column: ${res.status}`);
  }
  return res.json();
}

async function postUpdateColumn(columnData) {
  const res = await fetch(`/api/column`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(columnData)
  });
  if (!res.ok) {
    throw new Error(`Failed to update column: ${res.status}`);
  }
  return res.json();
}

export { getColumn, postUpdateColumn };