<script>
	import { selectedLevels } from '../stores/logStore.js';
	export let key;
	export let levels;
	export let showFilter;
	export let dropdownWidth;
  export let toggleDropdown;
	export let getDropdownPosition;

  // function applyLevelFilter() {
  //   filteredLogs.set($logs.filter(log => $selectedLevels.has(log.levelname)));
  // }

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

<div 
	role="button" 
	tabindex="0" 
	style="position: relative;" 
	on:mouseenter={(event) => {
		toggleDropdown(key, true);
		const position = getDropdownPosition(event);
		showFilter[key] = { visible: true, position };
	}} 
	on:mouseleave={() => toggleDropdown(key, false)}
>
<button>Filter</button>
{#if showFilter[key]?.visible}
	<div style={`border: 1px solid #ccc; padding: 0.5rem; background: #fff; position: fixed; top: ${showFilter[key].position.top}px; left: ${showFilter[key].position.left}px; width: ${dropdownWidth}; z-index: 10;`}>
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
	</div>
{/if}
</div>
