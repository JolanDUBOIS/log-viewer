<script>
  import { activeCellContent, activeCellPosition, closeOnHoverOutside } from '../stores/logStore.js';
  import { hideCellContent } from '../utils/uiHelpers.js';

  function handleMouseLeave() {
    hideCellContent(closeOnHoverOutside, activeCellContent, activeCellPosition);
  }
</script>

{#if $activeCellContent}
  <div 
    class="subwindow"
    aria-hidden="true"
    style={`top: ${$activeCellPosition.top}px; left: ${$activeCellPosition.left}px;`}
    on:mouseleave={handleMouseLeave}
  >
    <!-- <div style="white-space: pre-wrap; word-wrap: break-word; font-size: inherit; font-family: inherit; text-align: left;"> -->
      {$activeCellContent}
    <!-- </div> -->
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
