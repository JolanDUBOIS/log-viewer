import { writable } from 'svelte/store';

export const activeCellPopup = writable(null);

export const isSidePanelOpen = writable(false); // State for the side panel (settings, etc.)

export const typeDropdown = writable(null);