import { themeQuartz } from 'ag-grid-community';

// Common theme properties
const commonTheme = {
  fontFamily: {
    googleFont: 'Avenir',
  },
  fontSize: 16,
  rowHeight: 60,
  headerVerticalPaddingScale: 0.9,
  sidePanelBorder: false,
  wrapperBorder: false,
  wrapperBorderRadius: 0,
};

// Dark Theme
export const tableThemeDark = themeQuartz.withParams({
  ...commonTheme,
  accentColor: '#15BDE8',
  backgroundColor: 'var(--chakra-colors-gray-800)',
  borderColor: '#ffffff0f',
  borderRadius: 10,
  browserColorScheme: 'dark',
  cellHorizontalPaddingScale: 1,
  chromeBackgroundColor: {
    ref: 'backgroundColor',
  },
  columnBorder: false,
  foregroundColor: '#BBBEC9',
  headerBackgroundColor: '#111111',
  headerFontWeight: 500,
  headerTextColor: '#FFFFFF',
});

// Light Theme
export const tableThemeLight = themeQuartz.withParams({
  ...commonTheme,
  browserColorScheme: 'light',
  backgroundColor: 'var(--chakra-colors-gray-50)',
});
