import { useAppData } from '@/shared/hooks/useAppData.js';
import { useLanguage } from '@/shared/hooks/useLanguage.js';
import styles from '../styles/Zmanim.module.css';

const ZmanimComponent = ({ visibleZmanim }) => {
  const {
    sunrise,
    sofZmanShma,
    shkiah,
    tzet,
    candleLighting,
    chatzot,
    loading,
    loadingGeo,
  } = useAppData();
    const { t } = useLanguage();

  // Propuesta de iconos: Un mapa de emojis para cada zman.
  // Se puede reemplazar fácilmente por componentes de iconos en el futuro.
  const iconMap = {
    NETZ_HAJAMA: '🌅',
    SOF_SHEMA: '📖',
    SHKIA: '🌇',
    CANDLE_LIGHTING: '🕯️',
    TZET_HAKOJABIM: '🌃',
    JATZOT: '🕛',
  };

  if (loading || loadingGeo) {
    return null;
  }

  const zmanimList = [
    { key: 'NETZ_HAJAMA', label: t('NETZ_HAJAMA'), value: sunrise },
    { key: 'SOF_SHEMA', label: t('SOF_SHEMA'), value: sofZmanShma },
    { key: 'JATZOT', label: t('JATZOT'), value: chatzot },
    { key: 'SHKIA', label: t('SHKIA'), value: shkiah },
    { key: 'CANDLE_LIGHTING', label: t('CANDLE_LIGHTING'), value: candleLighting },
    { key: 'TZET_HAKOJABIM', label: t('TZET_HAKOJABIM'), value: tzet },
  ]
    .filter(zman => visibleZmanim.includes(zman.key) && zman.value);

  if (zmanimList.length === 0) {
    return null;
  }

  return (
    <>
      <div className={styles.zmanimContainer}>
        {zmanimList.map(zman => (
          <div key={zman.key} className={styles.zmanItem}>
            <div className={styles.iconContainer}>
              {iconMap[zman.key] || ''}
            </div>
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