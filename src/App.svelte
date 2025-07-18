<script>
  import { onMount } from 'svelte';

  let logs = [];
  let filteredLogs = [];
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

  onMount(async () => {
    const res = await fetch('/log.json');
    const text = await res.text();
    logs = text.split('\n').filter(line => line.trim()).map(line => JSON.parse(line));
    levels = [...new Set(logs.map(log => log.levelname))];
    selectedLevels = new Set(levels); // Default: all values are checked
    filteredLogs = logs;

    // Initialize showFilter for all keys
    Object.keys(logs[0] || {}).forEach(key => {
      showFilter[key] = false;
    });

    // Calculate dropdown width based on the largest levelname
    dropdownWidth = `${Math.max(...levels.map(level => level.length)) * 1}rem`;
  });

  function filterLogs() {
    filteredLogs = logs.filter(log => selectedLevels.has(log.levelname));
  }

  function toggleLevel(level) {
    if (selectedLevels.has(level)) {
      selectedLevels.delete(level);
    } else {
      selectedLevels.add(level);
    }
    filterLogs();
  }

  function filterAsctime() {
    const { from, until } = asctimeFilter;
    filteredLogs = logs.filter(log => {
      const logTime = new Date(log.asctime);

      return (!from || logTime > new Date(from)) && (!until || logTime < new Date(until));
    });
  }

  function filterText(field) {
    const { filterIn, filterOut } = textFilters[field];
    filteredLogs = logs.filter(log => {
      const value = log[field] || '';
      return (!filterIn || value.includes(filterIn)) && (!filterOut || !value.includes(filterOut));
    });
  }

  function toggleDropdown(key, state) {
    showFilter[key] = state;
  }
</script>

<h1>Log Viewer</h1>

{#if filteredLogs.length === 0}
  <p>Loading logs...</p>
{:else}
  <table>
    <thead>
      <tr>
        {#each Object.keys(filteredLogs[0]) as key}
          <th>{key}</th>
        {/each}
      </tr>
      <tr>
        {#each Object.keys(filteredLogs[0]) as key}
          <th>
            {#if key === 'levelname'}
              <!-- Filter button for levelname -->
              <div 
                role="button" 
                tabindex="0" 
                style="position: relative;" 
                on:mouseenter={() => toggleDropdown(key, true)} 
                on:mouseleave={() => toggleDropdown(key, false)}
              >
                <button>Filter</button>
                {#if showFilter[key]}
                  <div style={`border: 1px solid #ccc; padding: 0.5rem; background: #fff; position: absolute; width: ${dropdownWidth}; z-index: 10;`}>
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
                on:mouseenter={() => toggleDropdown(key, true)} 
                on:mouseleave={() => toggleDropdown(key, false)}
              >
                <button>Filter</button>
                {#if showFilter[key]}
                  <div style="border: 1px solid #ccc; padding: 0.5rem; background: #fff; position: absolute; z-index: 10;">
                    <div style="display: flex; flex-direction: column;">
                      <label>
                        From: 
                        <textarea 
                          rows="1" 
                          bind:value={asctimeFilter.from} 
                          on:input={filterAsctime} 
                          placeholder="Enter time (e.g., YYYY-MM-DD HH:mm:ss)"
                        ></textarea>
                      </label>
                      <label>
                        Until: 
                        <textarea 
                          rows="1" 
                          bind:value={asctimeFilter.until} 
                          on:input={filterAsctime} 
                          placeholder="Enter time (e.g., YYYY-MM-DD HH:mm:ss)"
                        ></textarea>
                      </label>
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
                on:mouseenter={() => toggleDropdown(key, true)} 
                on:mouseleave={() => toggleDropdown(key, false)}
              >
                <button>Filter</button>
                {#if showFilter[key]}
                  <div style="border: 1px solid #ccc; padding: 0.5rem; background: #fff; position: absolute; z-index: 10;">
                    <div style="display: flex; flex-direction: column;">
                      <label>
                        Filter In: 
                        <textarea 
                          rows="1" 
                          bind:value={textFilters[key].filterIn} 
                          on:input={() => filterText(key)} 
                          placeholder="Include text"
                        ></textarea>
                      </label>
                      <label>
                        Filter Out: 
                        <textarea 
                          rows="1" 
                          bind:value={textFilters[key].filterOut} 
                          on:input={() => filterText(key)} 
                          placeholder="Exclude text"
                        ></textarea>
                      </label>
                    </div>
                  </div>
                {/if}
              </div>
            {:else}
              <!-- Placeholder button for other fields -->
              <button disabled style="opacity: 0.5;">No Filter</button>
            {/if}
          </th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each filteredLogs as log}
        <tr>
          {#each Object.values(log) as value}
            <td>{value}</td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
{/if}

<style>
  table {
    border-collapse: collapse;
    width: 100%;
  }
  th, td {
    border: 1px solid #ccc;
    padding: 0.4rem 0.6rem;
    text-align: left;
  }
  th {
    background: #eee;
    position: relative; /* Ensure filter dropdown is positioned correctly */
  }
  tbody tr:nth-child(even) {
    background: #f9f9f9;
  }
</style>
