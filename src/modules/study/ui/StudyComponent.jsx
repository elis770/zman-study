import { useAppData } from '@/shared/hooks/useAppData.js';
import { useLanguage } from '@/shared/hooks/useLanguage.js';
import styles from '../styles/Study.module.css';
// import TrasladeText from '@/shared/context/TrasladeText.jsx'; // Comentado: mostrar texto original sin traducciones

const StudyComponent = ({ visibleStudies }) => {
  const { studyCards, loading, loadingGeo } = useAppData();
  const { t } = useLanguage();
  const iconMap = {
    PARASHA: '📜', HAFTARA: '🗣️', DAF_YOMI: '📄', JUMASH: '📖', TEHILIM: '🎶', TANYA: '🧠', RAMBAM_1: '1📚', RAMBAM_3: '3📚', SEFER_HAMITZVOT: 'SH📚',
  };

  if (loading || loadingGeo) return <div>Cargando estudios...</div>;

  // Tomamos ya normalizados; filtramos por visibilidad y por existencia de texto
  const list = Object.values(studyCards)
    .filter(item => visibleStudies.includes(item.key))
    .filter(item => item.value)
    .filter(item => item.key !== 'PARASHA' && item.key !== 'HAFTARA');

  if (!list.length) return null;

  return (
    <div className={styles.studyContainer}>

      {list.map(item => (
        <div key={item.key} className={styles.studyItem}>
          <div className={styles.iconContainer}>{iconMap[item.key] || '📖'}</div>
          <div className={styles.textContainer}>
            <span className={styles.label}>{t(item.labelKey)}</span>
            {/* Mostrar texto original sin traducciones - mantener idioma de la librería hebcal */}
            <span className={styles.value}>{item.value}</span>
            {/* <TrasladeText text={item.value} sourceLang={item.sourceLang} /> */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StudyComponent;