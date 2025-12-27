import { useMemo } from 'react';
import { HDate } from '@hebcal/core';

import useGregorianTime from './time/useGregorianTime.js';
import useHebrewDate from './time/useHebrewDate.js';
import useSefaria from './study/useSefaria.js';
import useHdate from './zmanim/useHdate.js';
import useHayomYom from './hayom-yom/useHayomYom.js';
import useStudy from './study/useStudy.js';

import { AppContext } from './AppContext.js';

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
  const { date, tzid } = gregorianData;

  // 2) Zmanim (necesario para saber si ya pasó la puesta del sol)
  const hdateData = useHdate({ ...gregorianData, userCity, timeFormat });

  // 3) Fecha hebrea (usando la zona horaria y el flag de puesta del sol)
  const hebrewData = useHebrewDate(date, tzid, hdateData.isAfterSunset);

  // 4) Fuentes
  const sefariaData = useSefaria({ ...gregorianData, userCity });
  const studyData = useStudy({
    ...gregorianData,
    ...hebrewData,
    lang: 'he',
    userCity,
  });
  const hayomYom = useHayomYom();

  // 5) Hebrew date fallback
  const hebrewDate = useMemo(() => {
    if (typeof hebrewData.hebrewDate === 'string' && hebrewData.hebrewDate) {
      return hebrewData.hebrewDate;
    }
    try {
      // Usar la fecha en la zona horaria correcta para el fallback también
      let dateToUse = date;
      if (tzid) {
        const dateString = date.toLocaleString("en-US", { timeZone: tzid });
        dateToUse = new Date(dateString);
      }
      return new HDate(dateToUse).toString();
    } catch {
      return '';
    }
  }, [hebrewData.hebrewDate, date, tzid]);

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
        hebrewObj: hebrewData.hebrewObj,
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
