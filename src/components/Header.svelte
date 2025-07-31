<script>
  import { filteredLogs, logs, sortOrder } from '../stores/logStore.js'; 
  import { headerHeight } from '../constants.js';
  import { isSidePanelOpen } from '../stores/uiStore.js';
  import { loadLogs } from '../stores/logStore.js';

  let reloading = false;

  function toggleOrder() {
    console.log('Toggling sort order');
    sortOrder.update(o => o === 'asc' ? 'desc' : 'asc');
  }

  function toggleSidePanel() {
    console.log('Toggling side panel');
    isSidePanelOpen.update(open => !open);
  }

  async function reloadLogs() {
    console.log('Reloading logs');
    reloading = true; // Set reloading to true
    await loadLogs(); // Fetch new logs
    reloading = false; // Reset reloading to false
  }
</script>

<div class="header-bar" style={`--header-height: ${headerHeight}`}>
  <div class="left-section">

    <button class="side-panel-toggle-button" on:click={toggleSidePanel} aria-label="Settings" title="Settings">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-panel-left-icon lucide-panel-left">
        <rect width="18" height="18" x="3" y="3" rx="2"/>
        <path d="M9 3v18"/>
      </svg>
    </button>

    <button 
      class="reload {reloading ? 'loading' : ''}" 
      on:click={reloadLogs} 
      aria-label="Reload Logs" 
      title="Reload Logs" 
      disabled={reloading}>
      {#if reloading}
        <svg xmlns="http://www.w3.org/2000/svg" class="size-5 spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle class="path" cx="12" cy="12" r="10" stroke-linecap="round"></circle>
        </svg>
      {:else}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
          <path fill-rule="evenodd" d="M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466l-.312-.311h2.433a.75.75 0 0 0 0-1.5H3.989a.75.75 0 0 0-.75.75v4.242a.75.75 0 0 0 1.5 0v-2.43l.31.31a7 7 0 0 0 11.712-3.138.75.75 0 0 0-1.449-.39Zm1.23-3.723a.75.75 0 0 0 .219-.53V2.929a.75.75 0 0 0-1.5 0V5.36l-.31-.31A7 7 0 0 0 3.239 8.188a.75.75 0 1 0 1.448.389A5.5 5.5 0 0 1 13.89 6.11l.311.31h-2.432a.75.75 0 0 0 0 1.5h4.243a.75.75 0 0 0 .53-.219Z" clip-rule="evenodd" />
        </svg>
      {/if}
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

  <div class="right-section">
    <span>Rows displayed: {$filteredLogs.length} / {$logs.length}</span>
  </div>
</div>

<style>
  .header-bar {
    height: var(--header-height);
    flex-shrink: 0;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    background: #eee;
    border-bottom: 1px solid #ccc;
    display: flex;
    align-items: center;
    padding: 0 1rem;
    box-sizing: border-box;
    overflow: hidden;
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
    display: flex; /* Use flexbox for alignment */
    align-items: center; /* Vertically center content */
    gap: 0.5rem; /* Add spacing between text and button */
  }

  .order-toggle-button, .side-panel-toggle-button, .reload {
    font-size: 1rem;
    padding: 0.5rem 1rem;
    cursor: pointer;
    height: 100%; /* Make the button fill the header's height */
    display: flex; /* Use flexbox for centering */
    align-items: center; /* Vertically center the content */
    justify-content: center; /* Horizontally center the content */
  }

  .reload.loading {
    cursor: not-allowed;
    opacity: 0.6;
  }

  .spinner {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .size-6, .size-5 {
    width: 24px;
    height: 24px;
    display: block; /* avoid inline SVG collapsing */
  }
</style>