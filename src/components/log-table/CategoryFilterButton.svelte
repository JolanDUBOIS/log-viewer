<script>
	import { get } from 'svelte/store';
	import { updateSessionParams, sessionColumnFilters } from '../../stores/sessionStore.js';

	export let filterKey;

	function toggleCategoryValue(categoryValue) {
		const currentFilters = get(sessionColumnFilters);
		const newFilters = { ...currentFilters };

		if (!newFilters[filterKey]) {
			newFilters[filterKey] = { contains: [], all: [] };
		}

		if (newFilters[filterKey].contains.includes(categoryValue)) {
			newFilters[filterKey].contains = newFilters[filterKey].contains.filter(value => value !== categoryValue);
		} else {
			newFilters[filterKey].contains.push(categoryValue);
		}
		
		updateSessionParams(newFilters);
	}
</script>

<div style="display: flex; flex-direction: column;">
	{#each $sessionColumnFilters[filterKey].all as categoryValue}
		<label>
			<input 
				type="checkbox" 
				checked={$sessionColumnFilters[filterKey].contains.includes(categoryValue)}
				on:change={() => toggleCategoryValue(categoryValue)} 
			/>
			{categoryValue}
		</label>
	{/each}
</div>
