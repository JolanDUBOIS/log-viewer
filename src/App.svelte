<script>
  // Svelte imports
  import { onMount, onDestroy } from 'svelte';
  import { get } from 'svelte/store';

  // Utility imports
  import { handleClickOutside } from './utils/uiHelpers.js';

  // Store imports
  import { appReady } from './stores/appReadyStore.js';
  import { logs, filteredLogs, displayedLogs, loadLogs, logColumns } from './stores/logsStore.js';
  import { loadActiveFile } from './stores/activeFileStore.js';
  import { loadColumnsMeta } from './stores/columnsStore.js';
  import { loadHistory } from './stores/historyStore.js';
  import { loadSortingColumn } from './stores/sortingStore.js';
  import { initializeFilterDropdownState, isSidePanelOpen } from './stores/uiStore.js';

  // Component imports
  import ActiveCellPopup from './components/ActiveCellPopup.svelte';
  import Header from './components/Header.svelte';
  import SidePanel from './components/side-panel/SidePanel.svelte';
  import LogTable from './components/log-table/LogTable.svelte';

  function wrappedClickHandler(event) {
    handleClickOutside(event);
  }

  onMount(async () => {
    // Start the independent tasks
    const independentTasks = [
      loadSortingColumn(),
      loadHistory(),
      loadActiveFile()
    ];

    // Wait for logs
    await loadLogs();

    // Now columnsMeta (depends on logs)
    await loadColumnsMeta(get(logColumns));

    // Initialize filter dropdown state (depends on columnsMeta)
    initializeFilterDropdownState(get(logColumns));

    // Finish waiting for the independents
    await Promise.all(independentTasks);

    // Everything loaded → set the flag
    appReady.set(true);

    document.addEventListener("click", wrappedClickHandler);
  });

  onDestroy(() => {
    document.removeEventListener("click", wrappedClickHandler);
  });
</script>

<Header />

<div class="main-content">
  {#if $isSidePanelOpen}
    <SidePanel />
  {/if}

  {#if $appReady}
  <div class="table-container">
    <!-- {@debug $logs}
    {@debug $filteredLogs}
    {@debug $displayedLogs} -->
    <LogTable />
  </div>
  {:else}
  <p>Loading Logs...</p>
  {/if}
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
