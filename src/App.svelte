<script>
  import { onMount, onDestroy } from 'svelte';
  import { showCellContent, handleClickOutside } from './utils/uiHelpers.js';
  import { activeCellContent, activeCellPosition, headerFontSize, logs, filteredLogs } from './stores/logStore.js';
  import { COLUMN_WIDTHS } from './constants.js';
  import ActiveCellPopup from './components/ActiveCellPopup.svelte';
  // import TableBody from './components/TableBody.svelte';

  let levels = [];
  let selectedLevels = new Set();
  let showFilter = {}; // Object to track visibility of dropdowns for each column
  let dropdownWidth = 'auto';
  let asctimeFilter = { from: '', until: '' };
  let textFilters = {
    name: { filterIn: '', filterOut: '' },
    filename: { filterIn: '', filterOut: '' },
    funcName: { filterIn: '', filterOut: '' },
    message: { filterIn: '', filterOut: '' },
  };

  // function handleMouseLeave() {
  //   hideCellContent($closeOnHoverOutside, activeCellContent, activeCellPosition);
  // }

  function wrappedClickHandler(event) {
    handleClickOutside(event, activeCellContent, activeCellPosition);
  }

  onMount(async () => {
    const res = await fetch('/log.json');
    const text = await res.text();
    logs.set(text.split('\n').filter(line => line.trim()).map(line => JSON.parse(line)));
    levels = [...new Set($logs.map(log => log.levelname))];
    selectedLevels = new Set(levels); // Default: all values are checked
    filteredLogs.set($logs);

    // Initialize showFilter for all keys
    Object.keys(logs[0] || {}).forEach(key => {
      showFilter[key] = false;
    });

    // Calculate dropdown width based on the largest levelname
    dropdownWidth = `${Math.max(...levels.map(level => level.length)) * 1}rem`;

    document.addEventListener("click", wrappedClickHandler);
  });

  onDestroy(() => {
    document.removeEventListener("click", wrappedClickHandler);
  });

  function applyLevelFilter() {
    filteredLogs.set($logs.filter(log => selectedLevels.has(log.levelname)));
  }

  function toggleLevel(level) {
    // Toggles the selection state of a log level and updates the filtered logs.
    if (selectedLevels.has(level)) {
      selectedLevels.delete(level);
    } else {
      selectedLevels.add(level);
    }
    applyLevelFilter();
  }

  function filterAsctime() {
    const { from, until } = asctimeFilter;
    filteredLogs.set($logs.filter(log => {
      const logTime = new Date(log.asctime);

      return (!from || logTime >= new Date(from)) && (!until || logTime <= new Date(until));
    }));
  }

  function filterText(field) {
    const { filterIn, filterOut } = textFilters[field];
    filteredLogs.set($logs.filter(log => {
      const value = log[field] || '';
      return (!filterIn || value.includes(filterIn)) && (!filterOut || !value.includes(filterOut));
    }));
  }

  function toggleDropdown(key, state) {
    // Toggles the visibility of the filter dropdown for a specific column.
    showFilter[key] = state;
  }

  function clearAsctimeFilter() {
    asctimeFilter = { from: '', until: '' };
    filterAsctime();
  }

  function clearTextFilter(field) {
    textFilters[field] = { filterIn: '', filterOut: '' };
    filterText(field);
  }

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
      {#each Object.keys($filteredLogs[0] || logs[0] || {}) as key}
        <th style={`width: ${COLUMN_WIDTHS[key] || 'auto'}; font-size: ${headerFontSize};`}>{key}</th>
      {/each}
    </tr>
    <tr>
      {#each Object.keys($filteredLogs[0] || logs[0] || {}) as key}
        <th style={`width: ${COLUMN_WIDTHS[key] || 'auto'}; position: relative; font-size: ${headerFontSize};`}>
          {#if key === 'levelname'}
            <!-- Filter button for levelname -->
            <div 
              role="button" 
              tabindex="0" 
              style="position: relative;" 
              on:mouseenter={(event) => {
                toggleDropdown(key, true);
                const position = getDropdownPosition(event);
                showFilter[key] = { visible: true, position };
              }} 
              on:mouseleave={() => toggleDropdown(key, false)}
            >
              <button>Filter</button>
              {#if showFilter[key]?.visible}
                <div style={`border: 1px solid #ccc; padding: 0.5rem; background: #fff; position: fixed; top: ${showFilter[key].position.top}px; left: ${showFilter[key].position.left}px; width: ${dropdownWidth}; z-index: 10;`}>
                  <div style="display: flex; flex-direction: column;">
                    {#each levels as level}
                      <label>
                        <input 
                          type="checkbox" 
                          checked={selectedLevels.has(level)} 
                          on:change={() => toggleLevel(level)} 
                        />
                        {level}
                      </label>
                    {/each}
                  </div>
                </div>
              {/if}
            </div>
          {:else if key === 'asctime'}
            <!-- Filter button for asctime -->
            <div 
              role="button" 
              tabindex="0" 
              style="position: relative;" 
              on:mouseenter={(event) => {
                toggleDropdown(key, true);
                const position = getDropdownPosition(event);
                showFilter[key] = { visible: true, position };
              }} 
              on:mouseleave={() => toggleDropdown(key, false)}
            >
              <button>Filter</button>
              {#if showFilter[key]?.visible}
                <div style={`border: 1px solid #ccc; padding: 0.5rem; background: #fff; position: fixed; top: ${showFilter[key].position.top}px; left: ${showFilter[key].position.left}px; min-width: 200px; z-index: 10;`}>
                  <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                    <div>
                      <label for="asctime-from" style="display: block; margin-bottom: 0.3rem;">From</label>
                      <div style="position: relative;">
                        <input 
                          id="asctime-from"
                          type="text" 
                          bind:value={asctimeFilter.from} 
                          on:input={filterAsctime} 
                          placeholder="Enter time (e.g., YYYY-MM-DD HH:mm:ss)"
                          style="width: calc(100% - 2.5rem); padding-right: 2rem;"
                        />
                        <button 
                          style="position: absolute; top: 50%; right: 0.3rem; transform: translateY(-50%); font-size: 0.8rem; padding: 0; border: none; background: transparent; cursor: pointer;" 
                          on:click={clearAsctimeFilter}
                        >
                          ✖
                        </button>
                      </div>
                    </div>
                    <div>
                      <label for="asctime-until" style="display: block; margin-bottom: 0.3rem;">Until</label>
                      <div style="position: relative;">
                        <input 
                          id="asctime-until"
                          type="text" 
                          bind:value={asctimeFilter.until} 
                          on:input={filterAsctime} 
                          placeholder="Enter time (e.g., YYYY-MM-DD HH:mm:ss)"
                          style="width: calc(100% - 2.5rem); padding-right: 2rem;"
                        />
                        <button 
                          style="position: absolute; top: 50%; right: 0.3rem; transform: translateY(-50%); font-size: 0.8rem; padding: 0; border: none; background: transparent; cursor: pointer;" 
                          on:click={clearAsctimeFilter}
                        >
                          ✖
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              {/if}
            </div>
          {:else if ['filename', 'funcName', 'message', 'name'].includes(key)}
            <!-- Filter button for filename, funcName, and message -->
            <div 
              role="button" 
              tabindex="0" 
              style="position: relative;" 
              on:mouseenter={(event) => {
                toggleDropdown(key, true);
                const position = getDropdownPosition(event);
                showFilter[key] = { visible: true, position };
              }} 
              on:mouseleave={() => toggleDropdown(key, false)}
            >
              <button>Filter</button>
              {#if showFilter[key]?.visible}
                <div style={`border: 1px solid #ccc; padding: 0.5rem; background: #fff; position: fixed; top: ${showFilter[key].position.top}px; left: ${showFilter[key].position.left}px; min-width: 200px; z-index: 10;`}>
                  <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                    <div>
                      <label for="filter-in-{key}" style="display: block; margin-bottom: 0.3rem;">Filter In</label>
                      <div style="position: relative;">
                        <input 
                          id="filter-in-{key}"
                          type="text" 
                          bind:value={textFilters[key].filterIn} 
                          on:input={() => filterText(key)} 
                          placeholder="Include text"
                          style="width: calc(100% - 2.5rem); padding-right: 2rem;"
                        />
                        <button 
                          style="position: absolute; top: 50%; right: 0.3rem; transform: translateY(-50%); font-size: 0.8rem; padding: 0; border: none; background: transparent; cursor: pointer;" 
                          on:click={() => clearTextFilter(key)}
                        >
                          ✖
                        </button>
                      </div>
                    </div>
                    <div>
                      <label for="filter-out-{key}" style="display: block; margin-bottom: 0.3rem;">Filter Out</label>
                      <div style="position: relative;">
                        <input 
                          id="filter-out-{key}"
                          type="text" 
                          bind:value={textFilters[key].filterOut} 
                          on:input={() => filterText(key)} 
                          placeholder="Exclude text"
                          style="width: calc(100% - 2.5rem); padding-right: 2rem;"
                        />
                        <button 
                          style="position: absolute; top: 50%; right: 0.3rem; transform: translateY(-50%); font-size: 0.8rem; padding: 0; border: none; background: transparent; cursor: pointer;" 
                          on:click={() => clearTextFilter(key)}
                        >
                          ✖
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              {/if}
            </div>
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
          {#each Object.entries(log) as [key, value]}
            <td style={`width: ${COLUMN_WIDTHS[key] || 'auto'};`}>
              <!-- svelte-ignore a11y_click_events_have_key_events -->
              <!-- svelte-ignore a11y_no_static_element_interactions -->
              <div 
                style="overflow-x: auto; white-space: nowrap; cursor: pointer;" 
                on:click={(event) => showCellContent(event, value, activeCellContent, activeCellPosition)}
              >
                {value}
              </div>
            </td>
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

  td div {
    overflow-x: auto; /* Enable horizontal scrolling for cell content */
    white-space: nowrap; /* Prevent wrapping of text */
  }

  td div::-webkit-scrollbar {
    height: 5px; /* Set scrollbar thickness */
  }

  td div::-webkit-scrollbar-thumb {
    background: #ccc; /* Set scrollbar thumb color */
    border-radius: 3px; /* Round scrollbar edges */
  }

  td div::-webkit-scrollbar-track {
    background: #f1f1f1; /* Set scrollbar track color */
  }

  th {
    background: #eee;
    position: relative; /* Ensure filter dropdown is positioned correctly */
  }

  tbody tr:nth-child(even) {
    background: #f9f9f9;
  }
</style>
