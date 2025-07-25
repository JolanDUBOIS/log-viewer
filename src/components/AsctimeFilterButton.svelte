<script>
	import { asctimeFilter } from '../stores/logStore.js';
  import ClearTextFieldButton from './ClearTextFieldButton.svelte';

  const fields = [
    { label: 'From', id: 'asctime-from', valueKey: 'from' },
    { label: 'Until', id: 'asctime-until', valueKey: 'until' }
  ]

  function clearAsctimeFilter() {
    asctimeFilter.set({ from: '', until: '' });
  }
</script>

<div style="display: flex; flex-direction: column; gap: 0.5rem;">
  {#each fields as field}
    <div>
      <label for={field.id} style="display: block; margin-bottom: 0.3rem;">{field.label}</label>
      <div style="position: relative;">
        <input 
          id={field.id}
          type="text" 
          bind:value={$asctimeFilter[field.valueKey]}
          placeholder="Enter time (e.g., YYYY-MM-DD HH:mm:ss)"
          style="width: calc(100% - 2.5rem); padding-right: 2rem;"
        />
        <ClearTextFieldButton 
          clearFunc={clearAsctimeFilter} 
        />
      </div>
    </div>
  {/each}
</div>