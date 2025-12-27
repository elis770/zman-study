import { createContext, useState, useCallback, useMemo } from 'react';
import { translations } from './json/translations.js'; // Ajustado a la nueva ruta
import { useManualTranslation } from './json/useManualTranslation.js'; // Ajustado a la nueva ruta
import usePersistentState from '../hooks/usePersistentState.js'; // Asumiendo la ruta del hook

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = usePersistentState('language', 'es');
  const { translateTanyaManual } = useManualTranslation();

  const translateDynamicText = useCallback((text, sourceLang) => {
    if (!text || language === sourceLang) return text;

    const safe = typeof text === 'string' ? text : (text?.toString?.() ?? '');

    // 1. Intentar traducción manual (Tanya)
    const manualHebrew = translateTanyaManual(safe);
    if (manualHebrew) return manualHebrew;

    return safe;
  }, [language, translateTanyaManual]);

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => {
      const next = prev === 'es' ? 'he' : prev === 'he' ? 'en' : 'es';
      return next;
    });
  }, [setLanguage]);

  const t = useCallback((key) => (translations[language]?.[key]) || translations.es[key] || key, [language]);
  const value = useMemo(() => ({ language, toggleLanguage, t, translateDynamicText }), [language, toggleLanguage, t, translateDynamicText]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};