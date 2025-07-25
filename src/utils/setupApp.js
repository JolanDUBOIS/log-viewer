export async function initializeLogs({
  logs,
  filteredLogs,
  selectedLevels,
  filterDropdownState,
  setLevels,
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

  // Initialize filterDropdownState for each level
  filterDropdownState.set(Object.fromEntries(schema.map(k => [k, { position: { top: 0, left: 0 } , buttonHovered: false, dropdownHovered: false }])));

  // Dropdown width based on longest level name
  setDropdownWidth(`${Math.max(...levels.map(level => level.length))}rem`);
}