<script>
  import { filteredLogs, logs, sortOrder } from '../stores/logStore.js'; 
  import { headerHeight } from '../constants.js';
  import { isSidePanelOpen } from '../stores/uiStore.js';

  function toggleOrder() {
    console.log('Toggling sort order');
    sortOrder.update(o => o === 'asc' ? 'desc' : 'asc');
  }

  function toggleSidePanel() {
    console.log('Toggling side panel');
    isSidePanelOpen.update(open => !open);
  }
</script>

<div class="header-bar" style={`--header-height: ${headerHeight}`}>
  <div class="left-section">

    <button class="side-panel-toggle-button" on:click={toggleSidePanel} aria-label="Settings" title="Settings">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      </svg>      
    </button>

    <button class="order-toggle-button" on:click={toggleOrder} aria-label="Toggle sort order" title="Toggle sort order">
      {#if $sortOrder === 'asc'}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12" />
        </svg>
      {:else}      
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0-3.75-3.75M17.25 21 21 17.25" />
        </svg>
      {/if}
    </button>

  </div>

  <div class="center-section">Log Viewer</div>

  <div class="right-section">Rows displayed: {$filteredLogs.length} / {$logs.length}</div>
</div>

<style>
  .header-bar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background-color: #eee;
    border-bottom: 1px solid #ccc;
    line-height: var(--header-height);
    z-index: 100;
    display: flex;
    align-items: center;
    padding: 0 1rem;
    box-sizing: border-box; /* Ensure padding is included in the width */
    overflow: hidden; /* Prevent content from overflowing */
  }

  .left-section {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1rem;
    text-align: left;
  }

  .center-section {
    font-size: 1.5rem;
    font-weight: bold;
    text-align: center;
    flex-grow: 1;
  }

  .right-section {
    font-size: 1rem;
    text-align: right;
  }

  .order-toggle-button, .side-panel-toggle-button {
    font-size: 1rem;
    padding: 0.5rem 1rem;
    cursor: pointer;
    height: 100%; /* Make the button fill the header's height */
    display: flex; /* Use flexbox for centering */
    align-items: center; /* Vertically center the content */
    justify-content: center; /* Horizontally center the content */
  }

  .size-6 {
    width: 24px;
    height: 24px;
    display: block; /* avoid inline SVG collapsing */
  }
</style>