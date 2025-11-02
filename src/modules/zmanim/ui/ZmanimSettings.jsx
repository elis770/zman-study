import styles from '../styles/ZmanimSettings.module.css';
import { allZmanim } from '../context/zmanimConfig.js';

const ZmanimSettings = ({ t, visibleZmanim, onZmanimChange, onSelectionChange }) => {
  // Comprueba si todos los zmanim están seleccionados
  const areAllSelected = visibleZmanim.length === allZmanim.length;

  // Determina la próxima acción y el texto del botón
  const nextAction = areAllSelected ? 'default' : 'all';
  const buttonText = areAllSelected ? t('RESET_DEFAULT') : t('SELECT_ALL');

  return (
    <div>
      <div className={styles.selectionButtons}>
        <button onClick={() => onSelectionChange(nextAction)}>{buttonText}</button>
      </div>
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
    </div>
  );
};

export default ZmanimSettings;