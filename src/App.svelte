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
  import { loadUserConfigColumns, loadLevelColumn, userConfigColumns } from './stores/configStore.js';
  import { loadHistory } from './stores/historyStore.js';
  import { loadSessionFilters, sessionFilters } from './stores/sessionStore.js';

  // Component imports
  import ActiveCellPopup from './components/ActiveCellPopup.svelte';
  import Header from './components/Header.svelte';
  import SidePanel from './components/side-panel/SidePanel.svelte';
  import LogTable from './components/log-table/LogTable.svelte';

  $: {
    const result = applyAllFilters($logs, {
      sessionFilters: $sessionFilters,
      userConfig: $userConfigColumns,
    });

    filteredLogs.set(result);
  }

  $: {
    const sortedLogs = sortLogs($filteredLogs, {
      order: $sortOrder,
      userConfig: $userConfigColumns,
    });
    displayedLogs.set(sortedLogs);
  }
  
  function wrappedClickHandler(event) {
    handleClickOutside(event);
  }

  onMount(async () => {
    await loadLevelColumn();
    await loadUserConfigColumns();
    await loadHistory();
    await loadSessionFilters();
    await initializeLogs();
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
