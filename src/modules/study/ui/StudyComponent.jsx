import { useMemo } from 'react';
import { useAppData } from '@/shared/hooks/useAppData.js';
import { useLanguage } from '@/shared/hooks/useLanguage.js';
import { allStudy } from '../context/studyConfig.js';
import styles from '../styles/Study.module.css';


const iconMap = {
  PARASHA: '📜', HAFTARA: '🗣️', DAF_YOMI: '📄', JUMASH: '📖',
  TEHILIM: '🎶', TANYA: '🧠', RAMBAM_1: '1📚', RAMBAM_3: '3📚', SEFER_HAMITZVOT: 'SH📚',
};

const StudyComponent = ({ visibleStudies }) => {
  const { t } = useLanguage();
  const studyData = useAppData()?.study?.studyCards;
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
        return {
          key: cfg.key,
          label: t(cfg.labelKey) || cfg.key,
          value,
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