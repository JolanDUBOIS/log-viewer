<script>
	import { get } from 'svelte/store';
  import { columnsMeta, updateAndSaveColumnMeta } from '../../stores/columnsStore.js';

	export let filterKey;

	function toggleCategoryValue(categoryValue) {
    const currentColumns = get(columnsMeta);
    const column = currentColumns[filterKey];

    if (!column || !column.filter) return;

    // Copy current filter to avoid mutating the store directly
    const newFilter = { ...column.filter };

    if (!newFilter.contains) newFilter.contains = [];
    if (!newFilter.all) newFilter.all = column.filter.all || [];

    if (newFilter.contains.includes(categoryValue)) {
      newFilter.contains = newFilter.contains.filter(value => value !== categoryValue);
    } else {
      newFilter.contains.push(categoryValue);
    }

    // Update the store with the new filter
    updateAndSaveColumnMeta({ ...column, filter: newFilter });
  }
</script>

<div style="display: flex; flex-direction: column;">
  {#each $columnsMeta[filterKey]?.filter?.all || [] as categoryValue}
		<label>
			<input 
				type="checkbox" 
        checked={$columnsMeta[filterKey]?.filter?.contains?.includes(categoryValue)}
				on:change={() => toggleCategoryValue(categoryValue)} 
			/>
			{categoryValue}
		</label>
	{/each}
</div>
