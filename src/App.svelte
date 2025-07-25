<script>
  import { onMount, onDestroy } from 'svelte';
  import { handleClickOutside } from './utils/uiHelpers.js';
  import { applyAllFilters } from './utils/filterEngine.js';
  import { initializeLogs } from './utils/setupApp.js';
  import { activeCellPopup, logs, filteredLogs, selectedLevels, textFilters, asctimeFilter } from './stores/logStore.js';
  import { COLUMN_WIDTHS, headerFontSize } from './constants.js';
  import ActiveCellPopup from './components/ActiveCellPopup.svelte';
  import TableCell from './components/TableCell.svelte';
  import LevelnameFilterButton from './components/LevelnameFilterButton.svelte';
  import AsctimeFilterButton from './components/AsctimeFilterButton.svelte';
  import TextFilterButton from './components/TextFilterButton.svelte';

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
  let showFilter = {}; // Object to track visibility of dropdowns for each column
  let dropdownWidth = 'auto';
  let schema = [];

  function wrappedClickHandler(event) {
    handleClickOutside(event, activeCellPopup);
  }

  function setSchema(value) {
    schema = value;
  }

  onMount(async () => {
    await initializeLogs({
      logs,
      filteredLogs,
      selectedLevels,
      setLevels: l => levels = l,
      setShowFilter: sf => showFilter = sf,
      setDropdownWidth: dw => dropdownWidth = dw,
      setSchema
    });

    document.addEventListener("click", wrappedClickHandler);
  });

  onDestroy(() => {
    document.removeEventListener("click", wrappedClickHandler);
  });

  function toggleDropdown(key, state) {
    // Toggles the visibility of the filter dropdown for a specific column.
    showFilter = { ...showFilter, [key]: state };
  }

  // Calculates the position of the dropdown relative to the clicked element.
  function getDropdownPosition(event) {
    const rect = event.target.getBoundingClientRect();
    return {
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
    };
  }
</script>

<h1>Log Viewer</h1>

<table>
  <thead>
    <tr>
      {#each schema as key}
        <th style={`width: ${COLUMN_WIDTHS[key] || 'auto'}; font-size: ${headerFontSize};`}>{key}</th>
      {/each}
    </tr>
    <tr>
      {#each schema as key}
        <th style={`width: ${COLUMN_WIDTHS[key] || 'auto'}; position: relative; font-size: ${headerFontSize};`}>
          {#if key === 'levelname'}
            <!-- Filter button for levelname -->
            <LevelnameFilterButton 
              key={key} 
              levels={levels} 
              showFilter={showFilter} 
              dropdownWidth={dropdownWidth} 
              toggleDropdown={toggleDropdown} 
              getDropdownPosition={getDropdownPosition}
            />
          {:else if key === 'asctime'}
            <!-- Filter button for asctime -->
            <AsctimeFilterButton 
              key={key} 
              showFilter={showFilter} 
              toggleDropdown={toggleDropdown} 
              getDropdownPosition={getDropdownPosition}
            />
          {:else if ['filename', 'funcName', 'message', 'name'].includes(key)}
            <!-- Filter button for filename, funcName, and message -->
            <TextFilterButton 
              key={key} 
              showFilter={showFilter} 
              toggleDropdown={toggleDropdown} 
              getDropdownPosition={getDropdownPosition}
            />
          {:else}
            <!-- Placeholder button for other fields -->
            <button disabled style="opacity: 0.5;">Filter</button>
          {/if}
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
  }

  tbody tr:nth-child(even) {
    background: #f9f9f9;
  }
</style>
