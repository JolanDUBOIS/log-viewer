import { writable } from 'svelte/store';

/**
 * The active cell popup state.
 * - null = no popup
 * - { content: string, position: { top, left, width? } }
 */
export const activeCellPopup = writable(null);

export const closeOnHoverOutside = writable(false); // Whether to close the popup on hover outside

export const logs = writable([]); // Array of all logs
export const filteredLogs = writable([]); // Array of filtered logs

export const selectedLevels = writable(new Set()); // Set of selected log levels
export const asctimeFilter = writable({ from: '', until: '' }); // Filter for log
export const textFilters = writable({
    name: { filterIn: '', filterOut: '' },
    filename: { filterIn: '', filterOut: '' },
    funcName: { filterIn: '', filterOut: '' },
    message: { filterIn: '', filterOut: '' },
  }); // Text filters for different fields

export const showFilter = writable({});

export function toggleDropdown(key, state) {
  showFilter.update(current => ({
    ...current,
    [key]: state
  }));
}

export const filterDropdownState = writable({}); // State for filter dropdowns