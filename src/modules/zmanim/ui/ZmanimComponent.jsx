import { useAppData } from '@/shared/hooks/useAppData.js';
import { useLanguage } from '@/shared/hooks/useLanguage.js';
import { allZmanim } from '../context/zmanimConfig.js';
import styles from '../styles/Zmanim.module.css';

const ZmanimComponent = ({ visibleZmanim }) => {
  const appData = useAppData();
  const { t } = useLanguage();
  const zmanimData = appData?.zmanim;

  // Mapa de íconos para cada zman
  const iconMap = {
    alotHaShachar: '🌅',
    misheyakir: '🌇',
    sunrise: '☀️',
    sofZmanShma: '🤦‍♂️',
    sofZmanTfilla: '📖',
    chatzot: '🕛',
    minchaGedola: '🕔',
    minchaKetana: '🕕',
    plagHaMincha: '🕡',
    shkiah: '🌇',
    beinHaShmashos: '🌆',
    tzeit: '🌃',
    chatzotNight: '🌙',
  };

  if (!zmanimData || Object.keys(zmanimData).length === 0) return <div>No hay datos de zmanim disponibles.</div>;

  // Filtramos las propiedades que no son zmanim (como 'loading')
  const zmanimList = allZmanim
    .map(zmanConfig => {
      // Buscamos el valor del zman en zmanimData usando la clave de la configuración
      const zmanValue = zmanimData[zmanConfig.key];
      return {
        ...zmanConfig,
        value: zmanValue,
      };
    })
    .filter(zman => !visibleZmanim.includes(zman.key) && zman.value);

  return (
    <>
      <h2>{t('ZMANIM_TITLE')}</h2>
      <div className={styles.zmanimContainer}>
        {zmanimList.map(zman => (
          <div key={zman.key} className={styles.zmanItem}>
            <div className={styles.iconContainer}>{iconMap[zman.key] || '⏳'}</div>
            <div className={styles.textContainer}>
              <span className={styles.label}>{t(zman.labelKey) || zman.key}</span>
              <span className={styles.value}>{String(zman.value)}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ZmanimComponent;