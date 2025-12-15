import React from 'react';
import { DataProvider } from '@/shared/context/DataContext';
import { LanguageProvider } from '@/shared/context/LanguageContext';
import { SettingsProvider, useSettings } from '@/components/SettingsContext';

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