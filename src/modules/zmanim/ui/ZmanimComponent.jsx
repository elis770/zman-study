import { useAppData } from '@/shared/hooks/useAppData.js';
import { useLanguage } from '@/shared/hooks/useLanguage.js';
import { allZmanim } from '../context/zmanimConfig.js';
import styles from '../styles/Zmanim.module.css';

const ZmanimComponent = ({ visibleZmanim }) => {
  // Obtenemos TODOS los zmanim del contexto, no solo algunos.
  const zmanimData = useAppData().zmanim;
  //console.log(zmanimData);
  const { t } = useLanguage();
  const { loading, loadingGeo } = zmanimData;

  if (loading || loadingGeo) {
    return null;
  }

  // Construimos la lista dinámicamente a partir de la configuración
  const zmanimList = allZmanim
    .map(zmanConfig => ({
      ...zmanConfig,
      label: t(zmanConfig.labelKey),
      value: zmanimData[zmanConfig.key], // Obtenemos el valor del contexto
    }))
    .filter(zman => visibleZmanim.includes(zman.key) && zman.value);

    //console.log('Zmanim to display:', zmanimList);
  if (zmanimList.length === 0) {
    return null;
  }

  return (
    <>
      <div className={styles.zmanimContainer}>
        {zmanimList.map(zman => (
          <div key={zman.key} className={styles.zmanItem}>
            <div className={styles.iconContainer}>{zman.icon || ''}</div>
            <div className={styles.textContainer}>
              <span className={styles.label}>{zman.label}</span>
              <span className={styles.value}>{zman.value}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ZmanimComponent;