import { useAppData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import styles from '../style/Study.module.css';

const StudyComponent = ({ visibleStudies }) => {
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

  //console.log('todaySH:', todaySH);
  // Propuesta de iconos para cada estudio
  const iconMap = {
    PARASHA: '📜',
    HAFTARA: '🗣️',
    DAF_YOMI: '📄',
    JUMASH: '📖',
    TEHILIM: '🎶',
    TANYA: '🧠',
    RAMBAM_1: '1📚',
    RAMBAM_3: '3📚',
    SEFER_HAMITZVOT: 'SH📚',
  };

  if (loading || loadingGeo) {
    return null;
  }

  // Construir la lista de estudios a mostrar
  const allStudiesData = {
    JUMASH: { label: t('JUMASH'), value: todayJumesh },
    TEHILIM: { label: t('TEHILIM'), value: todayTehilim },
    TANYA: { label: t('TANYA'), value: Tanya?.en },
    SEFER_HAMITZVOT: { label: t('SEFER_HAMITZVOT_TITLE'), value: todaySH?.render() },
    RAMBAM_1: { label: t('RAMBAM_1'), value: Rambam1?.he },
    RAMBAM_3: { label: t('RAMBAM_3'), value: Rambam3?.he },
    PARASHA: { label: t('PARASHA_TITLE'), value: parasha?.he },
    HAFTARA: { label: t('HAFTARA_TITLE'), value: haftara?.he },
    DAF_YOMI: { label: t('DAF_YOMI_TITLE'), value: daf_yomi?.he },
  };

  const studyList = visibleStudies
    .map(key => ({ key, ...allStudiesData[key] }))
    .filter(study => study.value);

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