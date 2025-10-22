import { useState, useEffect, useMemo } from 'react';
import StudyComponent from './StudyComponent';
import HayomYomComponent from '../../hayom-yom/ui/HayomYomComponent.jsx';
import ZmanimComponent from '../../zmanim/ui/ZmanimComponent.jsx';
import MinianComponent from '../../minian/ui/MinianComponent.jsx';
import { useLanguage } from '@/shared/hooks/useLanguage.js';
import styles from '../styles/StudyContainer.module.css';

const AUTO_SWITCH_DELAY = 1000000;

const StudyContainer = ({ showMinian, showHayomYom, visibleZmanim, visibleStudies }) => {
  const [visibleIndex, setVisibleIndex] = useState(0);
  const { t } = useLanguage();

  const components = useMemo(() => {
    const baseComponents = ['zmanim', 'study'];
    if (showHayomYom) {
      baseComponents.push('hayom');
    }
    if (showMinian) {
      baseComponents.push('minian');
    }
    return baseComponents;
  }, [showMinian, showHayomYom]);

  const visibleComponent = useMemo(() => components[visibleIndex] || null, [components, visibleIndex]);

  useEffect(() => {
    if (visibleIndex >= components.length) {
      setVisibleIndex(0);
    }
  }, [components, visibleIndex]);

  useEffect(() => {
    if (components.length <= 1) return;

    const timer = setTimeout(() => {
      setVisibleIndex(current => (current + 1) % components.length);
    }, AUTO_SWITCH_DELAY);

    return () => clearTimeout(timer);
  }, [visibleIndex, components]);

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tabButton} ${visibleComponent === 'zmanim' ? styles.active : ''}`}
          onClick={() => setVisibleIndex(components.indexOf('zmanim'))}
        >
          {t('ZMANIM_TITLE')}
        </button>

        <button
          className={`${styles.tabButton} ${visibleComponent === 'study' ? styles.active : ''}`}
          onClick={() => setVisibleIndex(components.indexOf('study'))}
        >
          {t('STUDY_TITLE')}
        </button>

        {showHayomYom && (
          <button
            className={`${styles.tabButton} ${visibleComponent === 'hayom' ? styles.active : ''}`}
            onClick={() => setVisibleIndex(components.indexOf('hayom'))}
          >
            {t('HAIOM_IOM_TITLE')}
          </button>
        )}
        {showMinian && (
          <button
            className={`${styles.tabButton} ${visibleComponent === 'minian' ? styles.active : ''}`}
            onClick={() => setVisibleIndex(components.indexOf('minian'))}
          >
            {t('MINIAN_TITLE')}
          </button>
        )}
      </div>
      <div className={styles.content}>
        {visibleComponent === 'zmanim' && <ZmanimComponent visibleZmanim={visibleZmanim} />}
        {visibleComponent === 'study' && <StudyComponent visibleStudies={visibleStudies} />}
        {visibleComponent === 'hayom' && showHayomYom && <HayomYomComponent />}
        {visibleComponent === 'minian' && showMinian && <MinianComponent />}
      </div>
    </div>
  );
};

export default StudyContainer;