import { useState, useEffect, useMemo } from 'react';
import { useAppData } from '@/shared/hooks/useAppData.js';
import styles from '../styles/Avisos.module.css';

// Placeholder for a future hook that will provide information about special days.
const useAvisos = () => {
  // This is a placeholder. In the future, this could fetch special announcements.
  return { specialDay: null };
};

const AvisosComponent = ({ customAvisos }) => {
  const { time, jadashot } = useAppData();
  const { date, loading: loadingGeo } = time;
  const dayOfWeek = date ? date.getDay() : -1;
  const {
    jadashotCards,
    candleLighting,
    tzet_hashabat: tzet,
    loading: loadingJadashot,
  } = jadashot;
  //console.log(candleLighting)

  const loading = loadingGeo || loadingJadashot;

  const { specialDay } = useAvisos();
  const [visibleAvisoIndex, setVisibleAvisoIndex] = useState(0);

  const avisos = useMemo(() => {
    if (loading || loadingGeo) return [];

    let allAvisos = [];

    // Config for all announcements
    const avisosConfig = [
      // Viernes: Encendido de velas
      {
        condition: dayOfWeek === 5 && candleLighting,
        getAvisos: () => [{
          id: 'candle-lighting',
          title: 'Encendido de Velas',
          content: candleLighting,
          icon: '🕯️',
        }],
      },
      // Sábado: Fin de Shabat
      {
        condition: dayOfWeek === 6 && tzet,
        getAvisos: () => [{
          id: 'shabbat-end',
          title: 'Fin de Shabat (Tzet Hakojabim)',
          content: tzet,
          icon: '🌃',
        }],
      },
      // Weekly readings: Parasha and Haftara
      {
        condition: true, // Always check for these
        getAvisos: () => {
          const weeklyReadingsConfig = [
            { key: 'PARASHA', title: 'Parashá de la Semana', icon: '📜' },
            { key: 'HAFTARA', title: 'Haftará', icon: '🗣️' },
          ];
          return weeklyReadingsConfig
            .map(reading => {
              const card = jadashotCards.find(c => c.key === reading.key);
              if (card?.value) {
                return {
                  id: reading.key.toLowerCase(),
                  title: reading.title,
                  content: card.value,
                  icon: reading.icon,
                };
              }
              return null;
            })
            .filter(Boolean); // remove nulls
        },
      },
      // Día especial
      {
        condition: specialDay,
        getAvisos: () => [specialDay],
      },
      // Avisos personalizados
      {
        condition: customAvisos && customAvisos.length > 0,
        getAvisos: () => customAvisos,
      },
    ];

    avisosConfig.forEach(config => {
      if (config.condition) {
        allAvisos = allAvisos.concat(config.getAvisos());
      }
    });

    return allAvisos;
  }, [jadashotCards, specialDay, customAvisos, loading, loadingGeo, dayOfWeek, candleLighting, tzet]);

  useEffect(() => {
    // Reset index if the list of announcements changes to avoid out-of-bounds errors
    if (avisos.length > 0) {
      setVisibleAvisoIndex(current => (current >= avisos.length ? 0 : current));
    }
  }, [avisos]);

  useEffect(() => {
    if (avisos.length <= 1) return; // No rotation needed for 0 or 1 item

    const timer = setTimeout(() => {
      setVisibleAvisoIndex((currentIndex) => (currentIndex + 1) % avisos.length);
    }, 5000); // Cambia cada 5 segundos

    return () => clearTimeout(timer);
  }, [visibleAvisoIndex, avisos.length]);

  if (avisos.length === 0) {
    // Render a container to maintain layout space even when there are no announcements
    return <div className={styles.avisoContainer} style={{ minHeight: '100px' }}></div>;
  }

  const aviso = avisos[visibleAvisoIndex];

  return (
    <div className={styles.avisoContainer}>
      <div key={aviso.id} className={styles.avisoCard}>
        <div className={styles.iconContainer}>{aviso.icon}</div>
        <div className={styles.textContainer}>
          <span className={styles.label}>{aviso.title}</span>
          <span className={styles.value}>{aviso.content}</span>
        </div>
      </div>
    </div>
  );
};

export default AvisosComponent;