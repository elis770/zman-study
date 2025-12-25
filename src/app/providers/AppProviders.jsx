import React from 'react';
import { DataProvider } from '../../data/DataContext.jsx';
import { LanguageProvider } from '@/shared/traslantions/LanguageContext.jsx';
import { SettingsProvider, useSettings } from '@/modules/settings/context/SettingsContext.jsx';

import { ThemeProvider, CssBaseline } from '@mui/material';
import { getTheme } from '@/shared/theme/theme.js';

// Consumes theme key and mode to provide MUI ThemeProvider
function MUIThemeProviderWrapper({ children }) {
  const { currentThemeKey, themeMode } = useSettings();
  const theme = getTheme(currentThemeKey, themeMode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

// Inner component that consumes settings and passes to DataProvider
function DataProviderWrapper({ children }) {
  const { city, timeFormat } = useSettings();

  return (
    <DataProvider userCity={city} timeFormat={timeFormat}>
      <MUIThemeProviderWrapper>
        <LanguageProvider>{children}</LanguageProvider>
      </MUIThemeProviderWrapper>
    </DataProvider>
  );
}

export default function AppProviders({ children }) {
  return (
    <React.StrictMode>
      <SettingsProvider>
        <DataProviderWrapper>{children}</DataProviderWrapper>
      </SettingsProvider>
    </React.StrictMode>
  );
}