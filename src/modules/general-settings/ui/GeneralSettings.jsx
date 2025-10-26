import styles from '../styles/GeneralSettings.module.css';

const GeneralSettings = ({
  t,
  language,
  toggleLanguage,
  showMinian,
  toggleShowMinian,
  showHayomYom,
  toggleShowHayomYom,
  autoSwitchDelay,
  onAutoSwitchDelayChange,
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

      <div className={styles.sliderContainer}>
        <label htmlFor="autoSwitchDelay">Intervalo de rotación de estudios (segundos)</label>
        <input
          type="range"
          id="autoSwitchDelay"
          min="1"
          max="30"
          value={autoSwitchDelay / 1000}
          onChange={(e) => onAutoSwitchDelayChange(e.target.value * 1000)}
          className={styles.slider}
        />
        <span>{autoSwitchDelay / 1000}s</span>
      </div>
    </div>
  );
};

export default GeneralSettings;