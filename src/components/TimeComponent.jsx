import { useAppData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { useEffect, useState } from 'react';

export const TimeComponent = () => {
  const {
    formattedDate,
    time,
    tzid,
    city,
    country,
    error: geoError,
    hebrewDate,
    loadingGeo,
  } = useAppData();
  const { language, translateDynamicText } = useLanguage();
  const [translatedHebrewDate, setTranslatedHebrewDate] = useState('');

  useEffect(() => {
    if (hebrewDate && language === 'es') {
      // Asumimos que hebrewDate del contexto siempre está en hebreo
      translateDynamicText(hebrewDate, 'he').then(setTranslatedHebrewDate);
    } else {
      setTranslatedHebrewDate('');
    }
  }, [hebrewDate, language, translateDynamicText]);

  if (loadingGeo) {
    return <p>Obteniendo ubicación...</p>;
  }
  return (
    <>
      <h3 id="date" style={{ direction: language === 'he' ? 'rtl' : 'ltr' }}>
        {formattedDate} - {language === 'es' ? (translatedHebrewDate || hebrewDate) : hebrewDate}
      </h3>
      <h2 id="time">{time}</h2>
      <div id="timezone">
        {tzid}{' '}
        {city || country
          ? `— ${city ?? ''}${city && country ? ', ' : ''}${country ?? ''}`
          : ''}
      </div>
      {geoError && <small style={{ color: '#b00' }}>{geoError}</small>}
    </>
  );
};