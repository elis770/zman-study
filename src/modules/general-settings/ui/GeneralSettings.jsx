import styles from '../styles/GeneralSettings.module.css';
import { Slider, Typography, Divider } from "@mui/material";

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
  timeFormat,
  toggleTimeFormat,
  scrollSpeed,
  setScrollSpeed
}) => {
  return (
    <div className={styles.buttonGroup}>
      <button onClick={toggleLanguage} className={styles.modalButton}>
        {t(language === 'es' ? 'CHANGE_TO_HEBREW' : 'CHANGE_TO_SPANISH')}
      </button>
      <button onClick={toggleTimeFormat} className={styles.modalButton}>
        {`${t('TIME_FORMAT_LABEL')}: ${timeFormat === '12h' ? t('TIME_FORMAT_12H') : t('TIME_FORMAT_24H')} (${timeFormat === '12h' ? t('CHANGE_TO_24H') : t('CHANGE_TO_12H')})`}
      </button>
      <button onClick={toggleShowMinian} className={styles.modalButton}>
        {showMinian ? t('HIDE_MINIAN') : t('SHOW_MINIAN')}
      </button>
      <button onClick={toggleShowHayomYom} className={styles.modalButton}>
        {showHayomYom ? t('HIDE_HAYOM_YOM') : t('SHOW_HAYOM_YOM')}
      </button>

      <Divider sx={{ my: 3 }} />

      <div className={styles.sliderContainer} style={{ marginTop: '1rem' }}>
        <Typography sx={{ color: '#8b7355', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
          Intervalo de rotación de estudios (segundos)
        </Typography>
        <Slider
          value={autoSwitchDelay / 1000}
          min={1}
          max={30}
          step={1}
          onChange={(_, val) => onAutoSwitchDelayChange(val * 1000)}
          sx={{ color: '#bca886' }}
        />
      </div>
      <div className={styles.sliderContainer} style={{ marginTop: '1rem' }}>
        <Typography sx={{ color: '#8b7355', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
          Velocidad del scroll
        </Typography>
        <Slider
          value={scrollSpeed}
          min={0.8}
          max={3}
          step={0.1}
          onChange={(_, val) => setScrollSpeed(val)}
          sx={{ color: '#bca886' }}
        />
      </div>
    </div>
  );
};

export default GeneralSettings;