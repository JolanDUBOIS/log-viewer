function filterCategory(value, filter) {
  const allowed = filter.contains;
  if (Array.isArray(allowed) && allowed.length > 0 && !allowed.includes(value)) {
    return false;
  }
  return true;
}

function filterText(value, filter) {
  const { filterIn, filterOut } = filter;
  const str = value || '';
  if (filterIn && !str.includes(filterIn)) return false;
  if (filterOut && str.includes(filterOut)) return false;
  return true;
}

function filterDatetime(value, filter) {
  const { from, until } = filter;
  const time = new Date(value);
  if (from && time < new Date(from)) return false;
  if (until && time > new Date(until)) return false;
  return true;
}

function filterNumber(value, filter) {
  let { min, max, equal } = filter;
  
  min = min === '' || min == null ? null : Number(min);
  max = max === '' || max == null ? null : Number(max);
  equal = equal === '' || equal == null ? null : Number(equal);

  const num = typeof value === 'number' ? value : Number(value);
  if (isNaN(num)) return false;

  if (equal !== null && num !== equal) return false;

  if (min !== null && num < min) return false;
  if (max !== null && num > max) return false;

  return true;
}

const filterFunctions = {
  category: filterCategory,
  text: filterText,
  datetime: filterDatetime,
  number: filterNumber,
};

export function applyAllFilters(logs, columnsMeta) {
  return logs.filter(log => {
    for (const col in columnsMeta) {
      const { filter, type, name } = columnsMeta[col];
      if (!filter || !type) continue;
      const value = log[name];
      const filterFn = filterFunctions[type];
      if (filterFn && !filterFn(value, filter)) {
        return false;
      }
    }
    return true;
  });
}

// Deprecated
export function sortLogs(logs, { order, sortingColumn }) {
  if (!Array.isArray(logs)) return [];

  return [...logs].sort((a, b) => {
    const aVal = a[sortingColumn];
    const bVal = b[sortingColumn];

    // Basic comparison
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
}