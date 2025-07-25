<script>
	import { asctimeFilter, toggleDropdown, showFilter } from '../stores/logStore.js';
  import { getDropdownPosition } from '../utils/uiHelpers.js';
  import ClearTextFieldButton from './ClearTextFieldButton.svelte';
  export let key;

  const fields = [
    { label: 'From', id: 'asctime-from', valueKey: 'from' },
    { label: 'Until', id: 'asctime-until', valueKey: 'until' }
  ]

  function clearAsctimeFilter() {
    asctimeFilter.set({ from: '', until: '' });
  }
</script>

<div 
  role="button" 
  tabindex="0" 
  style="position: relative;" 
  on:mouseenter={(event) => {
    toggleDropdown(key, true);
    const position = getDropdownPosition(event);
    showFilter.update(current => ({...current, [key]: { visible: true, position }}))
  }} 
  on:mouseleave={() => toggleDropdown(key, false)}
>
  <button>Filter</button>
  {#if $showFilter[key]?.visible}
    <div style={`border: 1px solid #ccc; padding: 0.5rem; background: #fff; position: fixed; top: ${$showFilter[key].position.top}px; left: ${$showFilter[key].position.left}px; min-width: 200px; z-index: 10;`}>
      <div style="display: flex; flex-direction: column; gap: 0.5rem;">
        {#each fields as field}
          <div>
            <label for={field.id} style="display: block; margin-bottom: 0.3rem;">{field.label}</label>
            <div style="position: relative;">
              <input 
                id={field.id}
                type="text" 
                bind:value={$asctimeFilter[field.valueKey]}
                placeholder="Enter time (e.g., YYYY-MM-DD HH:mm:ss)"
                style="width: calc(100% - 2.5rem); padding-right: 2rem;"
              />
              <ClearTextFieldButton 
                clearFunc={clearAsctimeFilter} 
              />
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>