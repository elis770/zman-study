import styles from '../styles/AboutProjectModal.module.css';
import { useLanguage } from '../../../shared/hooks/useLanguage.js';

const AboutProyectModal = ({ isOpen, onClose }) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <button className={styles.closeButton} onClick={onClose} aria-label="Cerrar">
            ×
          </button>
          <h2 id="modal-title">{t('ABOUT_PROYECT_TITLE') || 'Sobre el Proyecto'}</h2>
          <span style={{ width: 28 }} />
        </div>
        <div className={styles.scrollableContent}>
          <div className={styles.aboutSection}>
            <img src="/icon.png" alt="kosherClock" className={styles.profilePic} />
            <h3>Kosher Clock</h3>
            <p>Webside</p>
            <p>
              Es un proyecto diseñado para proporcionar a los usuarios información precisa sobre los horarios de oración judíos (Zmanim) y otros datos relevantes. La aplicación utiliza tecnologías modernas para ofrecer una experiencia de usuario intuitiva y accesible.
            </p>
            <p>
              Informe Tecnico: Este proyecto está construido con React para el frontend, asegurando una interfaz de usuario dinámica y receptiva. Utiliza librerias (hebcal) y APIs (sefaria) confiables para obtener datos precisos sobre los horarios de oración y otros eventos relevantes. El diseño se centra en la facilidad de uso, permitiendo a los usuarios acceder rápidamente a la información que necesitan. y esta optimizada para detectar cualquier busqueda en diferentes partes del mundo y que detecte los hoarios automaticamente.
            </p>
            <p>
              Puedes encontrar más sobre este proyecto en <a href="https://github.com/elis770/zman-study" target="_blank" rel="noopener noreferrer">este link de GitHub</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutProyectModal;