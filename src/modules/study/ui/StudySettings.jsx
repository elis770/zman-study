import styles from '../styles/StudySettings.module.css';
import { allStudy } from '../context/studyConfig.js';

const StudySettings = ({ t, visibleStudies, onStudiesChange }) => (
  <div className={styles.checkboxGroup}>
    {allStudy.map(s => (
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

export default StudySettings;