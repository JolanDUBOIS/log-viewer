<div class="side-panel">
  <h2>Side Panel</h2>
  <p>Settings or filters go here...</p>
</div>

<style>
  .side-panel {
    position: absolute; /* Changed from fixed to absolute */
    top: 0;
    left: 0;
    width: var(--panel-width, 280px); /* default width */
    height: 100%; /* Adjusted to fit within parent container */
    max-height: 100%; /* Prevent overflow beyond the parent container */
    background-color: #f9f9f9;
    border-right: 1px solid #ccc;
    padding: 1rem;
    box-sizing: border-box;
    z-index: 50;
  }
</style>