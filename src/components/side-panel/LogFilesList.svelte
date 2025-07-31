<script>
  import { get } from 'svelte/store';
  import { tick } from 'svelte'; // Import tick
  import { history } from '../../stores/historyStore.js';
  import { updateAndSaveHistory, updateCurrentPath, deleteHistoryItem } from '../../stores/historyStore.js';
  import { loadLogs } from '../../stores/logStore.js';

  $: recentFiles = $history.recent.slice(0, 5).map(entry => entry.alias);

  let fileEditMode = null;
  let inputRefs = {}; // Store references to input elements

  async function clickFile(fileAlias) {
    console.log('Clicked file:', fileAlias);
    const currentHistory = get(history);
    const entry = currentHistory.recent.find(item => item.alias === fileAlias);
    if (!entry) {
      console.error('File alias not found in history:', fileAlias);
      return;
    }

    await updateCurrentPath(entry.path);
    await loadLogs();
  }

  async function deleteFile(fileAlias) {
    console.log('Deleting file:', fileAlias);
    let filePath = get(history).recent.find(item => item.alias === fileAlias)?.path;
    await deleteHistoryItem(filePath);
  }

  async function enterEditMode(fileAlias) {
    fileEditMode = fileEditMode === fileAlias ? null : fileAlias;
    if (fileEditMode) {
      await tick(); // Wait for DOM updates
      inputRefs[fileAlias]?.focus(); // Focus the input field
    }
  }

  function handleInputKeydown(event, fileAlias) {
    const input = /** @type {HTMLInputElement} */ (event.target);
    if (event.key === 'Enter') {
      saveFileAlias(fileAlias, input.value);
      fileEditMode = null;
    }
  }

  function handleInputBlur(fileAlias, event) {
    const input = /** @type {HTMLInputElement} */ (event.target);
    saveFileAlias(fileAlias, input.value);
    fileEditMode = null;
  }

  function saveFileAlias(fileAlias, newAlias) {
    const currentHistory = get(history);
    const updatedHistory = {
      ...currentHistory,
      recent: currentHistory.recent.map(entry =>
        entry.alias === fileAlias ? { ...entry, alias: newAlias } : entry
      )
    };
    updateAndSaveHistory(updatedHistory);
  }

  function addFile() {}
</script>

<div class="log-files-list">
  {#each recentFiles as fileAlias}
    <div class="column-path-item">
      {#if fileEditMode === fileAlias}
        <input 
          type="text" 
          class="alias-input" 
          value={fileAlias} 
          placeholder="Edit alias" 
          bind:this={inputRefs[fileAlias]}
          on:keydown={(event) => handleInputKeydown(event, fileAlias)} 
          on:blur={(event) => handleInputBlur(fileAlias, event)}
        />
      {:else}
        <button class="path-button" on:click={() => clickFile(fileAlias)} title={fileAlias}>
          <span class="path-button-span">{fileAlias}</span>
        </button>
      {/if}

      <button class="edit-button" on:click={() => enterEditMode(fileAlias)} aria-label="Enter edit mode" title="Enter edit mode">
        {#if fileEditMode === fileAlias}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        {:else}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
            <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
          </svg>   
        {/if}
      </button>

      <button class="delete-button" on:click={() => deleteFile(fileAlias)} aria-label="Delete File from History" title="Delete File from History">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
          <path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>
  {/each}
</div>

<div class="add-file-section">
  <button class="add-file-button" aria-label="Upload file" title="Upload file">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-plus2-icon lucide-file-plus-2">
      <path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4"/>
      <path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M3 15h6"/>
      <path d="M6 12v6"/>
    </svg>
    Add Log File
  </button>
</div>

<style>
  .log-files-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem; /* Add spacing between items */
  }

  .log-files-list .column-path-item {
    display: flex;
    align-items: center;
    justify-content: space-between; /* Ensure buttons can be added on the left or right */
    gap: 0.1rem;
    overflow: hidden; /* Prevent overflow */
  }

  .log-files-list .path-button {
    font-size: 0.85rem; /* Smaller font size for paths */
    font-weight: normal; /* Set font weight to normal */
    flex-grow: 1; /* Allow the button to take up available space */
    text-align: left; /* Align text to the left */
    padding: 0.25rem; /* Add padding to make the hover area larger */
    align-items: center; /* Vertically center the text */
    width: 100%; /* Ensure the button spans the full width of the container */
    height: 100%; /* Ensure the button spans the full height of the container */
    white-space: nowrap; /* Prevent text from wrapping */
    overflow: hidden; /* Hide overflowing text */
    text-overflow: ellipsis; /* Add ellipsis for overflowing text */
  }

  .edit-button, .delete-button {
    padding: 0.25rem 0.6rem;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: auto; /* Push the button to the right */
  }

  .edit-button .size-6, .delete-button .size-6 {
    width: 1rem;
    height: 1rem;
  }

  .add-file-section {
    margin-top: 1rem; /* Add spacing above the upload button */
  }

  .add-file-button {
    width: 100%; /* Make the button span the entire width */
    padding: 1rem; /* Increase padding for a larger button */
    font-size: 1rem; /* Increase font size */
    background-color: #eee; /* Match header button background */
    border: 1px solid #ccc; /* Add border similar to header buttons */
    border-radius: 4px; /* Add slight rounding to corners */
    display: flex; /* Use flexbox for centering */
    align-items: center; /* Vertically center content */
    justify-content: center; /* Horizontally center content */
    cursor: pointer; /* Add pointer cursor */
    gap: 0.5rem; /* Add spacing between icon and text */
  }

  .add-file-button:hover {
    background-color: #ddd; /* Add hover effect */
  }

  .add-file-button svg {
    width: 1.5rem; /* Increase icon size */
    height: 1.5rem;
  }
</style>