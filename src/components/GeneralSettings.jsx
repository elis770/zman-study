import styles from '../style/GeneralSettings.module.css';

const GeneralSettings = ({
  t,
  theme,
  toggleTheme,
  language,
  toggleLanguage,
  showMinian,
  toggleShowMinian,
  showHayomYom,
  toggleShowHayomYom,
  btnStyle,
}) => {
  return (
    <div className={styles.buttonGroup}>
      <button onClick={toggleTheme} className={styles.modalButton} style={btnStyle}>
        Cambiar a modo {theme === 'dark' ? 'claro' : 'oscuro'}
      </button>
      <button onClick={toggleLanguage} className={styles.modalButton} style={btnStyle}>
        {t(language === 'es' ? 'CHANGE_TO_HEBREW' : 'CHANGE_TO_SPANISH')}
      </button>
      <button onClick={toggleShowMinian} className={styles.modalButton} style={btnStyle}>
        {showMinian ? t('HIDE_MINIAN') : t('SHOW_MINIAN')}
      </button>
      <button onClick={toggleShowHayomYom} className={styles.modalButton} style={btnStyle}>
        {showHayomYom ? t('HIDE_HAYOM_YOM') : t('SHOW_HAYOM_YOM')}
      </button>
    </div>
  );
};

export default GeneralSettings;