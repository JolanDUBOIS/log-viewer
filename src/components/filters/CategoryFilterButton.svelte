<script>
	import { get } from 'svelte/store';
	import { updateSessionFilters, sessionFilters } from '../../stores/sessionStore.js';

	export let filterKey;

	function toggleCategoryValue(categoryValue) {
		const currentFilters = get(sessionFilters);
		const newFilters = { ...currentFilters };

		if (!newFilters[filterKey]) {
			newFilters[filterKey] = { contains: [], all: [] };
		}

		if (newFilters[filterKey].contains.includes(categoryValue)) {
			newFilters[filterKey].contains = newFilters[filterKey].contains.filter(value => value !== categoryValue);
		} else {
			newFilters[filterKey].contains.push(categoryValue);
		}
		
		updateSessionFilters(newFilters);
	}
</script>

<div style="display: flex; flex-direction: column;">
	{#each $sessionFilters[filterKey].all as categoryValue}
		<label>
			<input 
				type="checkbox" 
				checked={$sessionFilters[filterKey].contains.includes(categoryValue)}
				on:change={() => toggleCategoryValue(categoryValue)} 
			/>
			{categoryValue}
		</label>
	{/each}
</div>
