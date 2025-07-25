<script>
  export let clearFunc;
</script>

<button 
  class="clear-btn"
  aria-label="Clear text field"
  on:click={clearFunc}
>
  ✖
</button>

<style>
  .clear-btn {
    position: absolute;
    top: 50%;
    right: 0.3rem;
    transform: translateY(-50%);
    font-size: 0.8rem;
    padding: 0rem 0.2rem;
    border: none;
    background: transparent;
    cursor: pointer;
  }
</style>