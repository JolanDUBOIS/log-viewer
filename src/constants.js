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


export const columnLayoutConfig = {
  created: {
    alias: 'Created',
    shown: false,
    absoluteMinWidth: '0px',
    creationMinWidth: '0px',
    absoluteMaxWidth: '100px',
    creationMaxWidth: '100px',
  },
  asctime: {
    alias: 'Time',
    shown: true,
    absoluteMinWidth: '50px',
    creationMinWidth: '100px',
    absoluteMaxWidth: '200px',
    creationMaxWidth: '150px',
  },
  levelname: {
    alias: 'Level',
    shown: true,
    absoluteMinWidth: '60px',
    creationMinWidth: '60px',
    absoluteMaxWidth: '150px',
    creationMaxWidth: '100px',
  },
  name: {
    alias: 'Logger',
    shown: true,
    absoluteMinWidth: '60px',
    creationMinWidth: '80px',
    absoluteMaxWidth: '200px',
    creationMaxWidth: '150px',
  },
  filename: {
    alias: 'File',
    shown: true,
    absoluteMinWidth: '50px',
    creationMinWidth: '70px',
    absoluteMaxWidth: '150px',
    creationMaxWidth: '120px',
  },
  lineno: {
    alias: 'Line',
    shown: true,
    absoluteMinWidth: '50px',
    creationMinWidth: '50px',
    absoluteMaxWidth: '100px',
    creationMaxWidth: '70px',
  },
  funcName: {
    alias: 'Func',
    shown: true,
    absoluteMinWidth: '50px',
    creationMinWidth: '80px',
    absoluteMaxWidth: '200px',
    creationMaxWidth: '100px',
  },
  message: {
    alias: 'Message',
    shown: true,
    absoluteMinWidth: '50px',
    creationMinWidth: '100px',
    absoluteMaxWidth: '1500px',
    creationMaxWidth: '1200px',
  }
}