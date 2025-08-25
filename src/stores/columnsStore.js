import { writable, get } from 'svelte/store';
import { getColumn, postUpdateColumn } from '../api/columns';

// Reactive store: all column metadata
export const columnsMeta = writable({});

/**
 * Load metadata for a single column and merge it into the store.
 * Skips if the column already exists unless forceReload is true.
 */
export async function loadColumnMeta(columnName, forceReload = false) {
  console.log(`Loading column meta for: ${columnName} (forceReload=${forceReload})`);
  if (!forceReload && get(columnsMeta)[columnName]) return;

  try {
    const columnData = await getColumn(columnName);

    // Basic validation
    if (!columnData.name) {
      console.warn(`Invalid column data received for ${columnName}:`, columnData);
      return;
    }

    columnsMeta.update(columns => ({ ...columns, [columnName]: columnData }));
    console.log(`Loaded column meta for ${columnName}:`, columnData);
  } catch (error) {
    console.error(`Failed to load column ${columnName}:`, error);
  }
}

/**
 * Initialize the store from a list of column names.
 * Ensures all columns are present in the store.
 */
export async function loadColumnsMeta(columnNames) {
  console.log('Loading columns meta for:', columnNames);
  await Promise.all(columnNames.map(name => loadColumnMeta(name)));
}

/**
 * Update a single column in the store and save it to the backend.
 * Returns the updated column or null if it failed.
 */
export async function updateAndSaveColumnMeta(newColumnData) {
  console.log('Updating and saving column meta:', newColumnData);
  if (!newColumnData.name) {
    console.warn('Cannot update column without a name:', newColumnData);
    return null;
  }

  try {
    const updatedColumn = await postUpdateColumn(newColumnData);

    // Merge safely into the store
    columnsMeta.update(columns => ({ ...columns, [updatedColumn.name]: updatedColumn }));

    console.log(`Updated and saved column meta for ${updatedColumn.name}:`, updatedColumn);
    return updatedColumn;
  } catch (error) {
    console.error(`Failed to update and save column ${newColumnData.name}:`, error);
    return null;
  }
}

/**
 * Reset the store completely (e.g., on logout or reload).
 * Optionally provide a list of column names to initialize again.
 */
export function resetColumnsMeta(initialColumns = []) {
  columnsMeta.set({});
  if (initialColumns.length > 0) loadColumnsMeta(initialColumns);
}
