// import { useEffect, useState } from 'react';
import useHayomYom from '../hooks/useHayomYom.js';
// import { useLanguage } from '../context/LanguageContext';

const HayomYomComponent = () => {
  const { title, text, loading, error } = useHayomYom();
  // const { t, language, translateDynamicText } = useLanguage();
  // const [translatedText, setTranslatedText] = useState('');

  // useEffect(() => {
  //   if (text && language === 'es') {
  //     // Assuming the source text is Hebrew
  //     translateDynamicText(text, 'he').then(setTranslatedText);
  //   } else {
  //     setTranslatedText('');
  //   }
  // }, [text, language, translateDynamicText]);

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
      <div style={{ whiteSpace: 'pre-wrap', direction: 'rtl', textAlign: 'right' }}>
        {text}
      </div>
    </>
  );
};

export default HayomYomComponent;