<script>
  import { onMount } from 'svelte';

  let logs = [];
  let filteredLogs = [];
  let levels = [];
  let selectedLevels = new Set();
  let showFilter = false;
  let dropdownWidth = 'auto';

  onMount(async () => {
    const res = await fetch('/big_log.json');
    const text = await res.text();
    logs = text.split('\n').filter(line => line.trim()).map(line => JSON.parse(line));
    levels = [...new Set(logs.map(log => log.levelname))];
    selectedLevels = new Set(levels); // Default: all values are checked
    filteredLogs = logs;

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
</script>

<h1>Log Viewer</h1>

{#if filteredLogs.length === 0}
  <p>Loading logs...</p>
{:else}
  <table>
    <thead>
      <tr>
        {#each Object.keys(filteredLogs[0]) as key}
          <th>
            {key}
            {#if key === 'levelname'}
              <!-- svelte-ignore a11y_no_static_element_interactions -->
              <div style="position: relative;" on:mouseenter={() => showFilter = true} on:mouseleave={() => showFilter = false}>
                <button>Filter</button>
                {#if showFilter}
                  <div style={`border: 1px solid #ccc; padding: 0.5rem; background: #fff; position: absolute; width: ${dropdownWidth};`}>
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
