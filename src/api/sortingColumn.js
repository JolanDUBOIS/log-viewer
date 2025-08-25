async function getSortingColumn() {
  const res = await fetch("/api/sorting-column");
  if (!res.ok) {
    throw new Error(`Failed to fetch sorting column: ${res.status}`);
  }
  const data = await res.json();
  return data.sorting_column;
}

async function setSortingColumn(columnName) {
  const res = await fetch("/api/sorting-column", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sorting_column: columnName }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(
      `Failed to set sorting column: ${res.status}` +
        (errData.error ? ` – ${errData.error}` : "")
    );
  }

  const data = await res.json();
  // Backend returns the actual value that has been set
  return data.sorting_column;
}

async function clearSortingColumn() {} // TODO

export { getSortingColumn, setSortingColumn };