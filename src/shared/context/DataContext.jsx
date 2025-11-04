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

const buildStudyCards = ({
  todayJumesh,
  todayTehilim,
  todaySH,
  parasha,
  haftara,
  daf_yomi,
  Tanya,
  Rambam1,
  rambam1,
  Rambam3,
  rambam3, // desde useStudy
  dafYomi, // desde useStudy
  yerushalmiYomi, // desde useStudy
  mishnaYomi, // desde useStudy
  nachYomi, // desde useStudy
  tehillimYomi, // desde useStudy
}) => {
  return [
    {
      key: 'JUMASH',
      labelKey: 'JUMASH_TITLE',
      value: toStr(todayJumesh), // Corregido: usar todayJumesh que viene del hook
      sourceLang: 'he',
    },
    {
      key: 'TEHILIM',
      labelKey: 'TEHILIM_TITLE',
      value: toStr(todayTehilim),
      sourceLang: 'he',
    },
    {
      key: 'TANYA',
      labelKey: 'TANYA_TITLE',
      value: toStr(Tanya?.en),
      sourceLang: 'en',
    },
    {
      key: 'SEFER_HAMITZVOT',
      labelKey: 'SEFER_HAMITZVOT_TITLE',
      value: toStr(todaySH),
      sourceLang: 'he',
    },
    {
      key: 'RAMBAM_1',
      labelKey: 'RAMBAM_1_TITLE',
      value: toStr(rambam1 || Rambam1?.he), // Prioriza useStudy
      sourceLang: 'he', // Correcto
    },
    {
      key: 'RAMBAM_3',
      labelKey: 'RAMBAM_3_TITLE',
      value: toStr(rambam3 || Rambam3?.he), // Prioriza useStudy
      sourceLang: 'he', // Correcto
    },
    {
      key: 'PARASHA',
      labelKey: 'PARASHA_TITLE',
      value: toStr(parasha?.he),
      sourceLang: 'he',
    },
    {
      key: 'HAFTARA',
      labelKey: 'HAFTARA_TITLE',
      value: toStr(haftara?.he),
      sourceLang: 'he',
    },
    {
      key: 'DAF_YOMI',
      labelKey: 'DAF_YOMI_TITLE',
      value: toStr(dafYomi || daf_yomi?.he), // Prioriza useStudy (Hebcal) sobre useSefaria
      sourceLang: 'he', // Correcto
    },
    {
      key: 'YERUSHALMI_YOMI',
      labelKey: 'YERUSHALMI_YOMI_TITLE',
      value: toStr(yerushalmiYomi),
      sourceLang: 'he',
    },
    {
      key: 'MISHNA_YOMI',
      labelKey: 'MISHNA_YOMI_TITLE',
      value: toStr(mishnaYomi),
      sourceLang: 'he',
    },
    {
      key: 'NACH_YOMI',
      labelKey: 'NACH_YOMI_TITLE',
      value: toStr(nachYomi),
      sourceLang: 'he',
    },
    {
      key: 'TEHILLIM_YOMI',
      labelKey: 'TEHILLIM_YOMI_TITLE',
      value: toStr(tehillimYomi),
      sourceLang: 'he',
    },
    {
      key: 'HAYOM_YOM',
      labelKey: 'HAYOM_YOM_TITLE',
      value: ' ', // El valor se maneja en su propio componente
      sourceLang: 'he',
    },
  ]
};

export const DataProvider = ({ children, userCity }) => {
  // 1) Tiempo / geoloc
  const gregorianData = useGregorianTime({ city: userCity });
  const { date } = gregorianData;

  // 2) Fecha hebrea
  const hebrewData = useHebrewDate(date);

  // 3) Fuentes
  const sefariaData = useSefaria({ ...gregorianData, userCity });
  const studyData = useStudy({ ...gregorianData, ...hebrewData, lang: 'he', userCity });
  const hayomYom = useHayomYom();
  const hdateData = useHdate({ ...gregorianData, userCity });

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
    () => buildStudyCards({ ...studyData, ...sefariaData }),
    [studyData, sefariaData]
  );

  // 6) Valor final
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
      hayomYom,
      studyCards,
      loading: studyData.loading || sefariaData.loading || hayomYom.loading,
    },
  }), [gregorianData, hebrewData, hebrewDate, hdateData, studyData, sefariaData, hayomYom, studyCards]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};