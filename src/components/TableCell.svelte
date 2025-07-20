<script>
  import { showCellContent } from "../utils/uiHelpers";
  import { activeCellContent, activeCellPosition } from '../stores/logStore.js';
  export let width;
  export let value;
</script>

<td style={`width: ${width || 'auto'};`}>
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div 
    class="table-cell"
    on:click={(event) => showCellContent(event, value, activeCellContent, activeCellPosition)}
  >
    {value}
  </div>
</td>

<style>
  .table-cell {
    overflow-x: auto;
    white-space: nowrap;
    cursor: pointer;
  }

  td {
    border: 1px solid #ccc;
    padding: 0.4rem 0.6rem;
    text-align: left;
    white-space: nowrap; /* Ensure all fields are displayed as one-liners */
    overflow: hidden; /* Hide overflow content */
    text-overflow: ellipsis; /* Add ellipsis for overflow content */
  }

  td div {
    overflow-x: auto; /* Enable horizontal scrolling for cell content */
    white-space: nowrap; /* Prevent wrapping of text */
  }

  td div::-webkit-scrollbar {
    height: 5px; /* Set scrollbar thickness */
  }

  td div::-webkit-scrollbar-thumb {
    background: #ccc; /* Set scrollbar thumb color */
    border-radius: 3px; /* Round scrollbar edges */
  }

  td div::-webkit-scrollbar-track {
    background: #f1f1f1; /* Set scrollbar track color */
  }
</style>