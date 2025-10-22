import { useRef, useEffect, useCallback } from 'react';
import { translateWithApi, joinSegments, splitSegments } from './api.js';

const getCacheKey = (src, tgt, text) => `${src}:${tgt}:${text}`;
const todayStr = () => new Date().toISOString().split('T')[0];

export const useTranslationQueue = (language) => {
  const translationCache = useRef({});
  const translationQueue = useRef([]);
  const translationTimeout = useRef(null);

  // Cargar caché desde localStorage al montar
  useEffect(() => {
    const today = todayStr();
    try {
      const cache = localStorage.getItem('translationCache');
      const date = localStorage.getItem('translationCacheDate');
      if (cache && date === today) {
        translationCache.current = JSON.parse(cache);
      } else {
        localStorage.removeItem('translationCache');
        localStorage.removeItem('translationCacheDate');
      }
    } catch (e) {
      console.error("Failed to load translation cache from localStorage", e);
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

        for (let i = 0; i < items.length; i++) {
          const translated = ok ? pieces[i] : await translateWithApi(texts[i], sourceLang, language);
          const key = getCacheKey(sourceLang, language, texts[i]);
          translationCache.current[key] = translated;
          items[i].resolve(translated);
        }
      } catch (e) {
        console.error('Batch translation failed; fallback per item', e);
        for (let i = 0; i < items.length; i++) {
          try {
            const t = await translateWithApi(texts[i], sourceLang, language);
            const key = getCacheKey(sourceLang, language, texts[i]);
            translationCache.current[key] = t;
            items[i].resolve(t);
          } catch {
            items[i].resolve(texts[i]); // Fallback to original text on error
          }
        }
      }
    }

    localStorage.setItem('translationCache', JSON.stringify(translationCache.current));
    localStorage.setItem('translationCacheDate', todayStr());
  }, [language]);

  const addToQueue = useCallback((text, sourceLang) => {
    return new Promise(resolve => {
      translationQueue.current.push({ text, sourceLang, resolve });
      if (translationTimeout.current) clearTimeout(translationTimeout.current);
      translationTimeout.current = setTimeout(processTranslationQueue, 100);
    });
  }, [processTranslationQueue]);

  return { translationCache, addToQueue };
};
