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