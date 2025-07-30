import { COLUMN_SIZE_LIMITS } from '../constants.js';
import { logs, filteredLogs, columnWidths, columnsShown, selectedLevels, filterDropdownState } from '../stores/logStore.js';

function initializeColumnWidths(logs) {
  if (!logs || logs.length === 0) {
    columnWidths.set({}); // reset global store to empty object
    return;
  }

  const firstRow = logs[0];
  const newWidths = {};

  for (const column of Object.keys(firstRow)) {
    const maxContentLength = logs.reduce((max, row) => {
      const val = row[column];
      const str = val !== undefined && val !== null ? String(val) : '';
      return Math.max(max, str.length);
    }, 0);

    console.log(`Column: ${column}, Max Content Length: ${maxContentLength}`);

    const estimatedWidth = maxContentLength * 8;

    const finalWidth = Math.min(
      COLUMN_SIZE_LIMITS.width.maxCreation,
      Math.max(COLUMN_SIZE_LIMITS.width.minCreation, estimatedWidth)
    );

    newWidths[column] = `${finalWidth}px`;
  }

  // Update the writable store here
  columnWidths.set(newWidths);
}

function initializeColumnsShown(logs) {
  if (!logs || logs.length === 0) {
    columnsShown.set({}); // reset global store to empty object
    return;
  }

  const firstRow = logs[0];
  const newColumnsShown = {};

  for (const column of Object.keys(firstRow)) {
    newColumnsShown[column] = true; // initialize all columns to true
  }

  // Update the writable store here
  columnsShown.set(newColumnsShown);
}

export async function initializeLogs({ setLevels, setDropdownWidth, setSchema }) {
  const res = await fetch('/api/log');
  if (!res.ok) throw new Error('Failed to fetch log file');

  const text = await res.text();

  const parsedLogs = text
    .split('\n')
    .filter(line => line.trim())
    .map(line => JSON.parse(line));

  logs.set(parsedLogs);
  filteredLogs.set(parsedLogs);

  const schema = parsedLogs.length > 0 ? Object.keys(parsedLogs[0]) : [];
  setSchema(schema); // <-- store it in a `let schema = []` in App.svelte

  const levels = [...new Set(parsedLogs.map(log => log.levelname))];
  selectedLevels.set(new Set(levels));
  setLevels(levels);

  filterDropdownState.set(Object.fromEntries(schema.map(k => [k, { position: { top: 0, left: 0 } , buttonHovered: false, dropdownHovered: false }])));
  setDropdownWidth(`${Math.max(...levels.map(level => level.length))}rem`);

  initializeColumnWidths(parsedLogs);
  initializeColumnsShown(parsedLogs);
}