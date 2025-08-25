import { writable, get } from 'svelte/store';
import { COLUMN_SIZE_LIMITS } from '../constants.js';
import { activeCellPopup } from "../stores/uiStore";

// For Filter Dropdowns
export function getDropdownPosition(event) {
  const rect = event.target.getBoundingClientRect();
  return {
    top: rect.bottom,
    left: rect.left,
  };
}

// For Active Cell Popups
export function showCellContent(event, value) {
  const cellElement = event.currentTarget;
  const rect = cellElement.getBoundingClientRect();

  activeCellPopup.set({
    content: value,
    position: {
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
    },
    dimensions: {
      width: rect.width,
    },
    sourceRect: rect,
  });
}

export function handleClickOutside(event) {
    const cellPopupEl = document.querySelector(".cell-popup");
    
    if (cellPopupEl && !cellPopupEl.contains(event.target)) {
      activeCellPopup.set(null);
    }
  }

export function calculateColumnWidths(logs) {
  if (!logs || logs.length === 0) return {};

  const firstRow = logs[0];
  const newWidths = {};

  for (const column of Object.keys(firstRow)) {
    const maxContentLength = logs.reduce((max, row) => {
      const str = row[column] != null ? String(row[column]) : '';
      return Math.max(max, str.length);
    }, 0);

    const estimatedWidth = maxContentLength * 8 + 20;
    const finalWidth = Math.min(
      COLUMN_SIZE_LIMITS.width.maxCreation,
      Math.max(COLUMN_SIZE_LIMITS.width.minCreation, estimatedWidth)
    );

    newWidths[column] = `${finalWidth}px`;
  }

  return newWidths;
}
