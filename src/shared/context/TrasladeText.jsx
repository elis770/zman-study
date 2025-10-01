import React, { useState, useEffect } from 'react';
import { useLanguage } from './LanguageContext.jsx';

export const useTrasladeText = (textToTranslate, sourceLang) => {
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { translateDynamicText, language: targetLang } = useLanguage();

  useEffect(() => {
    if (!textToTranslate) {
      setTranslatedText('');
      return;
    }
    let isMounted = true;
    setIsLoading(true);
    translateDynamicText(textToTranslate, sourceLang).then(result => {
      if (isMounted) {
        setTranslatedText(result);
        setIsLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, [textToTranslate, sourceLang, targetLang, translateDynamicText]);

  return { translatedText, isLoading };
};

const TrasladeText = ({ text, sourceLang }) => {
  const { translatedText, isLoading } = useTrasladeText(text, sourceLang);

  if (isLoading) return <>Translating...</>;

  return <>{translatedText}</>;
};

export default TrasladeText;