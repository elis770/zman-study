import { useEffect, useState } from 'react';
import useHayomYom from '../hooks/useHayomYom.js';
import { useLanguage } from '../context/LanguageContext';

const HayomYomComponent = () => {
  const { title, text, loading, error } = useHayomYom();
  const { t, language, translateDynamicText } = useLanguage();
  const [translatedText, setTranslatedText] = useState('');

  useEffect(() => {
    if (text && language === 'es') {
      // Assuming the source text is Hebrew
      translateDynamicText(text, 'he').then(setTranslatedText);
    } else {
      setTranslatedText('');
    }
  }, [text, language, translateDynamicText]);

  if (loading) {
    return (
      <>
        <p>Cargando estudio diario...</p>
      </>
    );
  }

  if (error) {
    return (
      <>
        <p style={{ color: '#b00' }}>No se pudo cargar el estudio: {error}</p>
      </>
    );
  }

  return (
    <>
      {/* <h3 style={{ textAlign: 'center' }}>{title || t('HAIOM_IOM_TITLE')}</h3>
      <div style={{ whiteSpace: 'pre-wrap', direction: language === 'he' ? 'rtl' : 'ltr', textAlign: language === 'he' ? 'right' : 'left' }}>
        {(language === 'es' && translatedText) || text}
      </div> */}
      <div style={{ whiteSpace: 'pre-wrap', direction: 'rtl', textAlign: 'right' }}>
        {text}
      </div>
    </>
  );
};

export default HayomYomComponent;