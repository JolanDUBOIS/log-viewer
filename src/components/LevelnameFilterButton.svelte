<script>
	import { selectedLevels } from '../stores/logStore.js';
	export let levels;

	function toggleLevel(level) {
		selectedLevels.update(levels => {
			const newSet = new Set(levels);
			if (newSet.has(level)) {
				newSet.delete(level);
			} else {
				newSet.add(level);
			}
			return newSet;
		});
	}
</script>

<div style="display: flex; flex-direction: column;">
	{#each levels as level}
		<label>
			<input 
				type="checkbox" 
				checked={$selectedLevels.has(level)} 
				on:change={() => toggleLevel(level)} 
			/>
			{level}
		</label>
	{/each}
</div>
