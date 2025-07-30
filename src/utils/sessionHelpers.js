import { get } from 'svelte/store';
import { userConfig } from '../stores/configStore.js';
import { sessionColumnFilters } from '../stores/sessionStore.js';

const allowedTypes = ['text', 'datetime', 'number', 'category'];

export async function initializeSessionParams(logs) {
  console.log('Initializing session parameters...');

  // Suppose that userConfig is already initialized (TODO - How do I ensure this?)
  const currentUserConfig = get(userConfig);
  const currentFilters = get(sessionColumnFilters);

  const newFilters = { ...currentFilters };

  for (const col of Object.keys(currentUserConfig)) {
    const filterVal = currentFilters[col];
    const colType = currentUserConfig[col]?.type;

    // If sessionColumnFilters[col] exists and is one of allowed types, do nothing
    if (
      filterVal &&
      allowedTypes.includes(colType) &&
      isValidFilterForType(filterVal, colType)
    ) {
      continue;
    }

    // Otherwise, assign default filter value depending on colType
    if (colType === 'text') {
      newFilters[col] = { filterIn: '', filterOut: '' };
    } else if (colType === 'datetime') {
      newFilters[col] = { from: '', until: '' };
    } else if (colType === 'number') {
      newFilters[col] = { min: '', max: '', equal: '' };
    } else if (colType === 'category') {
      const all = [...new Set(logs.map(log => log[col]))]
      newFilters[col] = { contains: [...all], all: all };
    }
  }

  sessionColumnFilters.set(newFilters);
}

// Helper to check if filterVal looks valid for the given type
function isValidFilterForType(filterVal, type) {
  if (type === 'text') {
    return (
      typeof filterVal.filterIn === 'string' &&
      typeof filterVal.filterOut === 'string'
    );
  }
  if (type === 'datetime') {
    return (
      typeof filterVal.from === 'string' &&
      typeof filterVal.until === 'string'
    );
  }
  if (type === 'number') {
    return (
      'min' in filterVal &&
      'max' in filterVal &&
      'equal' in filterVal
    );
  }
  if (type === 'category') {
    return (
      Array.isArray(filterVal.contains) &&
      Array.isArray(filterVal.all)
    );
  }
  return false;
}