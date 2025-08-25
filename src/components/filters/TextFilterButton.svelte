<script>
  import { get } from 'svelte/store';
  import { columnsMeta, updateAndSaveColumnMeta } from '../../stores/columnsStore.js';
  import ClearTextFieldButton from './ClearTextFieldButton.svelte';

  export let filterKey;

  const fields = [
    { label: 'Filter In', valueKey: 'filterIn', placeholder: 'Include text' },
    { label: 'Filter Out', valueKey: 'filterOut', placeholder: 'Exclude text' }
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
      <label for={`text-${filterKey}-${field.valueKey}`} style="display: block; margin-bottom: 0.3rem;">
        {field.label}
      </label>
      <div style="position: relative;">
        <input 
          id={`text-${filterKey}-${field.valueKey}`}
          type="text" 
          value={$columnsMeta[filterKey]?.filter?.[field.valueKey] || ''}
          placeholder={field.placeholder}
          style="width: calc(100% - 2.5rem); padding-right: 2rem;"
          on:input={(e) => updateFilter(field.valueKey, e.currentTarget.value)}
        />
        <ClearTextFieldButton clearFunc={() => clearField(field.valueKey)} />
      </div>
    </div>
  {/each}
</div>
