<script>
  import { get } from 'svelte/store';
  import { updateSessionFilters, sessionFilters } from '../../stores/sessionStore.js';
  import ClearTextFieldButton from './ClearTextFieldButton.svelte';

  export let filterKey;

  const fields = [
    { label: 'Filter In', valueKey: 'filterIn', placeholder: 'Include text' },
    { label: 'Filter Out', valueKey: 'filterOut', placeholder: 'Exclude text' }
  ];

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
      <label for={`text-${filterKey}-${field.valueKey}`} style="display: block; margin-bottom: 0.3rem;">{field.label}</label>
      <div style="position: relative;">
        <input 
          id={`text-${filterKey}-${field.valueKey}`}
          type="text" 
          value={$sessionFilters[filterKey][field.valueKey]}
          placeholder={field.placeholder}
          style="width: calc(100% - 2.5rem); padding-right: 2rem;"
          on:input={(e) => updateFilter(field.valueKey, e.currentTarget.value)}
        />
        <ClearTextFieldButton clearFunc={() => clearField(field.valueKey)} />
      </div>
    </div>
  {/each}
</div>