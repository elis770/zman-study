import { createContext, useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { translateWithApi, joinSegments, splitSegments, translateTanyaManual } from './languageUtils.js';
import { translations } from './translations.js';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'es');
  const translationCache = useRef({});
  const translationQueue = useRef([]);
  const translationTimeout = useRef(null);

  const getCacheKey = (src, tgt, text) => `${src}:${tgt}:${text}`;
  const todayStr = () => new Date().toISOString().split('T')[0];

  useEffect(() => {
    const today = todayStr();
    const cache = localStorage.getItem('translationCache');
    const date  = localStorage.getItem('translationCacheDate');
    if (cache && date === today) translationCache.current = JSON.parse(cache);
    else {
      localStorage.removeItem('translationCache');
      localStorage.removeItem('translationCacheDate');
    }
  }, []);

  const processTranslationQueue = useCallback(async () => {
    if (!translationQueue.current.length) return;

    const queue = [...translationQueue.current];
    translationQueue.current = [];

    const groups = queue.reduce((acc, it) => {
      (acc[it.sourceLang] ||= []).push(it);
      return acc;
    }, {});

    for (const sourceLang in groups) {
      const items = groups[sourceLang];
      const texts = items.map(({ text }) => (typeof text === 'string' ? text : (text?.toString?.() ?? '')));

      try {
        const joined = joinSegments(texts);
        const translatedJoined = await translateWithApi(joined, sourceLang, language);
        const pieces = splitSegments(translatedJoined);
        const ok = pieces?.length === texts.length;

        for (let i=0;i<items.length;i++){
          const translated = ok ? pieces[i] : await translateWithApi(texts[i], sourceLang, language);
          const key = getCacheKey(sourceLang, language, texts[i]);
          translationCache.current[key] = translated;
          items[i].resolve(translated);
        }
      } catch (e) {
        console.error('Batch translation failed; fallback per item', e);
        for (let i=0;i<items.length;i++){
          try {
            const t = await translateWithApi(texts[i], sourceLang, language);
            const key = getCacheKey(sourceLang, language, texts[i]);
            translationCache.current[key] = t;
            items[i].resolve(t);
          } catch {
            items[i].resolve(texts[i]);
          }
        }
      }
    }

    localStorage.setItem('translationCache', JSON.stringify(translationCache.current));
    localStorage.setItem('translationCacheDate', todayStr());
  }, [language]);

  const translateDynamicText = useCallback((text, sourceLang) => {
    if (!text || language === sourceLang) return Promise.resolve(text);
    const safe = typeof text === 'string' ? text : (text?.toString?.() ?? '');
    const key = getCacheKey(sourceLang, language, safe);
    if (translationCache.current[key]) return Promise.resolve(translationCache.current[key]);

    // Normalización manual para referencias de Tanya: primero a hebreo
    const manualHebrew = translateTanyaManual(safe);
    if (manualHebrew) {
      // Si el destino es hebreo, devolvemos directamente
      if (language === 'he') {
        translationCache.current[key] = manualHebrew;
        return Promise.resolve(manualHebrew);
      }
      // Si el destino es otro idioma (es/en), traducimos desde he → destino
      const newKey = getCacheKey('he', language, manualHebrew);
      if (translationCache.current[newKey]) return Promise.resolve(translationCache.current[newKey]);
      return translateWithApi(manualHebrew, 'he', language).then((res) => {
        translationCache.current[newKey] = res;
        return res;
      });
    }

    return new Promise(resolve => {
      translationQueue.current.push({ text: safe, sourceLang, resolve });
      if (translationTimeout.current) clearTimeout(translationTimeout.current);
      translationTimeout.current = setTimeout(processTranslationQueue, 100);
    });
  }, [language, processTranslationQueue]);

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => {
      const next = prev === 'es' ? 'he' : prev === 'he' ? 'en' : 'es';
      localStorage.setItem('language', next);
      return next;
    });
  }, []);

  const t = useCallback((key) => (translations[language]?.[key]) || translations.es[key] || key, [language]);
  const value = useMemo(() => ({ language, toggleLanguage, t, translateDynamicText }), [language, toggleLanguage, t, translateDynamicText]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};