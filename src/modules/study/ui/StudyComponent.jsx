import { useAppData } from '@/shared/hooks/useAppData.js';
import { useLanguage } from '@/shared/hooks/useLanguage.js';
import styles from '../styles/Study.module.css';
import { use } from 'react';

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

export default function StudyComponent() {
  const { study } = useAppData();
  const { t } = useLanguage();
  //console.log(study)
  if (!study?.studyCards?.length) {
    return <div>No hay datos de estudio disponibles.</div>;
  }

  const cards = study.studyCards.filter(c => c.value && c.value.trim() !== '');

  return (
    <div className={styles.studyContainer}>
      {cards.map(card => (
        <div key={card.key} className={styles.studyItem}>
          <div className={styles.iconContainer}>
            {iconMap[card.key] || '📚'}
          </div>

          <div className={styles.textContainer}>
            <span className={styles.label}>
              {t(card.labelKey)}
            </span>

            <span className={styles.value}>
              {card.value}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}