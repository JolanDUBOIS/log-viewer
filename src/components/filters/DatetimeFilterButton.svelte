<script>
  import { get } from 'svelte/store';
  import { updateSessionFilters, sessionFilters } from '../../stores/sessionStore.js';
  import ClearTextFieldButton from './ClearTextFieldButton.svelte';

  export let filterKey;

  const fields = [
    { label: 'From', id: 'datetime-from', valueKey: 'from' },
    { label: 'Until', id: 'datetime-until', valueKey: 'until' }
  ]

  function updateFilter(key, value) {
    const currentFilters = get(sessionFilters);
    const newFilters = { ...currentFilters };

    if (!newFilters[filterKey]) return; // safety check

    newFilters[filterKey] = {
      ...newFilters[filterKey],
      [key]: value
    };

    updateSessionFilters(newFilters);
  }

  function clearField(key) {
    const currentFilters = get(sessionFilters);
    const newFilters = { ...currentFilters };

    if (!newFilters[filterKey]) return;

    newFilters[filterKey] = {
      ...newFilters[filterKey],
      [key]: ''
    };

    updateSessionFilters(newFilters);
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
					value={$sessionFilters[filterKey][field.valueKey]}
					on:input={(e) => updateFilter(field.valueKey, e.currentTarget.value)}
          placeholder="Enter time (e.g., YYYY-MM-DD HH:mm:ss)"
          style="width: calc(100% - 2.5rem); padding-right: 2rem;"
        />
        <ClearTextFieldButton clearFunc={() => clearField(field.valueKey)} />
      </div>
    </div>
  {/each}
</div>