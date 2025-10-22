import styles from '../styles/ZmanimSettings.module.css';
import { allZmanim } from '../context/zmanimConfig.js';

const ZmanimSettings = ({ t, visibleZmanim, onZmanimChange }) => {
  return (
    <div className={styles.checkboxGroup}>
      {allZmanim.map(z => (
        <label key={z.key} className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={visibleZmanim.includes(z.key)}
            onChange={() => onZmanimChange(z.key)}
          />
          {t(z.labelKey)}
        </label>
      ))}
    </div>
  );
};

export default ZmanimSettings;