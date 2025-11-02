import { useState, useEffect, useMemo } from 'react';
import StudyComponent from '../modules/study/ui/StudyComponent.jsx';
import HayomYomComponent from '../modules/hayom-yom/ui/HayomYomComponent.jsx';
import ZmanimComponent from '../modules/zmanim/ui/ZmanimComponent.jsx';
import MinianComponent from '../modules/minian/ui/MinianComponent.jsx';
import AvisosComponent from '../modules/avisos/ui/AvisosComponent.jsx';
import { useLanguage } from '../shared/hooks/useLanguage.js';
import styles from './StudyContainer.module.css';

const StudyContainer = ({ showMinian, showHayomYom, showAvisos, customAvisos, visibleZmanim, visibleStudies, autoSwitchDelay }) => {
  const { t } = useLanguage();
  const [visibleIndex, setVisibleIndex] = useState(0);

  const components = useMemo(() => {
    const baseComponents = ['zmanim', 'study'];
    if (showAvisos) {
      baseComponents.push('avisos');
    }
    if (showHayomYom) {
      baseComponents.push('hayom');
    }
    if (showMinian) {
      baseComponents.push('minian');
    }
    return baseComponents;
  }, [showMinian, showHayomYom, showAvisos]);

  useEffect(() => {
    if (visibleIndex >= components.length) {
      setTimeout(() => setVisibleIndex(0), 0);
    }
  }, [components, visibleIndex]);

  useEffect(() => {
    if (components.length <= 1) return;

    const timer = setTimeout(() => {
      setVisibleIndex(current => (current + 1) % components.length);
    }, autoSwitchDelay);

    return () => clearTimeout(timer);
  }, [visibleIndex, components, autoSwitchDelay]);

  const visibleComponent = components[visibleIndex] || null;

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

        {showAvisos && (
          <button
            className={`${styles.tabButton} ${visibleComponent === 'avisos' ? styles.active : ''}`}
            onClick={() => setVisibleIndex(components.indexOf('avisos'))}
          >
            {t('AVISOS_EVENTS_TITLE')}
          </button>
        )}

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
        {visibleComponent === 'avisos' && showAvisos && <AvisosComponent customAvisos={customAvisos} />}
        {visibleComponent === 'hayom' && showHayomYom && <HayomYomComponent />}
        {visibleComponent === 'minian' && showMinian && <MinianComponent />}
      </div>
    </div>
  );
};

export default StudyContainer;