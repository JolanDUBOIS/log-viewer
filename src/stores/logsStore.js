import { writable, derived } from 'svelte/store';
import { getLogs } from '../api/logs';
import { parseLogLines } from '../utils/logsParser';
import { applyAllFilters, sortLogs } from '../utils/logsEngine';
import { columnsMeta } from './columnsStore.js';
import { sortingColumn, sortOrder } from './sortingStore.js';

export const logs = writable([]); // Array of all logs

export async function loadLogs() {
  console.log('Loading logs from backend...');
  try {
    const rawLogs = await getLogs();
    const parsedLogs = parseLogLines(rawLogs);
    logs.set(parsedLogs);
    console.log('Logs loaded:', parsedLogs.length, 'entries');
  } catch (error) {
    console.error('Failed to load logs:', error);
  }
}

export async function clearLogs() {
  console.log('Clearing logs');
  logs.set([]);
  console.log('Logs cleared');
}

export async function refreshLogs() {
  console.log('Refreshing logs');
  loadLogs() // For now, just reload logs
}

export const filteredLogs = derived(
  [logs, columnsMeta],
  ([$logs, $columnsMeta]) => applyAllFilters($logs, $columnsMeta)
);

export const sortedLogs = derived(
  [filteredLogs, sortingColumn, sortOrder],
  ([$filteredLogs, $sortingColumn, $sortOrder]) => {
    if (!$sortingColumn) return $filteredLogs; // No sorting column set
    return sortLogs($filteredLogs, {
      order: $sortOrder,
      sortingColumn: $sortingColumn,
    });
  }
)

export const displayedLogs =  derived(
  [sortedLogs],
  ([$sortedLogs]) => $sortedLogs
);

export const logColumns = derived(logs, $logs => {
  if ($logs.length === 0) return [];
  return Object.keys($logs[0]);
});
