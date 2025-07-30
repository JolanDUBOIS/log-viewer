<script>
  import ClearTextFieldButton from './ClearTextFieldButton.svelte';
  import { get } from 'svelte/store';
  import { updateSessionParams, sessionColumnFilters } from '../../stores/sessionStore.js';

  export let filterKey;

  const fields = [
    { label: 'From', id: 'datetime-from', valueKey: 'from' },
    { label: 'Until', id: 'datetime-until', valueKey: 'until' }
  ]

  function updateFilter(key, value) {
    const currentFilters = get(sessionColumnFilters);
    const newFilters = { ...currentFilters };

    if (!newFilters[filterKey]) return; // safety check

    newFilters[filterKey] = {
      ...newFilters[filterKey],
      [key]: value
    };

    updateSessionParams(newFilters);
  }

  function clearField(key) {
    const currentFilters = get(sessionColumnFilters);
    const newFilters = { ...currentFilters };

    if (!newFilters[filterKey]) return;

    newFilters[filterKey] = {
      ...newFilters[filterKey],
      [key]: ''
    };

    updateSessionParams(newFilters);
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
					value={$sessionColumnFilters[filterKey][field.valueKey]}
					on:input={(e) => updateFilter(field.valueKey, e.currentTarget.value)}
          placeholder="Enter time (e.g., YYYY-MM-DD HH:mm:ss)"
          style="width: calc(100% - 2.5rem); padding-right: 2rem;"
        />
        <ClearTextFieldButton clearFunc={() => clearField(field.valueKey)} />
      </div>
    </div>
  {/each}
</div>