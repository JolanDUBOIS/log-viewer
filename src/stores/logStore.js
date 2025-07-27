import { writable } from 'svelte/store';

export const logs = writable([]); // Array of all logs
export const filteredLogs = writable([]); // Array of filtered logs
export const displayedLogs = writable([]); // Array of logs currently displayed in the table

export const selectedLevels = writable(new Set()); // Set of selected log levels
export const asctimeFilter = writable({ from: '', until: '' }); // Filter for log
export const textFilters = writable({
    name: { filterIn: '', filterOut: '' },
    filename: { filterIn: '', filterOut: '' },
    funcName: { filterIn: '', filterOut: '' },
    message: { filterIn: '', filterOut: '' },
  }); // Text filters for different fields
  
export const filterDropdownState = writable({}); // State for filter dropdowns

export const sortOrder = writable('asc'); // Current sort order for logs (asc or desc)

/**
 * The active cell popup state.
 * - null = no popup
 * - {
 *  content: string;
 *  position: { top: number, left: number };
 *  dimensions: { width: number, height?: number },
 *  sourceRect?: DOMRect
 *  }
 */
export const activeCellPopup = writable(null);