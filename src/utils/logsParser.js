export function parseLogLines(rawText) {
  if (!rawText.trim()) return [];
  
  return rawText
    .split('\n')
    .filter(line => line.trim())
    .map(line => JSON.parse(line));
}
