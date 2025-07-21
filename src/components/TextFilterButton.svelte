<script>
  import { logs, filteredLogs, textFilters } from '../stores/logStore.js';
  import ClearTextFieldButton from './ClearTextFieldButton.svelte';
  export let key;
  export let showFilter;
  export let toggleDropdown;
  export let getDropdownPosition;

  const fields = [
    { label: 'Filter In', id: `filter-in-{key}`, valueKey: 'filterIn', placeholder: 'Include text' },
    { label: 'Filter Out', id: `filter-out-{key}`, valueKey: 'filterOut', placeholder: 'Exclude text' }
  ];

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
        {#each fields as field}
          <div>
            <label for={field.id} style="display: block; margin-bottom: 0.3rem;">{field.label}</label>
            <div style="position: relative;">
              <input 
                id={field.id}
                type="text" 
                bind:value={$textFilters[key][field.valueKey]} 
                on:input={() => filterText(key)} 
                placeholder={field.placeholder}
                style="width: calc(100% - 2.5rem); padding-right: 2rem;"
              />
              <ClearTextFieldButton 
                clearFunc={() => clearTextFilter(key)} 
              />
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>