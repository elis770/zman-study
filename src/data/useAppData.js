import { useContext } from 'react';
import { AppContext } from './AppContext.js';

export const useAppData = () => {
  const ctx = useContext(AppContext);
  if (ctx === null)
    throw new Error('useAppData must be used within a DataProvider');
  return ctx;
};