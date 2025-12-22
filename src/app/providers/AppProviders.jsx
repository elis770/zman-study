import React from 'react';
import { DataProvider } from '@/data/DataContext.jsx';
import { LanguageProvider } from '@/shared/traslantions/LanguageContext.jsx';
import { SettingsProvider, useSettings } from '@/modules/settings/context/SettingsContext.jsx';

// Inner component that consumes settings and passes to DataProvider
function DataProviderWrapper({ children }) {
  const { city, timeFormat } = useSettings();

  return (
    <DataProvider userCity={city} timeFormat={timeFormat}>
      <LanguageProvider>{children}</LanguageProvider>
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