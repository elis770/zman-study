import { useState, useEffect, useRef } from 'react';
import styles from '../styles/SettingsModal.module.css';
import GeneralSettings from '../../general-settings/ui/GeneralSettings.jsx';
import ZmanimSettings from '../../zmanim/ui/ZmanimSettings.jsx';
import StudySettings from '../../study/ui/StudySettings.jsx';
import AvisosSettings from '../../avisos/ui/AvisosSettings.jsx';
import { cityList } from '../../../shared/lib/cities.js';

const SettingsModal = ({
  isOpen, onClose,
  theme, toggleTheme,
  language, toggleLanguage,
  t, userCity, onUserCityChange,
  showMinian, toggleShowMinian,
  showHayomYom, toggleShowHayomYom,
  visibleZmanim, onZmanimChange, onZmanimSelectionChange,
  visibleStudies, onStudiesChange, onStudiesSelectionChange,
  customAvisos, onAddAviso, onDeleteAviso,
  autoSwitchDelay, onAutoSwitchDelayChange,
  timeFormat, toggleTimeFormat
}) => {
  const [expanded, setExpanded] = useState({
    general: true, zmanim: true, study: true, avisos: true
  });
  const [cityInput, setCityInput] = useState(userCity || '');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const cityInputWrapperRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    if (isOpen) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cityInputWrapperRef.current && !cityInputWrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  if (!isOpen) return null;

  const btnStyle = {
    color: theme === 'dark' ? '#fff' : '#000',
    backgroundColor: theme === 'dark' ? '#333' : '#eee',
  };

  const toggle = (k) => setExpanded(s => ({ ...s, [k]: !s[k] }));

  const handleCityChange = (e) => {
    const value = e.target.value;
    setCityInput(value);
    if (value.length > 1) {
      const filtered = cityList.filter(city =>
        city.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const cityName = suggestion.split(',')[0];
    setCityInput(cityName);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSaveCity = () => {
    const cityName = cityInput.split(',')[0].trim();
    onUserCityChange(cityName);
    setShowSuggestions(false);
  };

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
          <span style={{ width: 28 }} />
        </div>

        <div className={styles.scrollableContent}>
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
                  autoSwitchDelay={autoSwitchDelay}
                  onAutoSwitchDelayChange={onAutoSwitchDelayChange}
                  timeFormat={timeFormat}
                  toggleTimeFormat={toggleTimeFormat}
                />
                <hr />
                <div className={styles.cityInputContainer}>
                  <label htmlFor="city-input">{t('CITY_LABEL') || 'Ciudad'}</label>
                  <div className={styles.cityInputWrapper} ref={cityInputWrapperRef}>
                    <div className={styles.suggestionsWrapper}>
                      <input
                        id="city-input"
                        type="text"
                        value={cityInput}
                        onChange={handleCityChange}
                        onFocus={() => cityInput.length > 1 && setShowSuggestions(true)}
                        placeholder={t('CITY_PLACEHOLDER') || 'Ej: New York'}
                        autoComplete="off"
                      />
                      {showSuggestions && suggestions.length > 0 && (
                        <ul className={styles.suggestionsList}>
                          {suggestions.map(suggestion => (
                            <li
                              key={suggestion}
                              className={styles.suggestionItem}
                              onClick={() => handleSuggestionClick(suggestion)}
                            >
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <button onClick={handleSaveCity} className={styles.saveButton}>{t('SAVE')}</button>
                  </div>
                </div>
              </div>
            )}
          </div>

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
                  onSelectionChange={onZmanimSelectionChange}
                />
              </div>
            )}
          </div>

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
                  onSelectionChange={onStudiesSelectionChange}
                />
              </div>
            )}
          </div>

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