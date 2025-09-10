import { useState, useEffect } from 'react';
import styles from '../style/Avisos.module.css';

const avisos = [
  {
    id: 1,
    title: 'Próximo Evento',
    content: 'No te pierdas el Shabat comunitario este viernes a las 19:00 hs.',
    icon: '🗓️',
  },
  {
    id: 2,
    title: 'Campaña de Donación',
    content: 'Ayúdanos a seguir creciendo. Tu donación es importante. ¡Gracias!',
    icon: '💖',
  },
];

const AvisosComponent = () => {
  const [visibleAvisoIndex, setVisibleAvisoIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisibleAvisoIndex((currentIndex) => (currentIndex + 1) % avisos.length);
    }, 5000); // Cambia cada 5 segundos

    return () => clearTimeout(timer);
  }, [visibleAvisoIndex]);

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