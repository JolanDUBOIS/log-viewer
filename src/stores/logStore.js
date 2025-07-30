import { writable } from 'svelte/store';

export const columnWidths = writable({}); // Object to store column widths

export const logs = writable([]); // Array of all logs
export const filteredLogs = writable([]); // Array of filtered logs
export const displayedLogs = writable([]); // Array of logs currently displayed in the table
  
export const filterDropdownState = writable({}); // State for filter dropdowns

export const sortOrder = writable('asc'); // Current sort order for logs (asc or desc)