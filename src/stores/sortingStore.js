import { writable, get } from 'svelte/store';
import { getSortingColumn, setSortingColumn } from '../api/sortingColumn';
import { logColumns } from './logsStore';

export const sortingColumn = writable(null);

export async function loadSortingColumn() {
  console.log('Loading sorting column from backend');
  try {
    let column = await getSortingColumn();

    if (!column) {
      const availableColumns = get(logColumns);
      if (availableColumns.length > 0) {
        column = availableColumns.includes('created') ? 'created' : availableColumns[0];
        column = await setSortingColumn(column);
      } else {
        column = null;
      }
    }

    // Update the frontend store
    sortingColumn.set(column);
    return column;

  } catch (err) {
    console.error('Failed to load sorting column:', err);
    return null;
  }
}

export async function updateSortingColumn(columnName) {
  console.log('Updating sorting column to', columnName);
  try {
    const updatedColumn = await setSortingColumn(columnName);
    sortingColumn.set(updatedColumn);
    return updatedColumn;
  } catch (err) {
    console.error('Failed to update sorting column:', err);
    return null;
  }
}

export async function clearSortingColumn() {
  console.log('Clearing sorting column');
  try {
    const cleared = await setSortingColumn(null);
    sortingColumn.set(null);
    return cleared;
  } catch (err) {
    console.error('Failed to clear sorting column:', err);
    return null;
  }
}

export const sortOrder = writable('asc');

export function toggleSortOrder() {
  console.log('Toggling sort order');
  sortOrder.update(current => (current === 'asc' ? 'desc' : 'asc'));
}

export function setSortOrder(order) {
  console.log('Setting sort order to', order);
  if (['asc', 'desc'].includes(order)) {
    sortOrder.set(order);
  } else {
    console.warn('Invalid sort order:', order);
  }
}