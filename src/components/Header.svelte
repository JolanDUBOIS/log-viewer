<script>
  import { filteredLogs, logs } from '../stores/logStore.js'; 
  import { headerHeight } from '../constants.js';
</script>

<div class="header-bar" style={`--header-height: ${headerHeight}`}>
  <div class="left-section">Rows displayed: {$filteredLogs.length} / {$logs.length}</div>
  <div class="center-section">Log Viewer</div>
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
</style>