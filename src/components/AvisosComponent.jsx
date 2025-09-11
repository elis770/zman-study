import { useState, useEffect } from 'react';
import { useAppData } from '../context/DataContext';
import styles from '../style/Avisos.module.css';

// Placeholder for a future hook that will provide information about special days.
const useSpecialDay = () => {
  // TODO: Implement logic to determine if today is a special day (e.g., Rosh Jodesh, Yom Tov, etc.)
  // For now, it returns null.
  // Example of a possible future return value:
  // return { specialDay: { id: 'special-day', title: 'Rosh Jodesh', content: 'Hoy es Rosh Jodesh Sivan', icon: '🌙' } };
  return { specialDay: null };
};

const AvisosComponent = ({ customAvisos }) => {
  const { parasha, haftara, loading, loadingGeo } = useAppData();
  const { specialDay } = useSpecialDay();
  const [visibleAvisoIndex, setVisibleAvisoIndex] = useState(0);
  const [avisos, setAvisos] = useState([]);

  useEffect(() => {
    if (loading || loadingGeo) return;

    const allAvisos = [];

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

    setAvisos(allAvisos);
    // Reset index if the list of announcements changes to avoid out-of-bounds errors
    if (allAvisos.length > 0) {
      setVisibleAvisoIndex(current => (current >= allAvisos.length ? 0 : current));
    }
  }, [parasha, haftara, specialDay, customAvisos, loading, loadingGeo]);

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