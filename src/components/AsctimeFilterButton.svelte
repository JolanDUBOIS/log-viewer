<script>
	import { logs, filteredLogs, asctimeFilter } from '../stores/logStore.js';
  export let key;
	export let showFilter;
  export let toggleDropdown;
	export let getDropdownPosition;

  function filterAsctime() {
    const { from, until } = $asctimeFilter;
    filteredLogs.set($logs.filter(log => {
      const logTime = new Date(log.asctime);

      return (!from || logTime >= new Date(from)) && (!until || logTime <= new Date(until));
    }));
  }

  function clearAsctimeFilter() {
    asctimeFilter.set({ from: '', until: '' });
    filterAsctime();
  }
</script>

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
            bind:value={$asctimeFilter.from} 
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
            bind:value={$asctimeFilter.until} 
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