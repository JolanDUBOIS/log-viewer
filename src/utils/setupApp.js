export async function initializeLogs({
  logs,
  filteredLogs,
  selectedLevels,
  setLevels,
  setShowFilter,
  setDropdownWidth,
  setSchema // <-- NEW PARAM
}) {
  const res = await fetch('/log.json');
  const text = await res.text();

  const parsedLogs = text
    .split('\n')
    .filter(line => line.trim())
    .map(line => JSON.parse(line));

  logs.set(parsedLogs);
  filteredLogs.set(parsedLogs);

  // Extract and set schema safely
  const schema = parsedLogs.length > 0 ? Object.keys(parsedLogs[0]) : [];
  setSchema(schema); // <-- store it in a `let schema = []` in App.svelte

  const levels = [...new Set(parsedLogs.map(log => log.levelname))];
  selectedLevels.set(new Set(levels));
  setLevels(levels);

  // Use schema instead of Object.keys again
  setShowFilter(Object.fromEntries(schema.map(k => [k, false])));

  // Dropdown width based on longest level name
  setDropdownWidth(`${Math.max(...levels.map(level => level.length))}rem`);
}