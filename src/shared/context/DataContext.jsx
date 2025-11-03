import { createContext, useMemo } from 'react';
import { HDate } from '@hebcal/core';
import useGregorianTime from '../../modules/time/hooks/useGregorianTime.js';
import useHebrewDate from '../../modules/time/hooks/useHebrewDate.js';
import useSefaria from '../../modules/study/hooks/useSefaria.js';
import useHdate from '../../modules/zmanim/hooks/useHdate.js';
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
  rambam1, // desde useStudy
  Rambam3,
  rambam3, // desde useStudy
  dafYomi, // desde useStudy
  yerushalmiYomi, // desde useStudy
  mishnaYomi, // desde useStudy
  nachYomi, // desde useStudy
  tehillimYomi, // desde useStudy
}) => {
  return {
    JUMASH: {
      key: 'JUMASH',
      labelKey: 'JUMASH_TITLE',
      value: toStr(todayJumesh), // Corregido: usar todayJumesh que viene del hook
      sourceLang: 'he',
    },
    TEHILIM: {
      key: 'TEHILIM',
      labelKey: 'TEHILIM_TITLE',
      value: toStr(todayTehilim),
      sourceLang: 'he', // Correcto
    },
    TANYA: {
      key: 'TANYA',
      labelKey: 'TANYA_TITLE',
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
      labelKey: 'RAMBAM_1_TITLE',
      value: toStr(rambam1 || Rambam1?.he), // Prioriza useStudy
      sourceLang: 'he', // Correcto
    },
    RAMBAM_3: {
      key: 'RAMBAM_3',
      labelKey: 'RAMBAM_3_TITLE',
      value: toStr(rambam3 || Rambam3?.he), // Prioriza useStudy
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
      value: toStr(dafYomi || daf_yomi?.he), // Prioriza useStudy (Hebcal) sobre useSefaria
      sourceLang: 'he', // Correcto
    },
    YERUSHALMI_YOMI: {
      key: 'YERUSHALMI_YOMI',
      labelKey: 'YERUSHALMI_YOMI_TITLE',
      value: toStr(yerushalmiYomi),
      sourceLang: 'he',
    },
    MISHNA_YOMI: {
      key: 'MISHNA_YOMI',
      labelKey: 'MISHNA_YOMI_TITLE',
      value: toStr(mishnaYomi),
      sourceLang: 'he',
    },
    NACH_YOMI: {
      key: 'NACH_YOMI',
      labelKey: 'NACH_YOMI_TITLE',
      value: toStr(nachYomi),
      sourceLang: 'he',
    },
    TEHILLIM_YOMI: {
      key: 'TEHILLIM_YOMI',
      labelKey: 'TEHILLIM_YOMI_TITLE',
      value: toStr(tehillimYomi),
      sourceLang: 'he',
    },
    HAYOM_YOM: {
      key: 'HAYOM_YOM',
      labelKey: 'HAYOM_YOM_TITLE',
      value: ' ', // El valor se maneja en su propio componente
      sourceLang: 'he',
    },
  };
};

export const DataProvider = ({ children, userCity }) => {
  // 1) Tiempo y geo
  const gregorianData = useGregorianTime({ city: userCity });
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

  // 5) Agrupamos todo en las categorías solicitadas
  const value = useMemo(() => ({
    time: {
      ...gregorianData,
      ...hebrewData,
      hebrewDate,
      loading: gregorianData.loading,
      error: gregorianData.error,
    },
    zmanim: {
      ...hdateData,
      loading: hdateData.loading,
    },
    study: {
      ...studyData,
      ...sefariaData,
      hayomYom,
      studyCards,
      loading: studyData.loading || sefariaData.loading || hayomYom.loading,
    },
  }), [gregorianData, hebrewData, hebrewDate, hdateData, studyData, sefariaData, hayomYom, studyCards]);


  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};