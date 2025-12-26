import {
  Slider,
  Typography,
  Divider,
  Box,
  Button,
  Select,
  MenuItem,
  FormControl,
  useTheme
} from '@mui/material';
import { useSettings } from '../context/SettingsContext.jsx';

const GeneralSettings1 = ({
  t,
  language,
  toggleLanguage,
  autoSwitchDelay,
  onAutoSwitchDelayChange,
  timeFormat,
  toggleTimeFormat,
  scrollSpeed,
  setScrollSpeed
}) => {
  const {
    showDots, setShowDots,
    showArrows, setShowArrows,
    currentThemeKey, setCurrentThemeKey,
    themeMode, setThemeMode
  } = useSettings();
  const theme = useTheme();

  const buttonStyle = {
    justifyContent: 'flex-start',
    borderColor: theme.custom?.colors?.border?.main || 'divider',
    color: 'primary.main',
    mb: 1,
    '&:hover': {
      backgroundColor: 'action.hover',
      borderColor: 'primary.main'
    }
  };

  const selectStyle = {
    color: 'primary.main',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.custom?.colors?.border?.main || 'divider',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: 'primary.main',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: 'primary.main',
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <br />
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

      <br />

      <Box sx={{ mt: 1 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ color: 'primary.main', fontSize: '0.9rem', mb: 1, fontWeight: 500 }}>
              {t('THEME_LABEL') || 'Tema Visual'}
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={currentThemeKey}
                onChange={(e) => setCurrentThemeKey(e.target.value)}
                sx={selectStyle}
              >
                <MenuItem value="beige">{t('THEME_BEIGE')}</MenuItem>
                <MenuItem value="violet">{t('THEME_VIOLET')}</MenuItem>
                <MenuItem value="blue">{t('THEME_BLUE')}</MenuItem>
                <MenuItem value="red">{t('THEME_RED')}</MenuItem>
                <MenuItem value="green">{t('THEME_GREEN')}</MenuItem>
                <MenuItem value="orange">{t('THEME_ORANGE')}</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography sx={{ color: 'primary.main', fontSize: '0.9rem', mb: 1, fontWeight: 500 }}>
              {t('DARK_MODE_LABEL') || 'Modo Oscuro'}
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={themeMode}
                onChange={(e) => setThemeMode(e.target.value)}
                sx={selectStyle}
              >
                <MenuItem value="light">{t('MODE_LIGHT') || 'Blanco (Claro)'}</MenuItem>
                <MenuItem value="dark">{t('MODE_DARK') || 'Oscuro'}</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Box>

      <br />
      <Box sx={{ mt: 2 }}>
        <Typography sx={{ color: 'primary.main', fontWeight: 500, mb: 1.5 }}>
          {t('NAVIGATION_OPTIONS') || 'Opciones de Navegación'}
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
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

      <Divider sx={{ my: 3 }} />

      <Box sx={{ mt: 1 }}>
        <Typography sx={{ color: 'primary.main', fontSize: '0.9rem', mb: 1 }}>
          {t('ROTATION_INTERVAL') || 'Intervalo de rotación de estudios (segundos)'}
        </Typography>
        <Slider
          value={autoSwitchDelay / 1000}
          min={1}
          max={30}
          step={1}
          onChange={(_, val) => onAutoSwitchDelayChange(val * 1000)}
          sx={{ color: 'primary.main' }}
        />
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography sx={{ color: 'primary.main', fontSize: '0.9rem', mb: 1 }}>
          {t('SCROLL_SPEED') || 'Velocidad del scroll'}
        </Typography>
        <Slider
          value={scrollSpeed}
          min={0.8}
          max={3}
          step={0.1}
          onChange={(_, val) => setScrollSpeed(val)}
          sx={{ color: 'primary.main' }}
        />
      </Box>

    </Box>
  );
};

export default GeneralSettings1;