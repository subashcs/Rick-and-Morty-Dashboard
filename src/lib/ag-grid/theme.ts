import { themeQuartz } from 'ag-grid-community';

export const tableTheme = themeQuartz.withParams({
  accentColor: '#15BDE8',
  backgroundColor: 'var(--chakra-colors-gray-800)',
  borderColor: '#ffffff00',
  borderRadius: 20,
  browserColorScheme: 'dark',
  cellHorizontalPaddingScale: 1,
  chromeBackgroundColor: {
    ref: 'backgroundColor',
  },
  columnBorder: false,
  fontFamily: {
    googleFont: 'Avenir',
  },
  fontSize: 16,
  foregroundColor: '#BBBEC9',
  headerBackgroundColor: '#111111',
  headerFontSize: 14,
  headerFontWeight: 500,
  headerTextColor: '#FFFFFF',
  headerVerticalPaddingScale: 0.9,
  iconSize: 20,
  rowBorder: false,
  rowVerticalPaddingScale: 1.2,
  sidePanelBorder: false,
  spacing: 8,
  wrapperBorder: false,
  wrapperBorderRadius: 0,
});
