import { get } from 'svelte/store';
import { COLUMN_SIZE_LIMITS } from '../constants.js';
import { logs, filteredLogs, logColumns, columnWidths, selectedLevels, filterDropdownState, levels } from '../stores/logStore.js';
import { userConfig } from '../stores/configStore.js';

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

function initializeUserConfig(logs) {
  console.log('Initializing userConfig...');
  if (!logs || logs.length === 0) return;

  const columns = get(logColumns);

  userConfig.update(config => {
    const updatedConfig = { ...config };

    if (!updatedConfig.columnsAlias) updatedConfig.columnsAlias = {};
    if (!updatedConfig.columnsShown) updatedConfig.columnsShown = {};

    for (const col of columns) {
      if (!(col in updatedConfig.columnsAlias)) {
        updatedConfig.columnsAlias[col] = col;
      }
      if (!(col in updatedConfig.columnsShown)) {
        updatedConfig.columnsShown[col] = true;
      }
    }

    return updatedConfig;
  });
}

export async function initializeLogs({ setDropdownWidth }) {
  // const res = await fetch('/api/log');
  const res = await fetch('/api/log?path=./local-tests/log.json');
  if (!res.ok) throw new Error('Failed to fetch log file');

  const text = await res.text();

  const parsedLogs = text
    .split('\n')
    .filter(line => line.trim())
    .map(line => JSON.parse(line));

  logs.set(parsedLogs);
  filteredLogs.set(parsedLogs);

  const logColSchema = parsedLogs.length > 0 ? Object.keys(parsedLogs[0]) : [];
  logColumns.set(logColSchema);

  const listLevels = [...new Set(parsedLogs.map(log => log.levelname))];
  selectedLevels.set(new Set(listLevels));
  levels.set(listLevels);

  filterDropdownState.set(Object.fromEntries(logColSchema.map(k => [k, { position: { top: 0, left: 0 } , buttonHovered: false, dropdownHovered: false }])));
  const levelsArray = get(levels);
  setDropdownWidth(`${Math.max(...levelsArray.map(level => level.length))}rem`);

  initializeColumnWidths(parsedLogs);
  initializeUserConfig(parsedLogs);
}