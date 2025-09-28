import styles from '../styles/GeneralSettings.module.css';

const GeneralSettings = ({
  t,
  language,
  toggleLanguage,
  showMinian,
  toggleShowMinian,
  showHayomYom,
  toggleShowHayomYom,
}) => {
  return (
    <div className={styles.buttonGroup}>
      <button onClick={toggleLanguage} className={styles.modalButton}>
        {t(language === 'es' ? 'CHANGE_TO_HEBREW' : 'CHANGE_TO_SPANISH')}
      </button>
      <button onClick={toggleShowMinian} className={styles.modalButton}>
        {showMinian ? t('HIDE_MINIAN') : t('SHOW_MINIAN')}
      </button>
      <button onClick={toggleShowHayomYom} className={styles.modalButton}>
        {showHayomYom ? t('HIDE_HAYOM_YOM') : t('SHOW_HAYOM_YOM')}
      </button>
    </div>
  );
};

export default GeneralSettings;