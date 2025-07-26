<script>
  import { filteredLogs, logs } from '../stores/logStore.js'; 
  import { headerHeight } from '../constants.js';

  let order = 'desc'; // 'asc' or 'desc'

  function toggleOrder() {
    order = order === 'asc' ? 'desc' : 'asc';
  }
</script>

<div class="header-bar" style={`--header-height: ${headerHeight}`}>
  <div class="left-section">Rows displayed: {$filteredLogs.length} / {$logs.length}</div>
  <div class="center-section">Log Viewer</div>
  <div class="right-section">
    <button class="order-toggle-button" on:click={toggleOrder} aria-label="Toggle sort order" title="Toggle sort order">
      {#if order === 'asc'}
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
</div>

<style>
  .header-bar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background-color: #eee;
    text-align: center;
    border-bottom: 1px solid #ccc;
    line-height: var(--header-height);
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1rem;
    box-sizing: border-box; /* Ensure padding is included in the width */
    overflow: hidden; /* Prevent content from overflowing */
  }

  .left-section {
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
    text-align: right;
  }

  .order-toggle-button {
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