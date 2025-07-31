import { writable } from 'svelte/store';

export const columnWidths = writable({}); // Object to store column widths

export const logs = writable([]); // Array of all logs
export const filteredLogs = writable([]); // Array of filtered logs
export const displayedLogs = writable([]); // Array of logs currently displayed in the table
  
export const filterDropdownState = writable({}); // State for filter dropdowns

export const sortOrder = writable('asc'); // Current sort order for logs (asc or desc)

export const logColumns = writable([]); // Array of column names to display in the table

export async function loadLogs() {
  try {
    const res = await fetch('/api/log');
    if (!res.ok) throw new Error('Failed to fetch log file');

    const text = await res.text();

    if (!text.trim()) {
      console.log('Loaded logs: empty response');
      return [];
    }

    const parsedLogs = text
      .split('\n')
      .filter(line => line.trim())
      .map(line => JSON.parse(line));
  
    logs.set(parsedLogs);
  } catch (err) {
    console.error('Fetch error:', err);
  }
}