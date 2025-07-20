import { writable } from 'svelte/store';

// --- Store for the active cell popup ---
export const activeCellContent = writable(null); // For the content of the active clicked cell popup (string or null)
export const activeCellPosition = writable(null); // For the position of the popup { top: number, left: number, width?: number } or null
export const closeOnHoverOutside = writable(false); // Whether to close the popup on hover outside

export const headerFontSize = writable('1rem'); // Font size for the top row
export const cellFontSize = writable('0.9rem'); // Font size for the normal cells below
export const logs = writable([]); // Array of all logs
export const filteredLogs = writable([]); // Array of filtered logs