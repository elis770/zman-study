import { useState, useEffect, useMemo } from 'react';
import StudyComponent from './StudyComponent';
import HayomYomComponent from './HayomYomComponent';
import ZmanimComponent from './ZmanimComponent';
import MinianComponent from './MinianComponent';
import { useLanguage } from '../context/LanguageContext';
import styles from '../style/StudyContainer.module.css';

const AUTO_SWITCH_DELAY = 10000;

const StudyContainer = ({ showMinian, showHayomYom, visibleZmanim, visibleStudies }) => {
  const [visibleComponent, setVisibleComponent] = useState('zmanim');
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

  useEffect(() => {
    if (!components.includes(visibleComponent)) {
      setVisibleComponent(components[0] || null);
    }

    if (components.length <= 1) {
      return; // No timer if only one or zero tabs
    }

    const timer = setTimeout(() => {
      setVisibleComponent(current => {
        const currentIndex = components.indexOf(current);
        const nextIndex = (currentIndex + 1) % components.length;
        return components[nextIndex];
      });
    }, AUTO_SWITCH_DELAY);

    return () => clearTimeout(timer);
  }, [visibleComponent, components]);

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tabButton} ${visibleComponent === 'zmanim' ? styles.active : ''}`}
          onClick={() => setVisibleComponent('zmanim')}
        >
          {t('ZMANIM_TITLE')}
        </button>

        <button
          className={`${styles.tabButton} ${visibleComponent === 'study' ? styles.active : ''}`}
          onClick={() => setVisibleComponent('study')}
        >
          {t('STUDY_TITLE')}
        </button>

        {showHayomYom && (
          <button
            className={`${styles.tabButton} ${visibleComponent === 'hayom' ? styles.active : ''}`}
            onClick={() => setVisibleComponent('hayom')}
          >
            {t('HAIOM_IOM_TITLE')}
          </button>
        )}
        {showMinian && (
          <button
            className={`${styles.tabButton} ${visibleComponent === 'minian' ? styles.active : ''}`}
            onClick={() => setVisibleComponent('minian')}
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