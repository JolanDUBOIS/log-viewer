<script>
  // Svelte imports
  import { onMount, onDestroy } from 'svelte';

  // Utility imports
  import { handleClickOutside } from './utils/uiHelpers.js';
  import { applyAllFilters, sortLogs } from './utils/logEngine.js';
  import { initializeLogs } from './utils/setupApp.js';

  // Store imports
  import {
    logs,
    filteredLogs,
    displayedLogs,
    sortOrder 
  } from './stores/logStore.js';
  import { isSidePanelOpen } from './stores/uiStore.js';
  import { loadUserConfig, userConfig } from './stores/configStore.js';
  import { loadSessionParams, sessionColumnFilters } from './stores/sessionStore.js';

  // Component imports
  import ActiveCellPopup from './components/ActiveCellPopup.svelte';
  import Header from './components/Header.svelte';
  import SidePanel from './components/SidePanel.svelte';
  import LogTable from './components/log-table/LogTable.svelte';

  $: {
    const result = applyAllFilters($logs, {
      sessionColumnFilters: $sessionColumnFilters,
      userConfig: $userConfig,
    });

    filteredLogs.set(result);
  }

  $: {
    const sortedLogs = sortLogs($filteredLogs, $sortOrder);
    displayedLogs.set(sortedLogs);
  }
  
  function wrappedClickHandler(event) {
    handleClickOutside(event);
  }

  // This part needs to be refactored
  let dropdownWidth = 'auto';

  onMount(async () => {
    await loadUserConfig();
    await loadSessionParams();
    await initializeLogs({
      setDropdownWidth: dw => dropdownWidth = dw
    });
    document.addEventListener("click", wrappedClickHandler);
  });
  // -------------------------------


  onDestroy(() => {
    document.removeEventListener("click", wrappedClickHandler);
  });
</script>

<Header />

<div class="main-content">
  {#if $isSidePanelOpen}
    <SidePanel />
  {/if}

  <div class="table-container">
    <LogTable />
  </div>
</div>

<ActiveCellPopup />

<style>
  :global(#app) {
    margin-left: 0px;
    margin-right: 0px;
    padding: 0; /* Remove any padding from the app container */
    display: flex;
    flex-direction: column;
  }
</style>
