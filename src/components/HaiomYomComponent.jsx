import { useEffect, useState } from 'react';
import useHayomYom from '../hooks/useHayomYom';
import { useLanguage } from '../context/LanguageContext';

export const HaiomYomComponent = () => {
  const { text: hebrewText, loading, error } = useHayomYom();
  const { t, language, translateDynamicText } = useLanguage();
  const [translatedText, setTranslatedText] = useState('');

  useEffect(() => {
    if (hebrewText && language === 'es') {
      translateDynamicText(hebrewText, 'he').then(setTranslatedText);
    } else {
      setTranslatedText(''); // Limpiar traducción si el idioma es hebreo
    }
  }, [hebrewText, language, translateDynamicText]);

  if (loading) {
    return (
      <>
        <h3>{t('HAIOM_IOM_TITLE')}</h3>
        <p>Cargando estudio diario...</p>
      </>
    );
  }

  if (error) {
    return (
      <>
        <h3>{t('HAIOM_IOM_TITLE')}</h3>
        <p style={{ color: '#b00' }}>No se pudo cargar el estudio: {error}</p>
      </>
    );
  }

  return (
    <>
    <h3>{t('HAIOM_IOM_TITLE')}</h3>
      <div style={{
        whiteSpace: 'pre-wrap',
        direction: language === 'he' ? 'rtl' : 'ltr',
        textAlign: language === 'he' ? 'right' : 'left'
      }}>
        {language === 'es' ? (translatedText || hebrewText) : hebrewText}
      </div>
    </>
  );
};