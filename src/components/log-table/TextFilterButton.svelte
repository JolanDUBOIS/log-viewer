<script>
  import { textFilters } from '../../stores/logStore.js';
  import ClearTextFieldButton from './ClearTextFieldButton.svelte';
  export let filterKey;

  const fields = [
    { label: 'Filter In', id: `filter-in-{key}`, valueKey: 'filterIn', placeholder: 'Include text' },
    { label: 'Filter Out', id: `filter-out-{key}`, valueKey: 'filterOut', placeholder: 'Exclude text' }
  ];

  function clearTextFilter(field) {
    textFilters.update(filters => {
      return {
        ...filters,
        [field]: { filterIn: '', filterOut: '' }
      };
    });
  }

  function updateTextFilter(valueKey, value) {
    textFilters.update(filters => ({
      ...filters,
      [filterKey]: {
        ...filters[filterKey],
        [valueKey]: value
      }
    }));
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
          value={$textFilters[filterKey][field.valueKey]}
          placeholder={field.placeholder}
          style="width: calc(100% - 2.5rem); padding-right: 2rem;"
          on:input={(e) => updateTextFilter(field.valueKey, e.currentTarget.value)}
        />
        <ClearTextFieldButton clearFunc={() => clearTextFilter(filterKey)} />
      </div>
    </div>
  {/each}
</div>