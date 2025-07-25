<script>
  import { filteredLogs } from '../stores/logStore.js'; 
</script>

<div class="footer" style={`height: 'auto';`}>
  Rows displayed: {$filteredLogs.length}
</div>

<style>
  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #eee;
    text-align: center;
    border-top: 1px solid #ccc;
    line-height: var(--footer-height, 50px); /* Default height */
  }
</style>