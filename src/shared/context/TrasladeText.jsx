import { useState, useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage.js';
import styles from '../../modules/study/styles/Study.module.css';

const TrasladeText = ({ text, sourceLang }) => {
  const { language, translateDynamicText } = useLanguage();
  const [translatedText, setTranslatedText] = useState(text);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!text || sourceLang === language) {
      setTranslatedText(text);
      return;
    }

    const run = async () => {
      setIsLoading(true);
      try {
        const safe = typeof text === 'string' ? text : (text?.toString?.() ?? '');
        const result = await translateDynamicText(safe, sourceLang);
        setTranslatedText(result);
      } catch (e) {
        console.error('Translation failed in TrasladeText:', e);
        setTranslatedText(text);
      } finally {
        setIsLoading(false);
      }
    };
    run();
  }, [text, sourceLang, language, translateDynamicText]);

  if (isLoading) return <span className={styles.value}>Traduciendo...</span>;
  return <span className={styles.value}>{translatedText || text}</span>;
};

export default TrasladeText;