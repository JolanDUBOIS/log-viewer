export function applyAllFilters(logs, { sessionColumnFilters, userConfig }) {
  return logs.filter(log => {
    for (const col in sessionColumnFilters) {
      const filter = sessionColumnFilters[col];
      const config = userConfig[col];
      if (!config) continue; // skip unknown config

      const colType = config.type;
      const value = log[col];

      switch (colType) {
        case 'category': {
          const allowed = filter.contains;
          if (Array.isArray(allowed) && allowed.length > 0 && !allowed.includes(value)) {
            return false;
          }
          break;
        }

        case 'text': {
          const { filterIn, filterOut } = filter;
          const str = value || '';
          if (filterIn && !str.includes(filterIn)) return false;
          if (filterOut && str.includes(filterOut)) return false;
          break;
        }

        case 'datetime': {
          const { from, until } = filter;
          const time = new Date(value);
          if (from && time < new Date(from)) return false;
          if (until && time > new Date(until)) return false;
          break;
        }

        case 'number': {
          const { min, max, equal } = filter;
          const num = typeof value === 'number' ? value : Number(value);
          if (isNaN(num)) return false;
          if (equal !== '' && num !== Number(equal)) return false;
          if (min !== '' && num < Number(min)) return false;
          if (max !== '' && num > Number(max)) return false;
          break;
        }

        default:
          // Ignore unknown types
          break;
      }
    }

    return true;
  });
}


export function sortLogs(logs, { order, userConfig }) {
  if (!Array.isArray(logs)) return [];

  const orderKeys = Object.entries(userConfig)
    .filter(([_, cfg]) => cfg.orderBy)
    .map(([key]) => key);

  if (orderKeys.length === 0) return [...logs]; // No sorting if no orderBy set
  if (orderKeys.length > 1) throw new Error('Multiple columns have orderBy=true. Only one is allowed.');

  const key = orderKeys[0];

  return [...logs].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    // Basic comparison
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
}