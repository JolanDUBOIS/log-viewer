import os from 'os';
import path from 'path';

export function expandHomeDir(filepath) {
  if (filepath.startsWith('~')) {
    return path.join(os.homedir(), filepath.slice(1));
  }
  return filepath;
}