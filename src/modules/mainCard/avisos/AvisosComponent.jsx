import { useState, useEffect, useMemo } from 'react';
import { useAppData } from '@/data/useAppData.js';
import useSpecialDay from '../../../data/avisos/useSpecialDay';
import { Box, Typography, Card, CardContent, keyframes } from '@mui/material';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const sxStyles = {
  avisoContainer: {
    marginTop: 0,
    marginBottom: 0,
    minHeight: '80px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avisoCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '0.75rem 1rem',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    width: '100%',
    animation: `${fadeIn} 0.5s ease-out`,
  },
  iconContainer: {
    fontSize: '1.8rem',
    lineHeight: 1,
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    textAlign: 'left',
  },
  label: {
    fontSize: '0.95em',
    color: '#8b7355',
    fontWeight: 700,
    marginBottom: '0.1rem',
  },
  value: {
    fontSize: '0.85em',
    fontWeight: 400,
    whiteSpace: 'normal',
    wordBreak: 'break-word',
  },
};

function useAvisos() {
  const specialDay = useSpecialDay();
  return { specialDay: specialDay || '' };
}

const AvisosComponent = ({ customAvisos }) => {
  const { time, jadashot } = useAppData();
  const { date, loading: loadingGeo } = time;
  const dayOfWeek = date ? date.getDay() : -1;

  const { jadashotCards, candleLighting, tzet_hashabat: tzet, loading: loadingJadashot } = jadashot;
  const loading = loadingGeo || loadingJadashot;

  const { specialDay } = useAvisos(); // array de objetos
  const [visibleAvisoIndex, setVisibleAvisoIndex] = useState(0);

  const avisos = useMemo(() => {
    if (loading || loadingGeo) return [];

    let allAvisos = [];

    const avisosConfig = [
      {
        condition: dayOfWeek === 5 && candleLighting,
        getAvisos: () => [
          { id: 'candle-lighting', title: 'Encendido de Velas', content: candleLighting, icon: '🕯️' },
        ],
      },
      {
        condition: dayOfWeek === 6 && tzet,
        getAvisos: () => [
          { id: 'shabbat-end', title: 'Fin de Shabat (Tzet Hakojabim)', content: tzet, icon: '🌃' },
        ],
      },
      {
        condition: true,
        getAvisos: () => {
          const weeklyReadingsConfig = [
            { key: 'PARASHA', title: 'Parashá de la Semana', icon: '📜' },
            { key: 'HAFTARA', title: 'Haftará', icon: '🗣️' },
          ];

          return weeklyReadingsConfig
            .map(reading => {
              const card = jadashotCards.find(c => c.key === reading.key);
              if (card?.value) {
                return { id: reading.key.toLowerCase(), title: reading.title, content: card.value, icon: reading.icon };
              }
              return null;
            })
            .filter(Boolean);
        },
      },
      {
        condition: specialDay.length > 0,
        getAvisos: () => specialDay, // todos los avisos especiales
      },
      {
        condition: customAvisos && customAvisos.length > 0,
        getAvisos: () => customAvisos,
      },
    ];

    avisosConfig.forEach(config => {
      if (config.condition) allAvisos = allAvisos.concat(config.getAvisos());
    });

    return allAvisos;
  }, [jadashotCards, specialDay, customAvisos, loading, loadingGeo, dayOfWeek, candleLighting, tzet]);

  useEffect(() => {
    if (avisos.length > 0) {
      setTimeout(() => {
        setVisibleAvisoIndex(current => (current >= avisos.length ? 0 : current));
      }, 0);
    }
  }, [avisos]);

  useEffect(() => {
    if (avisos.length <= 1) return;
    const timer = setTimeout(() => setVisibleAvisoIndex((i) => (i + 1) % avisos.length), 5000);
    return () => clearTimeout(timer);
  }, [visibleAvisoIndex, avisos.length]);

  if (avisos.length === 0) {
    return <Box sx={sxStyles.avisoContainer} style={{ minHeight: '100px' }}></Box>;
  }

  const aviso = avisos[visibleAvisoIndex];

  return (
    <Box sx={sxStyles.avisoContainer}>
      <Card key={aviso.id} sx={sxStyles.avisoCard}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0 !important' }}>
          <Typography sx={sxStyles.iconContainer}>{aviso.icon}</Typography>
          <Box sx={sxStyles.textContainer}>
            <Typography sx={sxStyles.label}>{aviso.title}</Typography>
            <Typography sx={sxStyles.value}>{aviso.content}</Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AvisosComponent;