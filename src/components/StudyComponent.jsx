import { useAppData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import styles from '../style/Study.module.css';

const StudyComponent = () => {
  const {
    todayJumesh,
    todayTehilim,
    todaySH,
    parasha,
    haftara,
    daf_yomi,
    Tanya,
    Rambam1,
    Rambam3,
    loading,
    loadingGeo,
  } = useAppData();
  const { t } = useLanguage();

  // Propuesta de iconos para cada estudio
  const iconMap = {
    PARASHA: '📜',
    HAFTARA: '🗣️',
    DAF_YOMI: '📄',
    JUMASH: '📖',
    TEHILIM: '🎶',
    TANYA: '🧠',
    RAMBAM_1: '📚',
    RAMBAM_3: '📚',
    SEFER_HAMITZVOT: '📜',
  };

  if (loading || loadingGeo) {
    return null;
  }

  // Construir la lista de estudios a mostrar
  const studyList = [
    { key: 'PARASHA', label: t('PARASHA_TITLE'), value: parasha?.he, show: !!parasha },
    { key: 'HAFTARA', label: t('HAFTARA_TITLE'), value: haftara?.he, show: !!haftara },
    { key: 'DAF_YOMI', label: t('DAF_YOMI_TITLE'), value: daf_yomi?.he, show: !!daf_yomi },
    { key: 'JUMASH', label: t('JUMASH'), value: todayJumesh, show: !!todayJumesh },
    { key: 'TEHILIM', label: t('TEHILIM'), value: todayTehilim, show: !!todayTehilim },
    { key: 'TANYA', label: t('TANYA'), value: Tanya?.en, show: !!Tanya },
    { key: 'RAMBAM_1', label: t('RAMBAM_1'), value: Rambam1?.he, show: !!Rambam1 },
    { key: 'RAMBAM_3', label: t('RAMBAM_3'), value: Rambam3?.he, show: !!Rambam3 },
    { key: 'SEFER_HAMITZVOT', label: t('SEFER_HAMITZVOT_TITLE'), value: todaySH, show: !!todaySH },
  ].filter(item => item.show);

  if (studyList.length === 0) {
    return null;
  }

  return (
    <>
      <div className={styles.studyContainer}>
        {studyList.map(study => (
          <div key={study.key} className={styles.studyItem}>
            <div className={styles.iconContainer}>
              {iconMap[study.key] || '📖'}
            </div>
            <div className={styles.textContainer}>
              <span className={styles.label}>{study.label}</span>
              <span className={styles.value}>{study.value}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default StudyComponent;