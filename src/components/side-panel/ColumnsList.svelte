<script>
  import { get } from 'svelte/store';
  import { logColumns } from '../../stores/logStore.js';
  import { userConfig, updateAndSaveUserConfig } from '../../stores/configStore.js';

  function toggleVisibility(columnKey) {
    const currentConfig = get(userConfig);
    const newUserConfig = {
      ...currentConfig,
      [columnKey]: {
        ...currentConfig[columnKey],
        shown: !currentConfig[columnKey]?.shown
      }
    };
    updateAndSaveUserConfig(newUserConfig);
  }

  let colEditMode = null;

  function enterEditMode(columnKey) {
    colEditMode = colEditMode === columnKey ? null : columnKey;
  }

  function handleInputKeydown(event, colKey) {
    const input = /** @type {HTMLInputElement} */ (event.target);
    if (event.key === 'Enter') {
      saveAlias(colKey, input.value);
      colEditMode = null;
    }
  }

  function handleInputBlur(colKey, event) {
    const input = /** @type {HTMLInputElement} */ (event.target);
    saveAlias(colKey, input.value);
    colEditMode = null;
  }

  function saveAlias(colKey, newAlias) {
    const currentConfig = get(userConfig);
    const updatedConfig = {
      ...currentConfig,
      [colKey]: {
        ...currentConfig[colKey],
        alias: newAlias
      }
    };
    updateAndSaveUserConfig(updatedConfig);
  }
</script>

<div class="columns-list">
  {#each $logColumns as colKey}
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

      {#if colKey === colEditMode}
        <input 
          type="text" 
          class="alias-input" 
          value={$userConfig[colKey].alias} 
          placeholder="Edit alias" 
          on:keydown={(event) => handleInputKeydown(event, colKey)} 
          on:blur={(event) => handleInputBlur(colKey, event)}
        />
      {:else}
        <span>{$userConfig[colKey].alias}</span>
      {/if}

      <button class="edit-button" on:click={() => enterEditMode(colKey)} aria-label="Enter edit mode" title="Enter edit mode">
        {#if colEditMode === colKey}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        {:else}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
            <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
          </svg>   
        {/if}           
      </button>
    </div>
  {/each}
</div>

<style>

  .columns-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem; /* Add spacing between items */
  }

  .column-item {
    display: flex;
    align-items: center;
    justify-content: space-between; /* Ensure buttons are spaced apart */
    gap: 0.5rem;
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

  .edit-button {
    padding: 0.25rem 0.6rem;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: auto; /* Push the button to the right */
  }

  .edit-button .size-6 {
    width: 1rem;
    height: 1rem;
  }

  .alias-input {
    flex-grow: 0; /* Prevent the input from growing too large */
    max-width: 145px; /* Set a maximum width for the input */
    padding: 0.25rem;
    font-size: 0.85rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-family: inherit; /* Use the same font as the parent element */
  }
</style>