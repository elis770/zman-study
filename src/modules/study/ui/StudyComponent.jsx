import { useMemo } from 'react';
import { useAppData } from '@/shared/hooks/useAppData.js';
import { useLanguage } from '@/shared/hooks/useLanguage.js';
import { allStudy } from '../context/studyConfig.js';
import styles from '../styles/Study.module.css';

// Helper: obtener valor por ruta "a.b.c"
const getByPath = (obj, path) =>
  path.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj);

// Alias: cada clave lógica -> posibles rutas en studyData (según tu captura)
const KEY_PATHS = {
  PARASHA: ['studyCards.PARASHA.text', 'parasha.he', 'parasha.en'],
  HAFTARA: ['studyCards.HAFTARA.text', 'haftara.he', 'haftara.en'],
  DAF_YOMI: ['studyCards.DAF_YOMI.text', 'daf_yomi.he', 'daf_yomi.en'],
  JUMASH: ['studyCards.JUMASH.text', 'todayJumesh'],
  TEHILIM: ['studyCards.TEHILIM.text', 'todayTehilim'],
  TANYA: ['studyCards.TANYA.text', 'Tanya.he', 'Tanya.en'],
  RAMBAM_1: ['studyCards.RAMBAM_1.text', 'Rambam1.he', 'Rambam1.en'],
  RAMBAM_3: ['studyCards.RAMBAM_3.text', 'Rambam3.he', 'Rambam3.en'],
  SEFER_HAMITZVOT: ['studyCards.SEFER_HAMITZVOT.text', 'todaySH'],
};

const iconMap = {
  PARASHA: '📜', HAFTARA: '🗣️', DAF_YOMI: '📄', JUMASH: '📖',
  TEHILIM: '🎶', TANYA: '🧠', RAMBAM_1: '1📚', RAMBAM_3: '3📚', SEFER_HAMITZVOT: 'SH📚',
};

const StudyComponent = ({ visibleStudies }) => {
  const { t } = useLanguage();
  const studyData = useAppData()?.study;
  
  if (!studyData || Object.keys(studyData).length === 0) {
    return <div>No hay datos de study disponibles.</div>;
  }

  const studyList = useMemo(() => {
    // Si no pasan visibleStudies, mostramos todo allStudy
    const allowedKeys =
      Array.isArray(visibleStudies) && visibleStudies.length
        ? visibleStudies
        : allStudy.map(s => s.key);

    return allStudy
      .filter(cfg => allowedKeys.includes(cfg.key))
      .map(cfg => {
        const candidates = KEY_PATHS[cfg.key] || [cfg.key];
        const foundPath = candidates.find(p => {
          const v = getByPath(studyData, p);
          return v !== undefined && v !== null && String(v).trim() !== '';
        });
        const value = foundPath ? getByPath(studyData, foundPath) : null;
        return {
          key: cfg.key,
          label: t(cfg.labelKey) || cfg.key,
          value,
          sourcePath: foundPath || '—',
          icon: iconMap[cfg.key] || '⏳',
        };
      })
      .filter(item => item.value); // solo los que tienen algo para mostrar
  }, [studyData, visibleStudies, t]);

  // Debug: ver qué ruta se usó para cada key
  // console.table(studyList.map(x => ({ key: x.key, sourcePath: x.sourcePath, value: String(x.value).slice(0, 40) })));

  if (!studyList.length) return null;

  return (
    <div className={styles.studyContainer}>
      {studyList.map(item => (
        <div key={item.key} className={styles.studyItem}>
          <div className={styles.iconContainer}>{item.icon}</div>
          <div className={styles.textContainer}>
            <span className={styles.label}>{item.label}</span>
            <span className={styles.value}>
              {typeof item.value === 'string'
                ? item.value
                : // si viene objeto {he,en}, preferimos he y luego en
                  item.value?.he || item.value?.en || JSON.stringify(item.value)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StudyComponent;