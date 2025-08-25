<script>
  import { isDropdownVisible } from '../../utils/dropdownHelpers.js';
  import { getDropdownPosition } from '../../utils/uiHelpers.js';
  import { columnsMeta } from '../../stores/columnsStore.js';
	import { filterDropdownState, updateFilterDropdownState } from '../../stores/uiStore.js';
  import CategoryFilterButton from '../filters/CategoryFilterButton.svelte';
  import DatetimeFilterButton from '../filters/DatetimeFilterButton.svelte';
  import TextFilterButton from '../filters/TextFilterButton.svelte';
  
  export let colKey;

  function setHover(part, value) {
    updateFilterDropdownState(colKey, { [part]: value });
  }

  function onButtonMouseEnter(event) {
    setHover('buttonHovered', true);
    const position = getDropdownPosition(event);
    updateFilterDropdownState(colKey, {
      visible: true,
      position
    });
  }
</script>

<div style="position: relative;">
  <button 
    on:mouseenter={onButtonMouseEnter}
    on:mouseleave={() => setHover('buttonHovered', false)}
    style="width: 100%; display: flex; align-items: center; justify-content: center; font-size: 1rem; padding: 0.2rem 0.5rem;"
  >
    {$columnsMeta[colKey].alias}
  </button>
</div>
{#if isDropdownVisible(colKey, $filterDropdownState)}
  <div
    role="region"
    class="dropdown"
    style={`top: ${$filterDropdownState[colKey].position.top}px; left: ${$filterDropdownState[colKey].position.left}px;`}
    on:mouseenter={() => setHover('dropdownHovered', true)}
    on:mouseleave={() => setHover('dropdownHovered', false)}
  >
    {#if $columnsMeta[colKey].type === 'category'}
      <CategoryFilterButton filterKey={colKey}/>
    {:else if $columnsMeta[colKey].type === 'datetime'}
      <DatetimeFilterButton filterKey={colKey}/>
    {:else if $columnsMeta[colKey].type === 'text'}
      <TextFilterButton filterKey={colKey}/>
    {:else}
      <!-- Placeholder button for other fields -->
      <button disabled style="opacity: 0.5; width: 100%; display: flex; align-items: center; justify-content: center;">{$columnsMeta[colKey].alias}</button>
    {/if}
  </div>
{/if}

<style>
  .dropdown {
    border: 1px solid #ccc;
    padding: 0.5rem;
    background: #fff;
    position: fixed;
    min-width: 200px;
    z-index: 10;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    border-radius: 4px;
  }
</style>