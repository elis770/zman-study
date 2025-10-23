import { createContext, useMemo } from 'react';
import { HDate } from '@hebcal/core';
import useGregorianTime from '../../modules/time/hooks/useGregorianTime.js';
import useHebrewDate from '../../modules/time/hooks/useHebrewDate.js';
import useSefaria from '../../modules/study/hooks/useSefaria.js';
import useHdate from '../../modules/time/hooks/useHdate.js';
import useHayomYom from '../../modules/hayom-yom/hooks/useHayomYom.js';
import useStudy from '../../modules/study/hooks/useStudy.js';
// import { LanguageContext } from './LanguageContext.jsx'; // Comentado: evitar dependencia circular

export const AppContext = createContext(null);

// Helpers
const toStr = (v) => (typeof v === 'string' ? v : v?.toString?.() ?? '');

// Convierte el objeto/estructura de cada estudio en un STRING seguro y declara su idioma de origen.
// Este es el único lugar donde definimos “qué campo usar”.
const buildStudyCards = ({
  todayJumesh,
  todayTehilim,
  todaySH,
  parasha,
  haftara,
  daf_yomi,
  Tanya,
  Rambam1,
  Rambam3,
}) => {
  return {
    JUMASH: {
      key: 'JUMASH',
      labelKey: 'JUMASH',
      value: toStr(todayJumesh), // Corregido: usar todayJumesh que viene del hook
      sourceLang: 'he',
    },
    TEHILIM: {
      key: 'TEHILIM',
      labelKey: 'TEHILIM',
      value: toStr(todayTehilim),
      sourceLang: 'he', // Correcto
    },
    TANYA: {
      key: 'TANYA',
      labelKey: 'TANYA',
      value: toStr(Tanya?.en),
      sourceLang: 'en', // Correcto
    },
    SEFER_HAMITZVOT: {
      key: 'SEFER_HAMITZVOT',
      labelKey: 'SEFER_HAMITZVOT_TITLE',
      value: toStr(todaySH), // Corregido: todaySH ya viene como string renderizado
      sourceLang: 'he',
    },
    RAMBAM_1: {
      key: 'RAMBAM_1',
      labelKey: 'RAMBAM_1',
      value: toStr(Rambam1?.he),
      sourceLang: 'he', // Correcto
    },
    RAMBAM_3: {
      key: 'RAMBAM_3',
      labelKey: 'RAMBAM_3',
      value: toStr(Rambam3?.he),
      sourceLang: 'he', // Correcto
    },
    PARASHA: {
      key: 'PARASHA',
      labelKey: 'PARASHA_TITLE',
      value: toStr(parasha?.he),
      sourceLang: 'he', // Correcto
    },
    HAFTARA: {
      key: 'HAFTARA',
      labelKey: 'HAFTARA_TITLE',
      value: toStr(haftara?.he),
      sourceLang: 'he', // Correcto
    },
    DAF_YOMI: {
      key: 'DAF_YOMI',
      labelKey: 'DAF_YOMI_TITLE',
      value: toStr(daf_yomi?.he),
      sourceLang: 'he', // Correcto
    },
  };
};

export const DataProvider = ({ children }) => {
  // 1) Tiempo y geo
  const gregorianData = useGregorianTime(); // { date, loading, error, ... }
  const { date } = gregorianData;

  // 2) Fecha hebrea
  const hebrewData = useHebrewDate(date); // { hebrewObj, hebrewDate?, ... }

  // 3) Fuentes de contenido
  const sefariaData = useSefaria(gregorianData); // Inyectar dependencia
  const studyData = useStudy({ ...gregorianData, ...hebrewData, lang: 'he' }); // Usar hebreo por defecto
  const hayomYom = useHayomYom();          // { title, text, loading, error }
  const hdateData = useHdate(gregorianData); // Inyectar dependencia

  // 4) Derivados
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

  const loadingGeo = gregorianData.loading;
  const geoError = gregorianData.error;

  // 5) View-model unificado para Study (todo como string + sourceLang)
  const studyCards = useMemo(
    () => buildStudyCards({ ...studyData, ...sefariaData }),
    [studyData, sefariaData]
  );

  const value = {
    // datos crudos por si otros componentes los necesitan
    ...gregorianData,
    ...hebrewData,
    ...sefariaData,
    ...hdateData,
    ...studyData,
    hayomYom,

    // derivados
    hebrewDate,
    loadingGeo,
    geoError,

    // view-modeles
    studyCards, // <- el StudyComponent ahora consume esto directamente
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
