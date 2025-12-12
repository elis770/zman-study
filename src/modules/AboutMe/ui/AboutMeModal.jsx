import styles from '../styles/AboutMeModal.module.css';
import { useLanguage } from '../../../shared/hooks/useLanguage.js';

const AboutMeModal = ({ isOpen, onClose }) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <button className={styles.closeButton} onClick={onClose} aria-label="Cerrar">
            ×
          </button>
          <h2 id="modal-title">{t('ABOUT_ME_TITLE') || 'Sobre Mí'}</h2>
          <span style={{ width: 28 }} />
        </div>
        <div className={styles.scrollableContent}>
          <div className={styles.aboutSection}>
            <img src="/122.png" alt="Eliahu" className={styles.profilePic} />
            <h3>Eliahu Steynberg</h3>
            <p>Desarrollador de Software</p>
            <p>
              Apasionado por la tecnología y la creación de soluciones que impactan positivamente.
              Este proyecto es una demostración de mis habilidades en React y mi interés en aplicaciones útiles para la comunidad.
            </p>
            <p>
              Puedes encontrar más sobre mi trabajo en <a href="https://github.com/elis770" target="_blank" rel="noopener noreferrer">mi GitHub</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutMeModal;