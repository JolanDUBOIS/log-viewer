<script>
  import { activeCellPopup } from '../stores/uiStore.js';
  $: console.log('ActiveCellPopup store value:', $activeCellPopup);
</script>

{#if $activeCellPopup}
  <div 
    class="cell-popup"
    aria-hidden="true"
    style={`
      top: ${$activeCellPopup.position.top}px;
      left: ${$activeCellPopup.position.left}px;
      width: ${$activeCellPopup.dimensions.width}px;
    `}
  >
      {$activeCellPopup.content}
  </div>
{/if}

<style>
  .cell-popup {
    position: absolute;
    max-width: calc(100vw - 40px);
    background: #fff;
    border: 1px solid #ccc;
    padding: 0.4rem 0.6rem;
    z-index: 20;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

    white-space: pre-wrap;
    word-wrap: break-word;
    font-size: 0.85rem;
    font-family: inherit;
    text-align: left;
  }
</style>
