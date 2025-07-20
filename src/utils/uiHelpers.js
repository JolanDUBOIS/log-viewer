import { get } from 'svelte/store';

export function showCellContent(event, value, activeCellContent, activeCellPosition) {
  const rect = event.target.getBoundingClientRect();
  activeCellContent.set(value);
  activeCellPosition.set({
    top: rect.bottom + window.scrollY,
    left: rect.left + window.scrollX,
  });
}

export function hideCellContent(closeOnHoverOutside, activeCellContent, activeCellPosition) {
    if (!get(closeOnHoverOutside)) return; // Only hide if hover-based closing is enabled
    activeCellContent.set(null);
    activeCellPosition.set(null);
  }

export function handleClickOutside(event, activeCellContent, activeCellPosition) {
    const subWindow = document.querySelector(".subwindow");
    const clickedCell = event.target.closest("td div");

    if (subWindow && !subWindow.contains(event.target) && !clickedCell) {
      activeCellContent.set(null);
      activeCellPosition.set(null);
    }
  }
