import {
  shouldShowChatzot,
  shouldShowNetz,
  isFriday,
} from '../utils/dateChecks';
import { useAppData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import styles from '../style/Zmanim.module.css';

const ZmanimComponent = () => {
  const {
    date,
    hebrewDate,
    sunrise,
    sofZmanShma,
    shkiah,
    tzet,
    candleLighting,
    chatzot,
    loading,
    loadingGeo,
  } = useAppData();
  const { t, language } = useLanguage();

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
    {
      key: 'NETZ_HAJAMA',
      label: t('NETZ_HAJAMA'),
      value: sunrise,
      show: shouldShowNetz(hebrewDate) && sunrise,
    },
    {
      key: 'SOF_SHEMA',
      label: t('SOF_SHEMA'),
      value: sofZmanShma,
      show: !!sofZmanShma,
    },
    { key: 'SHKIA', label: t('SHKIA'), value: shkiah, show: !!shkiah },
    {
      key: 'CANDLE_LIGHTING',
      label: t('CANDLE_LIGHTING'),
      value: candleLighting,
      show: isFriday(date) && candleLighting,
    },
    {
      key: 'TZET_HAKOJABIM',
      label: t('TZET_HAKOJABIM'),
      value: tzet,
      show: !!tzet,
    },
    {
      key: 'JATZOT',
      label: t('JATZOT'),
      value: chatzot,
      show: shouldShowChatzot(hebrewDate) && chatzot,
    },
  ].filter(item => item.show);

  if (zmanimList.length === 0) {
    return null;
  }

  return (
    <>
      <div className={styles.zmanimContainer}>
        {zmanimList.map(zman => (
          <div key={zman.key} className={styles.zmanItem}>
            <div className={styles.iconContainer}>
              {iconMap[zman.key] || '🕒' /* Icono por defecto */}
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