import styles from '../styles/ZmanimSettings.module.css';
import { allZmanim } from '../context/zmanimConfig.js';

const ZmanimSettings = ({ t, visibleZmanim, onZmanimChange }) => {
  return (
    <div className={styles.checkboxGroup}>
      {allZmanim.map(zman => (
        <label key={zman.key} className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={visibleZmanim.includes(zman.key)}
            onChange={() => onZmanimChange(zman.key)}
          />
          {t(zman.labelKey)}
        </label>
      ))}
    </div>
  );
};

export default ZmanimSettings;