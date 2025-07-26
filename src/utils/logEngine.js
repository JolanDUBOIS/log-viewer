export function applyAllFilters(logs, { selectedLevels, textFilters, asctimeFilter }) {
  return logs.filter(log => {
    // 1. LEVEL FILTER
    if (!selectedLevels.has(log.levelname)) return false;

    // 2. TEXT FILTERS
    for (const field in textFilters) {
      const value = log[field] || '';
      const { filterIn, filterOut } = textFilters[field];
      if (filterIn && !value.includes(filterIn)) return false;
      if (filterOut && value.includes(filterOut)) return false;
    }

    // 3. TIMESTAMP FILTER
    if (asctimeFilter.from) {
      const fromTime = new Date(asctimeFilter.from);
      if (new Date(log.asctime) < fromTime) return false;
    }
    if (asctimeFilter.until) {
      const untilTime = new Date(asctimeFilter.until);
      if (new Date(log.asctime) > untilTime) return false;
    }

    return true;
  });
}