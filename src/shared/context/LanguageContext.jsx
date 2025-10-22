import { createContext, useState, useCallback, useMemo } from 'react';
import { translations } from './utils/translations.js'; // Ajustado a la nueva ruta
import { useTranslationQueue } from './hooks/useTranslationQueue.js'; // Ajustado a la nueva ruta
import { useManualTranslation } from './utils/useManualTranslation.js'; // Ajustado a la nueva ruta
import { translateWithApi } from './hooks/api.js'; // Ajustado a la nueva ruta

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'es');
  const { translateTanyaManual } = useManualTranslation();
  const { translationCache, addToQueue } = useTranslationQueue(language);
  
  const getCacheKey = (src, tgt, text) => `${src}:${tgt}:${text}`;

  const translateDynamicText = useCallback((text, sourceLang) => {
    if (!text || language === sourceLang) return Promise.resolve(text);

    const safe = typeof text === 'string' ? text : (text?.toString?.() ?? '');
    const key = getCacheKey(sourceLang, language, safe);

    if (translationCache.current[key]) return Promise.resolve(translationCache.current[key]);

    // 1. Intentar traducción manual (Tanya)
    const manualHebrew = translateTanyaManual(safe);
    if (manualHebrew) {
      // Si el idioma de destino es hebreo, ya terminamos.
      if (language === 'he') {
        translationCache.current[key] = manualHebrew;
        return Promise.resolve(manualHebrew);
      }
      // Si el destino es otro (ej. 'es'), traducimos el resultado manual (hebreo) al destino final.
      const newKey = getCacheKey('he', language, manualHebrew);
      if (translationCache.current[newKey]) {
        return Promise.resolve(translationCache.current[newKey]);
      }
      // Esto se traduce como un caso único, no en lote, porque es una cadena derivada.
      return new Promise(async (resolve) => {
        const translated = await translateWithApi(manualHebrew, 'he', language);
        translationCache.current[newKey] = translated;
        resolve(translated);
      })
    }

    // 2. Si no hubo traducción manual, agregar a la cola de la API.
    return addToQueue(safe, sourceLang);
  }, [language, translationCache, translateTanyaManual, addToQueue]);

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => {
      const next = prev === 'es' ? 'he' : prev === 'he' ? 'en' : 'es';
      localStorage.setItem('language', next);
      // Limpiar el caché al cambiar de idioma para evitar inconsistencias.
      // Opcional: podrías mantenerlo si el caché usa el idioma destino en su clave.
      // Por ahora, lo limpiamos para simplificar.
      translationCache.current = {};
      return next;
    });
  }, [translationCache]);

  const t = useCallback((key) => (translations[language]?.[key]) || translations.es[key] || key, [language]);
  const value = useMemo(() => ({ language, toggleLanguage, t, translateDynamicText }), [language, toggleLanguage, t, translateDynamicText]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};