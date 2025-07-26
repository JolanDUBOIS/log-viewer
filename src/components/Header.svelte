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
    <button
      on:click={toggleOrder}
      class="order-toggle-button"
      title={`Sort: ${order === 'asc' ? 'Oldest first' : 'Newest first'}`}
      aria-label={`Sort: ${order === 'asc' ? 'Oldest first' : 'Newest first'}`}
    >
      BT
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
  }
</style>