import { useState, useEffect, useMemo } from 'react';
import { useAppData } from '@/shared/hooks/useAppData.js';
import styles from '../styles/Avisos.module.css';

// Placeholder for a future hook that will provide information about special days.
const useAvisos = () => {
  // This is a placeholder. In the future, this could fetch special announcements.
  return { specialDay: null };
};

const AvisosComponent = ({ customAvisos }) => {
  // const a = useAppData();
  // console.log(a)
  //const { parasha, haftara, loading, loadingGeo, date, candleLighting, tzet } = useAppData();
  let parasha = "julin"
  let haftara = "haftara julin"
  let loading = false
  let loadingGeo = false
  let date = new Date()
  let candleLighting = "18:30"
  let tzet = "19:45"
  //console.log(tzet)
  //console.log(x)
const { specialDay } = useAvisos();
  const [visibleAvisoIndex, setVisibleAvisoIndex] = useState(0);

  const avisos = useMemo(() => {
    if (loading || loadingGeo) return [];

    const allAvisos = [];
    const dayOfWeek = date ? date.getDay() : -1;

    // Viernes: Mostrar horario de encendido de velas
    if (dayOfWeek === 5 && candleLighting) {
      allAvisos.push({
        id: 'candle-lighting',
        title: 'Encendido de Velas',
        content: candleLighting,
        icon: '🕯️',
      });
    }

    // Sábado: Mostrar horario de fin de Shabat
    if (dayOfWeek === 6 && tzet) {
      allAvisos.push({
        id: 'shabbat-end',
        title: 'Fin de Shabat (Tzet Hakojabim)',
        content: tzet,
        icon: '🌃',
      });
    }

    // 1. Parashá de la semana
    if (parasha?.he) {
      allAvisos.push({
        id: 'parasha',
        title: 'Parashá de la Semana',
        content: parasha.he,
        icon: '📜',
      });
    }

    // 2. Haftará
    if (haftara?.he) {
      allAvisos.push({
        id: 'haftara',
        title: 'Haftará',
        content: haftara.he,
        icon: '🗣️',
      });
    }

    // 3. Día especial (from the placeholder hook)
    if (specialDay) {
      allAvisos.push(specialDay);
    }

    // 4. Avisos personalizados from settings
    if (customAvisos && customAvisos.length > 0) {
      allAvisos.push(...customAvisos);
    }
    return allAvisos;
  }, [parasha, haftara, specialDay, customAvisos, loading, loadingGeo, date, candleLighting, tzet]);

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