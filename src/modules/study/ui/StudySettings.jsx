import styles from '../styles/StudySettings.module.css';
import { allStudies } from '../hooks/studyConfig.js';

const StudySettings = ({ t, visibleStudies, onStudiesChange, onSelectionChange }) => { 
  // Comprueba si todos los estudios están seleccionados
  const areAllSelected = visibleStudies.length === allStudies.length;

  // Determina la próxima acción y el texto del botón
  const nextAction = areAllSelected ? 'default' : 'all';
  const buttonText = areAllSelected ? t('RESET_DEFAULT') : t('SELECT_ALL');

  return (
    <div>
      <div className={styles.selectionButtons}>
        <button onClick={() => onSelectionChange(nextAction)}>{buttonText}</button>
      </div>
      <div className={styles.checkboxGroup}>
        {allStudies.map(study => (
          <label key={study.key} className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={visibleStudies.includes(study.key)}
              onChange={() => onStudiesChange(study.key)}
            />
            {t(study.labelKey)}
          </label>
        ))}
      </div>
    </div>
  );
};

export default StudySettings;