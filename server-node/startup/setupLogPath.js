import { trySetLogPath } from '../managers/logsManager.js';

export function setupLogPath(logPath, logFilePathRef, logFileHistory) {
  if (!logPath) return;

  const ok = trySetLogPath(logPath, logFilePathRef, logFileHistory);
  if (!ok) {
    console.warn('Invalid log path at startup, using empty path.');
  }
}
