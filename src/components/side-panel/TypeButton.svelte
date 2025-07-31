<script>
  import { typeDropdown } from '../../stores/uiStore.js';
  import { userConfig } from '../../stores/configStore.js';
  import { updateAndSaveUserConfig } from '../../stores/configStore.js';

  export let columnKey;

  function toggleTypeDropdown() {
    typeDropdown.set($typeDropdown === columnKey ? null : columnKey);
  }

  function setType(type) {
    const currentConfig = $userConfig;
    const newUserConfig = {
      ...currentConfig,
      [columnKey]: {
        ...currentConfig[columnKey],
        type: type
      }
    };
    updateAndSaveUserConfig(newUserConfig);
    typeDropdown.set(null); // Close the dropdown after selection
  }
</script>

<div class="type-button-wrapper">
  <button
    class="type-button"
    on:click={toggleTypeDropdown}
    aria-label="Choose column type"
    title="Choose column type"
  >
    {#if $userConfig[columnKey].type === 'number'}
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5-3.9 19.5m-2.1-19.5-3.9 19.5" />
      </svg>
    {:else if $userConfig[columnKey].type === 'datetime'}
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008H16.5V15Zm0 2.25h.008v.008H16.5v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
      </svg>
    {:else if $userConfig[columnKey].type === 'category'}
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6Z" />
      </svg>
    {:else}
      <span>Aa</span>
    {/if}
  </button>

  {#if $typeDropdown === columnKey}
    <div
      role="region"
      class="type-dropdown"
      on:mouseenter={() => typeDropdown.set(columnKey)}
      on:mouseleave={() => typeDropdown.set(null)}
    >
      {#each ['number', 'datetime', 'category', 'text'] as type}
        <button class="dropdown-item" on:click={() => setType(type)} type="button">{type}</button>
      {/each}
    </div>
  {/if}
</div>

<style>
  .type-button-wrapper {
    position: relative; /* Ensure dropdown is positioned relative to this container */
  }

  .type-button {
    padding: 0.25rem 0.4rem;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    justify-content: flex-start; /* Align content to the left */
  }

  .type-button svg {
    width: 1rem;
    height: 1rem;
  }

  .type-dropdown {
    position: absolute;
    top: calc(100% + 0.25rem); /* Position below the button with a small space */
    right: 0; /* Align the right edge of the dropdown with the right edge of the button */
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 0.5rem; /* Add rounded corners */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 0.5rem;
    z-index: 100; /* Ensure it appears above other elements */
    box-sizing: border-box;
    white-space: normal; /* Allow content to wrap */
  }

  .dropdown-item {
    display: block;
    width: 100%; /* Make buttons span the full width of the dropdown */
    padding: 0.25rem 0.5rem; /* Reduced padding for less space between buttons */
    text-align: left;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 0.85rem;
  }

  .dropdown-item:hover {
    background-color: #f0f0f0; /* Highlight on hover */
  }
</style>