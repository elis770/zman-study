import { useState, useRef, useCallback } from 'react';

export function useTranslator({ sourceLanguage = 'es', targetLanguage = 'he' } = {}) {
  const translatorRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getTranslator = useCallback(async () => {
    if (translatorRef.current) return translatorRef.current;

    setLoading(true);
    setError(null);

    try {
      if (!('Translator' in window)) {
        throw new Error('API de traducción no disponible. Habilita "Experimental Web Platform features" en chrome://flags.');
      }

      const availability = await window.Translator.availability({ sourceLanguage, targetLanguage });
      if (availability.state === 'unavailable') {
        throw new Error('Traducción no soportada para esos idiomas.');
      }

      const t = await window.Translator.create({ sourceLanguage, targetLanguage });
      translatorRef.current = t;
      return t;
    } catch (e) {
      setError(e.message);
      throw e; // Re-lanzamos para que el componente que lo usa se entere.
    } finally {
      setLoading(false);
    }
  }, [sourceLanguage, targetLanguage]);

  const translate = useCallback(async (text) => {
    try {
      const translator = await getTranslator();
      return await translator.translate(text);
    } catch (e) {
      // El error ya fue seteado en getTranslator, solo lo re-lanzamos.
      throw e;
    }
  }, [getTranslator]);

  return { translate, loading, error };
}