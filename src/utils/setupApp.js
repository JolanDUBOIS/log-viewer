import { get } from 'svelte/store';
import { COLUMN_SIZE_LIMITS } from '../constants.js';
import { logs, columnWidths, filterDropdownState, logColumns, loadLogs } from '../stores/logStore.js';
import { userConfig } from '../stores/configStore.js';
import { initializeSessionParams } from './sessionHelpers.js';

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

    const estimatedWidth = maxContentLength * 8 + 20;  // Doesn't work very well, too large for Time, too small for Levelname... (TODO: improve this)

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
  const columns = logs.length > 0 ? Object.keys(logs[0]) : [];

  userConfig.update(config => {
    const updatedConfig = { ...config };

    for (const col of columns) {
      if (!(col in updatedConfig)) {
        updatedConfig[col] = {
          alias: col,
          shown: true,
          orderBy: false,
          type: 'text'
        };
      } else {
        // Fill in missing fields if the column already exists
        if (!('alias' in updatedConfig[col])) {
          updatedConfig[col].alias = col;
        }
        if (!('shown' in updatedConfig[col])) {
          updatedConfig[col].shown = true;
        }
        if (!('orderBy' in updatedConfig[col])) {
          updatedConfig[col].orderBy = false;
        }
        if (!('type' in updatedConfig[col])) {
          updatedConfig[col].type = 'text';
        }
      }
    }

    return updatedConfig;
  });
}

export async function initializeLogs() {
  console.log('Initializing logs...');
  await loadLogs();
  const parsedLogs = get(logs);

  const logColSchema = parsedLogs.length > 0 ? Object.keys(parsedLogs[0]) : [];
  logColumns.set(logColSchema);
  console.log('Log columns:', logColSchema);

  filterDropdownState.set(Object.fromEntries(logColSchema.map(k => [k, { position: { top: 0, left: 0 } , buttonHovered: false, dropdownHovered: false }])));

  initializeColumnWidths(parsedLogs);
  initializeUserConfig(parsedLogs);
  await initializeSessionParams(parsedLogs);
}