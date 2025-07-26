<script>
  import { activeCellPopup, closeOnHoverOutside } from '../stores/logStore.js';
  import { hideCellContent } from '../utils/uiHelpers.js';

  function handleMouseLeave() {
    hideCellContent(closeOnHoverOutside, activeCellPopup);
  }
</script>

{#if $activeCellPopup}
  <div 
    class="subwindow"
    aria-hidden="true"
    style={`top: ${$activeCellPopup.position.top}px; left: ${$activeCellPopup.position.left}px;`}
    on:mouseleave={handleMouseLeave}
  >
      {$activeCellPopup.content}
  </div>
{/if}

<style>
  .subwindow {
    position: absolute;
    max-width: calc(100vw - 40px);
    background: #fff;
    border: 1px solid #ccc;
    padding: 0.4rem 0.6rem;
    z-index: 20;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

    white-space: pre-wrap;
    word-wrap: break-word;
    font-size: inherit;
    font-family: inherit;
    text-align: left;
  }
</style>
