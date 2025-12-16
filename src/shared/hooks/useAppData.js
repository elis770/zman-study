import { useContext } from 'react';
import { AppContext } from '@/shared/context/DataContext.jsx';

export const useAppData = () => {
  const ctx = useContext(AppContext);
  if (ctx === null)
    throw new Error('useAppData must be used within a DataProvider');
  return ctx;
};