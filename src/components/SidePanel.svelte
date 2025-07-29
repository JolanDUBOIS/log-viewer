<script>
  import { headerHeight } from '../constants.js';
</script>

<div class="side-panel" style={`--header-height: ${headerHeight}`}>
  <h2>Side Panel</h2>
  <p>Here we add the possibility for the user to rename columns, to define which will be shown and which will not... Potentially also define which type of columns they are (time, text, number, level/select type) though it would be nice to have it automated...</p>
  <p>Other settings (dark mode, toggle color for level, etc.)</p>
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