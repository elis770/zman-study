import React from 'react';
import { DataProvider } from '@/shared/context/DataContext';
import { LanguageProvider } from '@/shared/context/LanguageContext';

export default function AppProviders({ children }) {
  return (
    <React.StrictMode>
      <DataProvider>
        <LanguageProvider>{children}</LanguageProvider>
      </DataProvider>
    </React.StrictMode>
  );
}