<script>
  import { logs, filteredLogs, textFilters } from '../stores/logStore.js';
  export let key;
	export let showFilter;
  export let toggleDropdown;
	export let getDropdownPosition;

  function filterText(field) {
    const { filterIn, filterOut } = $textFilters[field];
    filteredLogs.set($logs.filter(log => {
      const value = log[field] || '';
      return (!filterIn || value.includes(filterIn)) && (!filterOut || !value.includes(filterOut));
    }));
  }

  function clearTextFilter(field) {
    $textFilters[field] = { filterIn: '', filterOut: '' };
    filterText(field);
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
          <label for="filter-in-{key}" style="display: block; margin-bottom: 0.3rem;">Filter In</label>
          <div style="position: relative;">
            <input 
              id="filter-in-{key}"
              type="text" 
              bind:value={$textFilters[key].filterIn} 
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
              bind:value={$textFilters[key].filterOut} 
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