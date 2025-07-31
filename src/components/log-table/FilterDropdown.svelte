<script>
	import { filterDropdownState } from '../../stores/logStore.js';
  import { isDropdownVisible } from '../../utils/dropdownHelpers.js';
  import { getDropdownPosition } from '../../utils/uiHelpers.js';
  export let filterKey;
  export let filterName;

  function setHover(part, value) {
    filterDropdownState.update(state => ({
      ...state,
      [filterKey]: {
        ...state[filterKey],
        [part]: value
      }
    }));
  }

  function onButtonMouseEnter(event) {
    setHover('buttonHovered', true);
    const position = getDropdownPosition(event);
    filterDropdownState.update(state => ({
      ...state,
      [filterKey]: {
        ...state[filterKey],
        visible: true,
        position
      }
    }));
  }
</script>

<div style="position: relative;">
  <button 
    on:mouseenter={onButtonMouseEnter}
    on:mouseleave={() => setHover('buttonHovered', false)}
    style="width: 100%; display: flex; align-items: center; justify-content: center; font-size: 1rem; padding: 0.2rem 0.5rem;"
  >
    {filterName}
  </button>
  {#if isDropdownVisible(filterKey, $filterDropdownState)}
    <div
      role="region"
      class="dropdown"
      style={`top: ${$filterDropdownState[filterKey].position.top}px; left: ${$filterDropdownState[filterKey].position.left}px;`}
      on:mouseenter={() => setHover('dropdownHovered', true)}
      on:mouseleave={() => setHover('dropdownHovered', false)}
    >
      <slot name="dropdown-content"></slot>
    </div>
  {/if}
</div>

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