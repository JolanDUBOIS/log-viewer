import { writable } from 'svelte/store';
import { getActiveFile, postSelectActiveFile, postOpenActiveFile } from '../api/activeFile';

// activeFile is an object with keys: path, alias, read_at
export const activeFile = writable(null);

export async function loadActiveFile() {
  console.log('Loading active file from backend...');
  const file = await getActiveFile();
  activeFile.set(file);
}

export async function selectActiveFile(file) {
  console.log('Selecting active file:', file);
  const updatedFile = await postSelectActiveFile(file);
  activeFile.set(updatedFile);
  return updatedFile;
}

export async function openActiveFile(path) {
  console.log('Opening active file at path:', path);
  const file = await postOpenActiveFile(path);
  activeFile.set(file);
  return file;
}

export async function clearActiveFile() {
  console.log('Clearing active file');
  activeFile.set(null);
}