import { createContext, useContext } from 'react';
import useGregorianTime from '../hooks/useGregorianTime';
import useHebrewDate from '../hooks/useHebrewDate';
import useSefaria from '../hooks/useSefaria';
import useHdate from '../hooks/useHdate';
import useStudy from '../hooks/useStudy';

const AppContext = createContext(null);

export const DataProvider = ({ children }) => {
  const gregorianData = useGregorianTime();
  const { date, tzid, latitude, longitude } = gregorianData;

  const hebrewData = useHebrewDate(date);
  const { hebrewObj } = hebrewData;

  const sefariaData = useSefaria();
  const studyData = useStudy({ hebrewObj });
  const hdateData = useHdate({ tzid, latitude, longitude });

  const value = {
    ...gregorianData,
    ...hebrewData,
    ...sefariaData,
    ...studyData,
    ...hdateData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppData = () => {
  const context = useContext(AppContext);
  if (context === null) {
    throw new Error('useAppData must be used within a DataProvider');
  }
  return context;
};