import { createContext, useMemo } from 'react';
import { HDate } from '@hebcal/core';

import useGregorianTime from '../../modules/time/hooks/useGregorianTime.js';
import useHebrewDate from '../../modules/time/hooks/useHebrewDate.js';
import useSefaria from '../../modules/study/hooks/useSefaria.js';
import useHdate from '../../modules/zmanim/hooks/useHdate.js';
import useHayomYom from '../../modules/hayom-yom/hooks/useHayomYom.js';
import useStudy from '../../modules/study/hooks/useStudy.js';

export const AppContext = createContext(null);

// --- HELPERS ---
const toStr = (v) => (typeof v === 'string' ? v : v?.toString?.() ?? '');
const keyMapping = {
  Jumash: { key: 'JUMASH', labelKey: 'JUMASH_TITLE', lang: 'he' },
  Tehilim: { key: 'TEHILIM', labelKey: 'TEHILIM_TITLE', lang: 'he' },
  'Tanya.en': { key: 'TANYA', labelKey: 'TANYA_TITLE', lang: 'en' },
  SH: { key: 'SEFER_HAMITZVOT', labelKey: 'SEFER_HAMITZVOT_TITLE', lang: 'he' },
  rambam1: { key: 'RAMBAM_1', labelKey: 'RAMBAM_1_TITLE', lang: 'he' },
  rambam3: { key: 'RAMBAM_3', labelKey: 'RAMBAM_3_TITLE', lang: 'he' },
  DafYomi: { key: 'DAF_YOMI', labelKey: 'DAF_YOMI_TITLE', lang: 'he' },
  Yerushalmi: { key: 'YERUSHALMI_YOMI', labelKey: 'YERUSHALMI_YOMI_TITLE', lang: 'he' },
  MishnaYomi: { key: 'MISHNA_YOMI', labelKey: 'MISHNA_YOMI_TITLE', lang: 'he' },
  NachYomi: { key: 'NACH_YOMI', labelKey: 'NACH_YOMI_TITLE', lang: 'he' },
  TanakhYomi: { key: 'TANACH_YOMI', labelKey: 'TANACH_YOMI_TITLE', lang: 'he' },
};
const keyMapping2 = {
  'parasha.he': { key: 'PARASHA', labelKey: 'PARASHA_TITLE', lang: 'he' },
  'haftara.he': { key: 'HAFTARA', labelKey: 'HAFTARA_TITLE', lang: 'he' },
};

const buildCards = (data, keyMapping) => {
  // Crear un mapeo de claves de datos a claves de configuración
  if (!data || typeof data !== 'object') return [];

  return Object.entries(keyMapping).map(([dataKey, config]) => {
    let value = '';
    
    if (dataKey.includes('.')) {
      // Acceso a propiedades anidadas: 'parasha.he' -> data.parasha?.he
      const parts = dataKey.split('.');
      let nestedValue = data;
      for (const part of parts) {
        if (nestedValue === undefined || nestedValue === null) break;
        nestedValue = nestedValue[part];
      }
      value = toStr(nestedValue);
    } else {
      // Acceso directo: 'Jumash' -> data.Jumash
      value = toStr(data[dataKey]);
    }
    
    return {
      key: config.key,
      labelKey: config.labelKey,
      value,
      sourceLang: config.lang,
    };
  }).filter(card => card.value); // Filtrar tarjetas vacías
};

export const DataProvider = ({ children, userCity, timeFormat }) => {
  // 1) Tiempo / geoloc
  const gregorianData = useGregorianTime({ city: userCity, timeFormat });
  const { date } = gregorianData;

  // 2) Fecha hebrea
  const hebrewData = useHebrewDate(date);

  // 3) Fuentes
  const sefariaData = useSefaria({ ...gregorianData, userCity });
  const studyData = useStudy({
    ...gregorianData,
    ...hebrewData,
    lang: 'he',
    userCity,
  });
  const hayomYom = useHayomYom();
  const hdateData = useHdate({ ...gregorianData, userCity, timeFormat });

  // 4) Hebrew date fallback
  const hebrewDate = useMemo(() => {
    if (typeof hebrewData.hebrewDate === 'string' && hebrewData.hebrewDate) {
      return hebrewData.hebrewDate;
    }
    try {
      return new HDate(date).toString();
    } catch {
      return '';
    }
  }, [hebrewData.hebrewDate, date]);

  // 5) Study cards finales
  const studyCards = useMemo(
    () => buildCards({ ...studyData, ...sefariaData }, keyMapping),
    [studyData, sefariaData]
  );
  // 5) Study cards finales
  const jadashotCards = useMemo(
    () => buildCards({ ...sefariaData }, keyMapping2),
    [sefariaData]
  );

  // 6) Valor final
  const value = useMemo(
    () => ({
      time: {
        ...gregorianData,
        hebrewDate,
        loading: gregorianData.loading,
        error: gregorianData.error,
      },
      zmanim: {
        ...hdateData,
        loading: hdateData.loading,
      },
      study: {
        studyCards,
        loading: studyData.loading || sefariaData.loading,
      },
      hayomYom: {
        hayomYom,
        loading: hayomYom.loading,
      },
      jadashot: {
        jadashotCards,
        candleLighting: hdateData.shkiah,
        tzet_hashabat: hdateData.tzeit,
        loading: sefariaData.loading,
      },
    }),
    [
      gregorianData,
      hebrewData,
      hebrewDate,
      hdateData,
      studyData,
      sefariaData,
      hayomYom,
      studyCards,
      jadashotCards,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
