<script>
  import { onMount, onDestroy } from 'svelte';
  import { handleClickOutside } from './utils/uiHelpers.js';
  import { applyAllFilters } from './utils/logEngine.js';
  import { initializeLogs } from './utils/setupApp.js';
  import { activeCellPopup, logs, filteredLogs, selectedLevels, textFilters, asctimeFilter, filterDropdownState } from './stores/logStore.js';
  import { COLUMN_WIDTHS, headerFontSize, headerHeight } from './constants.js';
  import ActiveCellPopup from './components/ActiveCellPopup.svelte';
  import TableCell from './components/TableCell.svelte';
  import LevelnameFilterButton from './components/LevelnameFilterButton.svelte';
  import AsctimeFilterButton from './components/AsctimeFilterButton.svelte';
  import TextFilterButton from './components/TextFilterButton.svelte';
  import Header from './components/Header.svelte';
  import FilterDropdown from './components/FilterDropdown.svelte';

  // This block runs each time any update occurs, that could be an issue if the app grows larger...
  $: {
    const result = applyAllFilters($logs, {
      selectedLevels: $selectedLevels,
      textFilters: $textFilters,
      asctimeFilter: $asctimeFilter
    });

    filteredLogs.set(result);
  }

  let levels = [];
  let dropdownWidth = 'auto';
  let schema = [];

  function wrappedClickHandler(event) {
    handleClickOutside(event, activeCellPopup);
  }

  function setSchema(value) {
    schema = value;
  }

  let resizingColumn = null;
  let startX = 0;
  let startWidth = 0;

  function handleMouseDown(event, filterKey) {
    resizingColumn = filterKey;
    startX = event.clientX;
    startWidth = parseInt(COLUMN_WIDTHS[filterKey], 10) || 0; // Ensure startWidth is a number
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }

  function handleMouseMove(event) {
    if (resizingColumn) {
      const deltaX = event.clientX - startX;
      const newWidth = Math.max(50, parseInt(String(startWidth), 10) + deltaX) + 'px'; // Convert startWidth to string
      COLUMN_WIDTHS[resizingColumn] = newWidth;
    }
  }

  function handleMouseUp() {
    resizingColumn = null;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }

  onMount(async () => {
    await initializeLogs({
      logs,
      filteredLogs,
      selectedLevels,
      filterDropdownState,
      setLevels: l => levels = l,
      setDropdownWidth: dw => dropdownWidth = dw,
      setSchema
    });

    document.addEventListener("click", wrappedClickHandler);
  });

  onDestroy(() => {
    document.removeEventListener("click", wrappedClickHandler);
  });

  const numericHeight = parseInt(headerHeight, 10);
  const marginTop = numericHeight + 40 + 'px';
</script>

<Header />

<table style={`margin-top: ${marginTop};`}>
  <thead>
    <tr style={`position: sticky; top: ${headerHeight}; background: #fff; z-index: 1;`}>
      {#each schema as filterKey}
        <th style={`width: ${COLUMN_WIDTHS[filterKey] || 'auto'}; position: relative; font-size: ${headerFontSize}; border: 2px solid #ccc;`}>
          {#if filterKey === 'levelname'}
            <!-- Filter button for levelname -->
            <FilterDropdown filterKey={filterKey}>
              <LevelnameFilterButton slot="dropdown-content" levels={levels}/>
            </FilterDropdown>
          {:else if filterKey === 'asctime'}
            <!-- Filter button for asctime -->
            <FilterDropdown filterKey={filterKey}>
              <AsctimeFilterButton slot="dropdown-content"/>
            </FilterDropdown>
          {:else if ['filename', 'funcName', 'message', 'name'].includes(filterKey)}
            <!-- Filter button for filename, funcName, and message -->
            <FilterDropdown filterKey={filterKey}>
              <TextFilterButton slot="dropdown-content" filterKey={filterKey}/>
            </FilterDropdown>
          {:else}
            <!-- Placeholder button for other fields -->
            <button disabled style="opacity: 0.5;">{filterKey}</button>
          {/if}
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <div 
            style="position: absolute; right: 0; top: 0; bottom: 0; width: 5px; cursor: col-resize;" 
            on:mousedown={(event) => handleMouseDown(event, filterKey)}
          ></div>
        </th>
      {/each}
    </tr>
  </thead>
  <tbody>
    {#if $filteredLogs.length === 0}
      <tr>
        <td colspan="{Object.keys($filteredLogs[0] || $logs[0] || {}).length}" style="text-align: center;">
          No rows match the filters.
        </td>
      </tr>
    {:else}
      {#each $filteredLogs as log}
        <tr>
          {#each schema as key}
            <TableCell 
              width={COLUMN_WIDTHS[key] || 'auto'} 
              value={log[key]}
            ></TableCell>
          {/each}
        </tr>
      {/each}
    {/if}
  </tbody>
</table>

<ActiveCellPopup />

<style>
  :global(html), :global(body) {
    margin: 0;
    padding: 0;
  }

  :global(#app) {
    margin-left: 20px;
    margin-right: 20px;
    padding: 0; /* Remove any padding from the app container */
  }

  table {
    border-collapse: collapse;
    width: 100%; /* Ensure the table fits within the window */
    table-layout: fixed; /* Prevent resizing based on content */
    margin: 0 auto; /* Center the table horizontally */
    padding: 0;
  }

  th, td {
    border: 1px solid #ccc;
    padding: 0.4rem 0.6rem;
    text-align: left;
    white-space: nowrap; /* Ensure all fields are displayed as one-liners */
    overflow: hidden; /* Hide overflow content */
    text-overflow: ellipsis; /* Add ellipsis for overflow content */
  }

  th {
    background: #eee;
    position: relative; /* Ensure filter dropdown is positioned correctly */
    border: 2px solid #ccc; /* Thicker border for table head cells */
  }

  th div {
    background: transparent; /* Ensure the resize handle is transparent */
  }

  tbody tr:nth-child(even) {
    background: #f9f9f9;
  }
</style>
