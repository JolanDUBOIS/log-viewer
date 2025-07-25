import { get } from 'svelte/store';

export function showCellContent(event, value, activeCellPopup) {
  const rect = event.target.getBoundingClientRect();
  activeCellPopup.set({
    content: value,
    position: {
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
    },
  });
}

export function hideCellContent(closeOnHoverOutside, activeCellPopup) {
    if (!get(closeOnHoverOutside)) return; // Only hide if hover-based closing is enabled
    activeCellPopup.set(null);
  }

export function handleClickOutside(event, activeCellPopup) {
    const subWindow = document.querySelector(".subwindow");
    const clickedCell = event.target.closest("td div");

    if (subWindow && !subWindow.contains(event.target) && !clickedCell) {
      activeCellPopup.set(null);
    }
  }

export function getDropdownPosition(event) {
  const rect = event.target.getBoundingClientRect();
  return {
    top: rect.bottom,
    left: rect.left,
  };
}