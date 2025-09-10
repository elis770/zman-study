import { useState } from 'react';
import StudyComponent from './StudyComponent';
import HayomYomComponent from './HayomYomComponent';
import ZmanimComponent from './ZmanimComponent';
import { useLanguage } from '../context/LanguageContext';
import styles from '../style/StudyContainer.module.css';

const StudyContainer = () => {
  const [visibleComponent, setVisibleComponent] = useState('zmanim');
  const { t } = useLanguage();

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
        <button
          className={`${styles.tabButton} ${visibleComponent === 'hayom' ? styles.active : ''}`}
          onClick={() => setVisibleComponent('hayom')}
        >
          {t('HAIOM_IOM_TITLE')}
        </button>
      </div>
      <div className={styles.content}>
        {visibleComponent === 'zmanim' && <ZmanimComponent />}
        {visibleComponent === 'study' && <StudyComponent />}
        {visibleComponent === 'hayom' && <HayomYomComponent />}
      </div>
    </div>
  );
};

export default StudyContainer;