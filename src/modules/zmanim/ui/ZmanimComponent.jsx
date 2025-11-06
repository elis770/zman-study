import { useAppData } from '@/shared/hooks/useAppData.js';
import { useLanguage } from '@/shared/hooks/useLanguage.js';
import { allZmanim } from '../context/zmanimConfig.js';
import styles from '../styles/Zmanim.module.css';

const iconMap = {
    alotHaShachar: '🌅',
    alotHaShachar72: '🌅',
    misheyakir: '🌇',
    misheyakirMachmir: '🌇',
    dawn: '🌄',
    sunrise: '☀️',
    seaLevelSunrise: '☀️',
    neitzHaChama: '☀️',
    sofZmanShma: '🤦‍♂️',
    sofZmanShmaMGA: '📖',
    sofZmanShmaMGA16Point1: '📖',
    sofZmanShmaMGA19Point8: '📖',
    sofZmanTfilla: '📖',
    sofZmanTfillaMGA: '🙏',
    sofZmanTfillaMGA16Point1: '🙏',
    sofZmanTfillaMGA19Point8: '🙏',
    chatzot: '🕛',
    minchaGedola: '🕔',
    minchaGedolaMGA: '🕔',
    minchaKetana: '🕕',
    minchaKetanaMGA: '🕕',
    plagHaMincha: '🕡',
    shkiah: '🌇',
    seaLevelSunset: '🌇',
    sunset: '🌇',
    beinHaShmashos: '🌆',
    seventhHour: '🕖',
    dusk: '🌆',
    tzeit: '🌃',
    tzeit42min: '🌃',
    tzeit72min: '🌃',
    chatzotNight: '🌙',
    gregEve: '🌆',
  };

const ZmanimComponent = ({ visibleZmanim }) => {
  const { t } = useLanguage();
  const appData = useAppData()?.zmanim;

  //console.log(appData);
  // Mapa de íconos para cada zman
  if (!appData || Object.keys(appData).length === 0) return <div>No hay datos de zmanim disponibles.</div>;

  // Filtramos las propiedades que no son zmanim (como 'loading')
  const zmanimList = allZmanim
    .map(zmanConfig => {
      // Buscamos el valor del zman en zmanimData usando la clave de la configuración
      const zmanValue = appData[zmanConfig.key];
      return {
        ...zmanConfig,
        value: zmanValue,
      };
    })
    .filter(zman => visibleZmanim.includes(zman.key) && zman.value);

    //console.log(zmanimList);
  return (
    <>
      {/* <h2>{t('ZMANIM_TITLE')}</h2> */}
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