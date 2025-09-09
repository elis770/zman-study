import {
  shouldShowChatzot,
  shouldShowNetz,
  isFriday,
} from '../utils/dateChecks';
import { useAppData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';

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

  if (loading || loadingGeo) {
    return null;
  }

  const zmanimList = [
    {
      label: t('NETZ_HAJAMA'),
      value: sunrise,
      show: shouldShowNetz(hebrewDate) && sunrise,
    },
    { label: t('SOF_SHEMA'), value: sofZmanShma, show: !!sofZmanShma },
    { label: t('SHKIA'), value: shkiah, show: !!shkiah },
    {
      label: t('CANDLE_LIGHTING'),
      value: candleLighting,
      show: isFriday(date) && candleLighting,
    },
    { label: t('TZET_HAKOJABIM'), value: tzet, show: !!tzet },
    {
      label: t('JATZOT'),
      value: chatzot,
      show: shouldShowChatzot(hebrewDate) && chatzot,
    },
  ].filter(item => item.show);

  if (zmanimList.length === 0) {
    return null;
  }

  return (
    <div style={{
      direction: language === 'he' ? 'rtl' : 'ltr',
      textAlign: language === 'he' ? 'right' : 'left'
    }}>
      <h2>{t('ZMANIM_TITLE')}</h2>
      {zmanimList.map(zman => (
        <p key={zman.label}>
          <strong>{zman.label}:</strong> {zman.value}
        </p>
      ))}
    </div>
  );
};

export default ZmanimComponent;