import { useAppData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { useEffect, useState } from 'react';
import styles from '../style/Time.module.css';

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
    <div className={`${styles['container-sm']}`}>
      <div className={styles.hola}>
      <h2 className={`${styles.time}`}>{time}</h2>
      </div>
      <div className={styles.hola2}>
      <h3 className={styles.date}>
        {formattedDate}
      </h3>
      <h3 className={styles.date}>
        {hebrewDate}
      </h3>
      <div className={styles.timezone}>
        {tzid}{' '}
        {city || country
          ? `— ${city ?? ''}${city && country ? ', ' : ''}${country ?? ''}`
          : ''}
      </div>
      </div>
    </div>
    {/* <div className={`${styles['container-sm']} bg-primary text-white`}>
      <div className={styles.hola}>
      <h2 className={`${styles.time} text-primary-emphasis bg-primary-subtle border border-primary-subtle`}>{time}</h2>
      </div>
      <div className={styles.hola2}>
      <h3 className={styles.date}>
        {formattedDate}
      </h3>
      <h3 className={styles.date}>
        {hebrewDate}
      </h3>
      <div className={styles.timezone}>
        {tzid}{' '}
        {city || country
          ? `— ${city ?? ''}${city && country ? ', ' : ''}${country ?? ''}`
          : ''}
      </div>
      </div>
    </div> */}
    </>
  );
};
{/* {geoError && <small className={styles.error}>{geoError}</small>} */}