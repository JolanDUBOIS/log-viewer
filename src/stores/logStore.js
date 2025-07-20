import { writable } from 'svelte/store';

/**
 * The active cell popup state.
 * - null = no popup
 * - { content: string, position: { top, left, width? } }
 */
export const activeCellPopup = writable(null);


export const closeOnHoverOutside = writable(false); // Whether to close the popup on hover outside

export const headerFontSize = writable('1rem'); // Font size for the top row
export const cellFontSize = writable('0.9rem'); // Font size for the normal cells below
export const logs = writable([]); // Array of all logs
export const filteredLogs = writable([]); // Array of filtered logs