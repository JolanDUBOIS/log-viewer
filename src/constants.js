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


export const columnsAlias = {
  created: 'Created',
  asctime: 'Time',
  levelname: 'Level',
  name: 'Logger',
  filename: 'File',
  lineno: 'Line',
  funcName: 'Func',
  message: 'Message',
}