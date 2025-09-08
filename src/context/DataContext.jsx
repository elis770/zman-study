// context/DataContext.jsx
import { createContext, useContext, useMemo } from 'react';
import { HDate } from '@hebcal/core';
import useGregorianTime from '../hooks/useGregorianTime';
import useHebrewDate from '../hooks/useHebrewDate';
import useSefaria from '../hooks/useSefaria';
import useHdate from '../hooks/useHdate';
import useStudy from '../hooks/useStudy';

const AppContext = createContext(null);

export const DataProvider = ({ children }) => {
  // 1) Tiempo gregoriano + geo
  const gregorianData = useGregorianTime();
  const { date } = gregorianData;

  // 2) Fecha hebrea (tu hook) — puede devolver hebrewObj u otras props
  const hebrewData = useHebrewDate(date);
  const { hebrewObj } = hebrewData;

  // 3) Otras fuentes
  // Pass all required data to avoid internal hook calls and data waterfalls.
  const sefariaData = useSefaria(gregorianData);
  const studyData = useStudy({ ...gregorianData, ...hebrewData });

  // 4) Zmanim
  const hdateData = useHdate(gregorianData);

  // --- Derivados / alias que tu UI espera ---
  // A) hebrewDate legible siempre (si tu hook no lo da formateado)
  const hebrewDate = useMemo(() => {
    // Si tu useHebrewDate ya expone un string, usalo:
    if (typeof hebrewData.hebrewDate === 'string' && hebrewData.hebrewDate) {
      return hebrewData.hebrewDate;
    }
    // Si trae algo como hebrewObj?.toString o partes sueltas, adaptalo:
    try {
      return new HDate(date).toString(); // "1 Tishrei 5786", etc.
    } catch {
      return '';
    }
  }, [hebrewData.hebrewDate, date]);

  // B) Alias para nombres que usa tu TimeComponent
  const loadingGeo = gregorianData.loading;
  const geoError = gregorianData.error;

  const value = {
    ...gregorianData,  // formattedDate, time, tzid, city, country, loading, error, etc.
    ...hebrewData,     // hebrewObj y lo que ya tengas
    ...sefariaData,
    ...studyData,
    ...hdateData,

    // Alias / derivados
    hebrewDate,
    loadingGeo,
    geoError,
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