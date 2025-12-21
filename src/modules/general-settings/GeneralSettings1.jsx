import { useRef, useEffect, useMemo } from 'react';
import {
  Slider,
  Typography,
  Divider,
  Box,
  Button,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useSettings } from '@/components/SettingsContext';
import { TextAlignCenter } from 'lucide-react';

const GeneralSettings1 = ({
  t,
  language,
  toggleLanguage,
  // showMinian,
  // toggleShowMinian,
  // showHayomYom,
  // toggleShowHayomYom,
  autoSwitchDelay,
  onAutoSwitchDelayChange,
  timeFormat,
  toggleTimeFormat,
  scrollSpeed,
  setScrollSpeed
}) => {
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
        {`${t('TIME_FORMAT_LABEL') || 'Formato de hora'}: ${
          timeFormat === '12h'
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
        <Typography sx={{ color: '#8b7355', fontSize: '0.95rem', mb: 1 }}>
          {t('CAROUSEL_LAYOUT') || 'Distribución del carrusel principal'}
        </Typography>
        <CarouselLayoutEditor t={t} />
      </Box>
    </Box>
  );
};

function CarouselLayoutEditor({ t }) {
  const { carouselLayout, setCarouselLayout } = useSettings();
  const theme = useTheme();
  const isMdDown = useMediaQuery(theme.breakpoints.down('md'));
  const backupRef = useRef(null);

  const allItems = [
    { id: 'zmanim', label: t('NEXT_ZMANIM') || 'Zmanim' },
    { id: 'study', label: t('STUDY_TITLE') || 'Estudio' },
    { id: 'hayom-yom', label: t('HAIOM_IOM_TITLE') || 'Hayom Yom' },
    { id: 'minian', label: t('MINIAN_TITLE') || 'Minianim' },
    { id: 'avisos', label: t('AVISOS_TITLE') || 'Avisos' }
  ];

  const layout = carouselLayout || {
    left: ['zmanim', 'study'],
    right: ['minian', 'avisos']
  };

  useEffect(() => {
    if (isMdDown && !backupRef.current) {
      backupRef.current = {
        left: [...(layout.left || [])],
        right: [...(layout.right || [])]
      };
    }

    if (!isMdDown && backupRef.current) {
      setCarouselLayout(backupRef.current);
      backupRef.current = null;
    }
  }, [isMdDown, layout, setCarouselLayout]);

  const available = useMemo(
    () =>
      allItems.filter(
        it =>
          !(layout.left || []).includes(it.id) &&
          !(layout.right || []).includes(it.id)
      ),
    [allItems, layout]
  );

  const onDragStart = (e, id) => {
    e.dataTransfer.setData('text/plain', id);
  };

  const onDrop = (e, side) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    if (!id) return;

    const left = (layout.left || []).filter(i => i !== id);
    const right = (layout.right || []).filter(i => i !== id);

    if (side === 'left') left.push(id);
    if (side === 'right') right.push(id);

    setCarouselLayout({ left, right });
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
      <Box onDragOver={e => e.preventDefault()} onDrop={e => onDrop(e, 'left')}>
        <Typography fontWeight={600}>{t('LEFT_BOX') || 'Caja izquierda'}</Typography>
        {(layout.left || []).map(id => (
          <Box key={id} draggable onDragStart={e => onDragStart(e, id)}>
            {allItems.find(i => i.id === id)?.label}
          </Box>
        ))}
      </Box>

      <Box onDragOver={e => e.preventDefault()} onDrop={e => onDrop(e, 'right')}>
        <Typography fontWeight={600}>{t('RIGHT_BOX') || 'Caja derecha'}</Typography>
        {(layout.right || []).map(id => (
          <Box key={id} draggable onDragStart={e => onDragStart(e, id)}>
            {allItems.find(i => i.id === id)?.label}
          </Box>
        ))}
      </Box>

      <Box>
        <Typography fontWeight={600}>{t('AVAILABLE') || 'Disponibles'}</Typography>
        {available.map(it => (
          <Box key={it.id} draggable onDragStart={e => onDragStart(e, it.id)}>
            {it.label}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default GeneralSettings1;