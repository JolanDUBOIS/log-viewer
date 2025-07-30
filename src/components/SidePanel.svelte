<script>
  import { get } from 'svelte/store';
  import { headerHeight } from '../constants.js';
  import { isSidePanelOpen } from '../stores/uiStore.js';
  import { userConfig, updateAndSaveUserConfig } from '../stores/configStore.js';

  function toggleVisibility(columnKey) {
    const currentConfig = get(userConfig); // get current full config
    const updatedPart = {
      [columnKey]: {
        ...currentConfig[columnKey],
        shown: !currentConfig[columnKey]?.shown
      }
    };
    updateAndSaveUserConfig(updatedPart);
  }

  function closeSidePanel() {
    isSidePanelOpen.set(false);
  }
</script>

<div 
  class="side-panel" 
  style={`--header-height: ${headerHeight}`} 
  on:mouseleave={closeSidePanel}
  role="complementary" 
>
  <h3>Columns</h3>
  <div class="columns-list">
    {#each Object.keys($userConfig) as colKey}
      <div class="column-item">
        <button class="show-filter-toggle-button" on:click={() => toggleVisibility(colKey)} aria-label="Toggle visibility" title="Toggle visibility">
          {#if $userConfig[colKey].shown}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
            <path d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
            <path fill-rule="evenodd" d="M.664 10.59a1.651 1.651 0 0 1 0-1.186A10.004 10.004 0 0 1 10 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0 1 10 17c-4.257 0-7.893-2.66-9.336-6.41ZM14 10a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" clip-rule="evenodd" />
          </svg>            
          {:else}      
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
            <path fill-rule="evenodd" d="M3.28 2.22a.75.75 0 0 0-1.06 1.06l14.5 14.5a.75.75 0 1 0 1.06-1.06l-1.745-1.745a10.029 10.029 0 0 0 3.3-4.38 1.651 1.651 0 0 0 0-1.185A10.004 10.004 0 0 0 9.999 3a9.956 9.956 0 0 0-4.744 1.194L3.28 2.22ZM7.752 6.69l1.092 1.092a2.5 2.5 0 0 1 3.374 3.373l1.091 1.092a4 4 0 0 0-5.557-5.557Z" clip-rule="evenodd" />
            <path d="m10.748 13.93 2.523 2.523a9.987 9.987 0 0 1-3.27.547c-4.258 0-7.894-2.66-9.337-6.41a1.651 1.651 0 0 1 0-1.186A10.007 10.007 0 0 1 2.839 6.02L6.07 9.252a4 4 0 0 0 4.678 4.678Z" />
          </svg>        
          {/if}
        </button>
        <span>{$userConfig[colKey].alias}</span>
      </div>
    {/each}
  </div>
  <!-- <h3>Side Panel (ideas)</h3>
    <p>Here we add the possibility for the user to rename columns, to define which will be shown and which will not... Potentially also define which type of columns they are (time, text, number, level/select type) though it would be nice to have it automated...</p>
    <p>Other settings (dark mode, toggle color for level, etc.)</p> -->
</div>

<style>
  .side-panel {
    position: fixed; /* Change to fixed to span the entire left side of the screen */
    top: var(--header-height, 0); /* Maintain distance from the top */
    left: 0;
    width: var(--panel-width, 280px); /* default width */
    height: calc(100% - var(--header-height, 0)); /* Adjust height to account for header */
    background-color: #f9f9f9;
    border-right: 1px solid #ccc;
    padding: 1rem;
    box-sizing: border-box;
    z-index: 50;
    padding-top: 10px;
  }

  .columns-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem; /* Add spacing between items */
  }

  .column-item {
    display: flex;
    align-items: center;
    gap: 0.5rem; /* Add spacing between button and label */
  }

  .show-filter-toggle-button {
    padding: 0.25rem 0.6rem; /* Keep the adjusted padding */
    font-size: 0.85rem; /* Keep the font size unchanged */
    display: flex;
    align-items: center;
    justify-content: center; /* Center the SVG inside the button */
  }

  .show-filter-toggle-button .size-5 {
    width: 1rem; /* Set a fixed width for the SVG */
    height: 1rem; /* Set a fixed height for the SVG */
  }
</style>