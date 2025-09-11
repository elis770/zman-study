import styles from '../style/StudySettings.module.css';
import { allStudies } from '../hooks/studyConfig.js';

const StudySettings = ({ t, visibleStudies, onStudiesChange }) => {
  return (
    <div className={styles.checkboxGroup}>
      {allStudies.map(s => (
        <label key={s.key} className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={visibleStudies.includes(s.key)}
            onChange={() => onStudiesChange(s.key)}
          />
          {t(s.labelKey)}
        </label>
      ))}
    </div>
  );
};

export default StudySettings;