import fs from 'fs';
import path from 'path';
import { touchHistoryPath } from './historyManager.js';

export function trySetLogPath(inputPath, logFilePathRef, logFileHistory) {
  const expandedPath = path.resolve(inputPath);
  if (fs.existsSync(expandedPath)) {
    logFilePathRef.value = expandedPath;
    touchHistoryPath(logFileHistory, expandedPath);
    return true;
  } else {
    return false;
  }
}