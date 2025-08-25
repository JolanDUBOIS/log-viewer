export async function getLogs() {
  const res = await fetch('/api/logs');
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch logs: ${res.status} ${text}`);
  }
  return res.text(); // since backend returns plain text logs
}
