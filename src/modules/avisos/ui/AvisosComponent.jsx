import { useState, useEffect, useMemo } from 'react';
import { useAppData } from '@/shared/hooks/useAppData.js';
import styles from '../styles/Avisos.module.css';
import useSpecialDay from '../context/useSpecialDay';

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
      setVisibleAvisoIndex(current => (current >= avisos.length ? 0 : current));
    }
  }, [avisos]);

  useEffect(() => {
    if (avisos.length <= 1) return;
    const timer = setTimeout(() => setVisibleAvisoIndex((i) => (i + 1) % avisos.length), 5000);
    return () => clearTimeout(timer);
  }, [visibleAvisoIndex, avisos.length]);

  if (avisos.length === 0) {
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