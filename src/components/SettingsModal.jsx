import { useState, useEffect } from 'react';
import styles from '../style/SettingsModal.module.css';
import GeneralSettings from './GeneralSettings.jsx';
import ZmanimSettings from './ZmanimSettings.jsx';
import StudySettings from './StudySettings.jsx';
import AvisosSettings from './AvisosSettings.jsx';

const SettingsModal = ({
  isOpen, onClose,
  theme, toggleTheme,
  language, toggleLanguage,
  t,
  showMinian, toggleShowMinian,
  showHayomYom, toggleShowHayomYom,
  visibleZmanim, onZmanimChange,
  visibleStudies, onStudiesChange,
  customAvisos, onAddAviso, onDeleteAviso
}) => {
  const [expanded, setExpanded] = useState({
    general: true, zmanim: true, study: true, avisos: true
  });

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    if (isOpen) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const btnStyle = {
    color: theme === 'dark' ? '#fff' : '#000',
    backgroundColor: theme === 'dark' ? '#333' : '#eee',
  };

  const toggle = (k) => setExpanded(s => ({ ...s, [k]: !s[k] }));

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContent}
        role="dialog" aria-modal="true" aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <button className={styles.closeButton} onClick={onClose} aria-label="Cerrar">×</button>
          <h2 id="modal-title">{t('SETTINGS_TITLE') || 'Configuración'}</h2>
          {/* espacio a la derecha para balancear layout */}
          <span style={{ width: 28 }} />
        </div>

        <div className={styles.scrollableContent}>
          {/* General */}
          <div className={styles.settingsSection}>
            <div className={styles.sectionHeader} onClick={() => toggle('general')}>
              <h3>{t('GENERAL_SETTINGS') || 'Configuración General'}</h3>
              <span>{expanded.general ? '−' : '+'}</span>
            </div>
            {expanded.general && (
              <div className={styles.sectionContent}>
                <GeneralSettings
                  t={t}
                  theme={theme}
                  toggleTheme={toggleTheme}
                  language={language}
                  toggleLanguage={toggleLanguage}
                  showMinian={showMinian}
                  toggleShowMinian={toggleShowMinian}
                  showHayomYom={showHayomYom}
                  toggleShowHayomYom={toggleShowHayomYom}
                  btnStyle={btnStyle}
                />
              </div>
            )}
          </div>

          {/* Zmanim */}
          <div className={styles.settingsSection}>
            <div className={styles.sectionHeader} onClick={() => toggle('zmanim')}>
              <h3>{t('ZMANIM_TITLE')}</h3>
              <span>{expanded.zmanim ? '−' : '+'}</span>
            </div>
            {expanded.zmanim && (
              <div className={styles.sectionContent}>
                <ZmanimSettings
                  t={t}
                  visibleZmanim={visibleZmanim}
                  onZmanimChange={onZmanimChange}
                />
              </div>
            )}
          </div>

          {/* Estudio */}
          <div className={styles.settingsSection}>
            <div className={styles.sectionHeader} onClick={() => toggle('study')}>
              <h3>{t('STUDY_TITLE')}</h3>
              <span>{expanded.study ? '−' : '+'}</span>
            </div>
            {expanded.study && (
              <div className={styles.sectionContent}>
                <StudySettings
                  t={t}
                  visibleStudies={visibleStudies}
                  onStudiesChange={onStudiesChange}
                />
              </div>
            )}
          </div>

          {/* Avisos y Eventos */}
          <div className={styles.settingsSection}>
            <div className={styles.sectionHeader} onClick={() => toggle('avisos')}>
              <h3>{t('AVISOS_EVENTS_TITLE') || 'Avisos y Eventos'}</h3>
              <span>{expanded.avisos ? '−' : '+'}</span>
            </div>
            {expanded.avisos && (
              <div className={styles.sectionContent}>
                <AvisosSettings
                  customAvisos={customAvisos}
                  onAddAviso={onAddAviso}
                  onDeleteAviso={onDeleteAviso}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;