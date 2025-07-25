export function isDropdownVisible(key, state) {
  const entry = state[key];
  return !!(entry?.buttonHovered || entry?.dropdownHovered);
}