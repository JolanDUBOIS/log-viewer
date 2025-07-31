<script>
  import { headerHeight } from '../../constants.js';
  import { isSidePanelOpen } from '../../stores/uiStore.js';
  import ColumnsList from './ColumnsList.svelte';
  import LogFilesList from './LogFilesList.svelte';

  function closeSidePanel() {
    // noop during dev
    // return;
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
  <ColumnsList />

  <h3>Log Files</h3>
  <LogFilesList />
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
</style>