<script>
  import { logs, displayedLogs, logColumns, columnWidths, levels } from '../../stores/logStore.js';
  import { headerFontSize, headerHeight } from '../../constants.js';
  import TableCell from './TableCell.svelte';
  import LevelnameFilterButton from './LevelnameFilterButton.svelte';
  import AsctimeFilterButton from './AsctimeFilterButton.svelte';
  import TextFilterButton from './TextFilterButton.svelte';
  import FilterDropdown from './FilterDropdown.svelte';
  import { userConfig } from '../../stores/configStore.js';

  let resizingColumn = null;
  let startX = 0;
  let startWidth = 0;

  function handleMouseDown(event, filterKey) {
    resizingColumn = filterKey;
    startX = event.clientX;
    startWidth = parseInt($columnWidths[filterKey], 10) || 0; // Ensure startWidth is a number
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }

  function handleMouseMove(event) {
    if (resizingColumn) {
      const deltaX = event.clientX - startX;
      const newWidth = Math.max(50, parseInt(String(startWidth), 10) + deltaX) + 'px'; // Convert startWidth to string
      columnWidths.update(current => ({
        ...current,
        [resizingColumn]: newWidth
      }));
    }
  }

  function handleMouseUp() {
    resizingColumn = null;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }
  
  const numericHeight = parseInt(headerHeight, 10);
  const marginTop = numericHeight + 40 + 'px';
</script>

<table style={`margin-top: ${marginTop};`}>
  <thead>
    <tr style={`position: sticky; top: calc(${headerHeight} - 2px); background: #fff; z-index: 1;`}>
      {#each $logColumns as filterKey}
      {#if $userConfig.columnsShown[filterKey]}
        <th style={`width: ${$columnWidths[filterKey] || 'auto'}; position: relative; font-size: ${headerFontSize}; border: 2px solid #ccc;`}>
            {#if filterKey === 'levelname'}
              <!-- Filter button for levelname -->
              <FilterDropdown filterKey={filterKey} filterName={$userConfig.columnsAlias[filterKey]}>
                <LevelnameFilterButton slot="dropdown-content" levels={$levels}/>
              </FilterDropdown>
            {:else if filterKey === 'asctime'}
              <!-- Filter button for asctime -->
              <FilterDropdown filterKey={filterKey} filterName={$userConfig.columnsAlias[filterKey]}>
                <AsctimeFilterButton slot="dropdown-content"/>
              </FilterDropdown>
            {:else if ['filename', 'funcName', 'message', 'name'].includes(filterKey)}
              <!-- Filter button for filename, funcName, and message -->
              <FilterDropdown filterKey={filterKey} filterName={$userConfig.columnsAlias[filterKey]}>
                <TextFilterButton slot="dropdown-content" filterKey={filterKey}/>
              </FilterDropdown>
              {:else}
              <!-- Placeholder button for other fields -->
              <button disabled style="opacity: 0.5; width: 100%; display: flex; align-items: center; justify-content: center;">{$userConfig.columnsAlias[filterKey]}</button>
              {/if}
              <!-- svelte-ignore a11y_no_static_element_interactions -->
              <div 
              style="position: absolute; right: 0; top: 0; bottom: 0; width: 5px; cursor: col-resize;" 
              on:mousedown={(event) => handleMouseDown(event, filterKey)}
              ></div>
          </th>
        {/if}
      {/each}
    </tr>
  </thead>
  <tbody>
    {#if $displayedLogs.length === 0}
      <tr>
        <td colspan="{Object.keys($displayedLogs[0] || $logs[0] || {}).length}" style="text-align: center;">
          No rows match the filters.
        </td>
      </tr>
    {:else}
      {#each $displayedLogs as log}
        <tr>
          {#each $logColumns as filterKey}
            {#if $userConfig.columnsShown[filterKey]}
            <TableCell 
              width={$columnWidths[filterKey] || 'auto'} 
              value={log[filterKey]}
            ></TableCell>
            {/if}
          {/each}
        </tr>
      {/each}
    {/if}
  </tbody>
</table>

<style>

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
    font-size: 0.9rem; /* Reduce font size for header cells */
  }

  th div {
    background: transparent; /* Ensure the resize handle is transparent */
  }

  tbody tr:nth-child(even) {
    background: #f9f9f9;
  }
</style>