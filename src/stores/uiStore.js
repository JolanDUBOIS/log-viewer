import { get, writable, derived } from 'svelte/store';
import { logs, logColumns } from './logsStore.js';
import { calculateColumnWidths } from '../utils/uiHelpers.js';

// Active cell popup (for displaying full content of truncated cells)
export const activeCellPopup = writable(null);

// Side panel
export const isSidePanelOpen = writable(false);

export function toggleSidePanel() {
  console.log('Toggling side panel');
  isSidePanelOpen.update(open => !open);
}

export function openSidePanel() {
  console.log('Opening side panel');
  isSidePanelOpen.set(true);
}

export function closeSidePanel() {
  console.log('Closing side panel');
  isSidePanelOpen.set(false);
}

// Type dropdown
export const typeDropdown = writable(null);

export function toggleTypeDropdown(colKey) {
  console.log('Toggling type dropdown for', colKey);
  const current = get(typeDropdown);
  typeDropdown.set(current === colKey ? null : colKey);
}

export function openTypeDropdown(colKey) {
  console.log('Opening type dropdown for', colKey);
  typeDropdown.set(colKey);
}

export function closeTypeDropdown() {
  console.log('Closing type dropdown');
  typeDropdown.set(null);
}

// Column widths
export const columnWidths = writable({});
logs.subscribe($logs => {
  columnWidths.set(calculateColumnWidths($logs));
});

// Filter dropdown state
export const filterDropdownState = writable({});

export function initializeFilterDropdownState(logColumns) {
  const initialState = Object.fromEntries(
    logColumns.map(k => [
      k,
      {
        position: { top: 0, left: 0 },
        buttonHovered: false,
        dropdownHovered: false,
        visible: false
      }
    ])
  );
  filterDropdownState.set(initialState);
}

export function updateFilterDropdownState(colKey, changes) {
  filterDropdownState.update(state => ({
    ...state,
    [colKey]: {
      ...state[colKey],
      ...changes
    }
  }));
}