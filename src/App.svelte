<script>
  import { onMount, onDestroy } from 'svelte';
  import { handleClickOutside } from './utils/uiHelpers.js';
  import { applyAllFilters, sortLogs } from './utils/logEngine.js';
  import { initializeLogs } from './utils/setupApp.js';
  import {
    logs,
    filteredLogs,
    displayedLogs,
    selectedLevels,
    textFilters,
    asctimeFilter,
    filterDropdownState,
    sortOrder 
  } from './stores/logStore.js';
  import { isSidePanelOpen } from './stores/uiStore.js';
  import ActiveCellPopup from './components/ActiveCellPopup.svelte';
  import Header from './components/Header.svelte';
  import SidePanel from './components/SidePanel.svelte';
  import LogTable from './components/log-table/LogTable.svelte';

  // This block runs each time any update occurs, that could be an issue if the app grows larger...
  $: {
    const result = applyAllFilters($logs, {
      selectedLevels: $selectedLevels,
      textFilters: $textFilters,
      asctimeFilter: $asctimeFilter
    });

    filteredLogs.set(result);
  }

  $: {
    const sortedLogs = sortLogs($filteredLogs, $sortOrder);
    displayedLogs.set(sortedLogs);
  }

  let levels = [];
  let dropdownWidth = 'auto';
  let schema = [];

  function wrappedClickHandler(event) {
    handleClickOutside(event);
  }

  function setSchema(value) {
    schema = value;
  }

  onMount(async () => {
    await initializeLogs({
      logs,
      filteredLogs,
      selectedLevels,
      filterDropdownState,
      setLevels: l => levels = l,
      setDropdownWidth: dw => dropdownWidth = dw,
      setSchema
    });

    document.addEventListener("click", wrappedClickHandler);
  });

  onDestroy(() => {
    document.removeEventListener("click", wrappedClickHandler);
  });
</script>

<div class="app-container">
  {#if $isSidePanelOpen}
    <SidePanel />
  {/if}

  <div class="main-content">

    <Header />

    <LogTable 
      schema={schema} 
      levels={levels} 
    />

    <ActiveCellPopup />
  
  </div>

</div>

<style>
  :global(html), :global(body) {
    margin: 0;
    padding: 0;
  }

  :global(#app) {
    margin-left: 0px;
    margin-right: 0px;
    padding: 0; /* Remove any padding from the app container */
  }

  .app-container {
    display: flex;
    height: 100vh;
    width: 100vw;
  }

  .main-content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    overflow-y: auto;    /* enable vertical scroll */
    height: 100vh;       /* or 100% if parent allows */
  }
</style>
