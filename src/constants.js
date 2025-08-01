export const COLUMN_WIDTHS = {
  asctime: '150px',
  levelname: '100px',
  name: '120px',
  filename: '150px',
  lineno: '80px',
  funcName: '100px',
  message: '1000px',
};

export const COLUMN_SIZE_LIMITS = {
  width: {
    min: 50,
    minCreation: 50,
    max: 1500,
    maxCreation: 1200,
  }
} // In px


export const headerFontSize = '1rem'; // Font size for the top row
export const cellFontSize = '0.9rem'; // Font size for the normal cells below

export const headerHeight = '60px'; // Height of the header row

const FONT_WEIGHT_LIGHT = 400;
const FONT_WEIGHT_MEDIUM = 600;
const FONT_WEIGHT_BOLD = 700;
export const LOG_LEVEL_STYLE = {
  critical: {
    color: '#8f0000',   // Dark red
    fontWeight: FONT_WEIGHT_BOLD,
  },
  error: {
    color: '#e61919',   // Bright red
    fontWeight: FONT_WEIGHT_BOLD,
  },
  warning: {
    color: '#e68100',   // Orange
    fontWeight: FONT_WEIGHT_MEDIUM,
  },
  warn: {
    color: '#e68100',   // Alias for warning
    fontWeight: FONT_WEIGHT_MEDIUM,
  },
  info: {
    color: '#0063b1',   // Blue
    fontWeight: FONT_WEIGHT_LIGHT,
  },
  debug: {
    color: '#666666',   // Dark gray
    fontWeight: FONT_WEIGHT_LIGHT,
  },
  trace: {
    color: '#cccccc',   // Light gray
    fontWeight: FONT_WEIGHT_LIGHT,
  },
  fatal: {
    color: '#a80000',   // Alias for critical, dark red
    fontWeight: FONT_WEIGHT_BOLD,
  },
  verbose: {
    color: '#006600',   // Dark green
    fontWeight: FONT_WEIGHT_LIGHT,
  },
  success: {
    color: '#228B22',   // Forest green (non-standard, but sometimes used)
    fontWeight: FONT_WEIGHT_LIGHT,
  },
  notset: {
    color: '#999999',   // Gray
    fontWeight: FONT_WEIGHT_LIGHT,
  },
};