import styles from '../style/SettingsModal.module.css';
import { allZmanim } from '../hooks/zmanimConfig.js';
import { allStudies } from '../hooks/studyConfig.js';

const SettingsModal = ({ isOpen, onClose, theme, toggleTheme, language, toggleLanguage, t, showMinian, toggleShowMinian, showHayomYom, toggleShowHayomYom, visibleZmanim, onZmanimChange, visibleStudies, onStudiesChange }) => {
  if (!isOpen) {
    return null;
  }

  const buttonStyles = {
    color: theme === 'dark' ? '#fff' : '#000',
    backgroundColor: theme === 'dark' ? '#333' : '#eee',
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
        <h2>{t('SETTINGS_TITLE') || 'Configuración'}</h2>
        <div className={styles.buttonGroup}>
          <button
            onClick={toggleTheme}
            className={styles.modalButton}
            style={buttonStyles}
          >
            Cambiar a modo {theme === 'dark' ? 'claro' : 'oscuro'}
          </button>
          <button
            onClick={toggleLanguage}
            className={styles.modalButton}
            style={buttonStyles}
          >
            {t(language === 'es' ? 'CHANGE_TO_HEBREW' : 'CHANGE_TO_SPANISH')}
          </button>
          <button
            onClick={toggleShowMinian}
            className={styles.modalButton}
            style={buttonStyles}
          >
            {showMinian ? t('HIDE_MINIAN') : t('SHOW_MINIAN')}
          </button>
          <button
            onClick={toggleShowHayomYom}
            className={styles.modalButton}
            style={buttonStyles}
          >
            {showHayomYom ? t('HIDE_HAYOM_YOM') : t('SHOW_HAYOM_YOM')}
          </button>
        </div>

        <div className={styles.settingsSection}>
          <h3>{t('ZMANIM_TITLE')}</h3>
          <div className={styles.checkboxGroup}>
            {allZmanim.map(zman => (
              <label key={zman.key} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={visibleZmanim.includes(zman.key)}
                  onChange={() => onZmanimChange(zman.key)}
                />
                {t(zman.labelKey)}
              </label>
            ))}
          </div>
        </div>

        <div className={styles.settingsSection}>
          <h3>{t('STUDY_TITLE')}</h3>
          <div className={styles.checkboxGroup}>
            {allStudies.map(study => (
              <label key={study.key} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={visibleStudies.includes(study.key)}
                  onChange={() => onStudiesChange(study.key)}
                />
                {t(study.labelKey)}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;