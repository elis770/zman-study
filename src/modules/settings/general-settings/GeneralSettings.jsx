import { Slider, Typography, Divider, Box, Button } from '@mui/material';
import { useSettings } from '../context/SettingsContext.jsx';
import { useLanguage } from '../../../shared/traslantions/useLanguage.js';

const GeneralSettings = ({ autoSwitchDelay, onAutoSwitchDelayChange }) => {
  const { t, language, toggleLanguage } = useLanguage();

  const { timeFormat, toggleTimeFormat, scrollSpeed,
    setScrollSpeed, showDots, setShowDots,
    showArrows, setShowArrows } = useSettings();

  const buttonStyle = {
    justifyContent: 'flex-start',
    borderColor: 'rgba(188, 168, 134, 0.3)',
    color: '#8b7355',
    mb: 1,
    '&:hover': {
      backgroundColor: 'rgba(139, 115, 85, 0.04)',
      borderColor: '#8b7355'
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: "flex", gap: 1 }}>
        <Button fullWidth variant="outlined" onClick={toggleLanguage} sx={buttonStyle}>
          {t(language === 'es' ? 'CHANGE_TO_HEBREW' : 'CHANGE_TO_SPANISH')}
        </Button>

        <Button fullWidth variant="outlined" onClick={toggleTimeFormat} sx={buttonStyle}>
          {`${t('TIME_FORMAT_LABEL') || 'Formato de hora'}: ${timeFormat === '12h'
            ? t('TIME_FORMAT_12H') || '12h'
            : t('TIME_FORMAT_24H') || '24h'
            }`}
        </Button>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ mt: 1 }}>
        <Typography sx={{ color: '#8b7355', fontSize: '0.9rem', mb: 1 }}>
          {t('ROTATION_INTERVAL') || 'Intervalo de rotación de estudios (segundos)'}
        </Typography>
        <Slider
          value={autoSwitchDelay / 1000}
          min={1}
          max={30}
          step={1}
          onChange={(_, val) => onAutoSwitchDelayChange(val * 1000)}
        />
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography sx={{ color: '#8b7355', fontSize: '0.9rem', mb: 1 }}>
          {t('SCROLL_SPEED') || 'Velocidad del scroll'}
        </Typography>
        <Slider
          value={scrollSpeed}
          min={0.8}
          max={3}
          step={0.1}
          onChange={(_, val) => setScrollSpeed(val)}
        />
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ mt: 2 }}>
        <Typography sx={{ color: '#8b7355', fontSize: '0.95rem', mb: 1.5 }}>
          {t('NAVIGATION_OPTIONS') || 'Opciones de Navegación'}
        </Typography>

        <Box sx={{ display: "flex", gap: 1, flexDirection: 'column' }}>
          <Button fullWidth variant="outlined" onClick={() => setShowDots(!showDots)} sx={buttonStyle}>
            {showDots
              ? (t('HIDE_DOTS') || 'Ocultar Puntos')
              : (t('SHOW_DOTS') || 'Mostrar Puntos')}
          </Button>

          <Button fullWidth variant="outlined" onClick={() => setShowArrows(!showArrows)} sx={buttonStyle}>
            {showArrows
              ? (t('HIDE_ARROWS') || 'Ocultar Flechas')
              : (t('SHOW_ARROWS') || 'Mostrar Flechas')}
          </Button>
        </Box>
      </Box>

    </Box>
  );
};

export default GeneralSettings;