<script>
  import { get } from 'svelte/store';
  import { columnsMeta, updateAndSaveColumnMeta } from '../../stores/columnsStore.js';
  import ClearTextFieldButton from './ClearTextFieldButton.svelte';

  export let filterKey;

  const fields = [
    { label: 'From', id: 'datetime-from', valueKey: 'from' },
    { label: 'Until', id: 'datetime-until', valueKey: 'until' }
  ];

  function updateFilter(key, value) {
    const currentColumns = get(columnsMeta);
    const column = currentColumns[filterKey];
    if (!column || !column.filter) return;

    const newFilter = { ...column.filter, [key]: value };
    updateAndSaveColumnMeta({ ...column, filter: newFilter });
  }

  function clearField(key) {
    const currentColumns = get(columnsMeta);
    const column = currentColumns[filterKey];
    if (!column || !column.filter) return;

    const newFilter = { ...column.filter, [key]: '' };
    updateAndSaveColumnMeta({ ...column, filter: newFilter });
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
          value={$columnsMeta[filterKey]?.filter?.[field.valueKey] || ''}
          on:input={(e) => updateFilter(field.valueKey, e.currentTarget.value)}
          placeholder="Enter time (e.g., YYYY-MM-DD HH:mm:ss)"
          style="width: calc(100% - 2.5rem); padding-right: 2rem;"
        />
        <ClearTextFieldButton clearFunc={() => clearField(field.valueKey)} />
      </div>
    </div>
  {/each}
</div>
