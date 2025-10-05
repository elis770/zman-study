import { createContext, useContext, useState, useCallback, useMemo, useRef, useEffect } from 'react';
import axios from 'axios';

const translations = {
  es: { 'ZMANIM_TITLE':'Zmanim','NETZ_HAJAMA':'Netz Hajama','SOF_SHEMA':'Sof Shema','SHKIA':'Shkia','CANDLE_LIGHTING':'Encendido de velas','TZET_HAKOJABIM':'Tzet hakojabim','JATZOT':'Jatzot','STUDY_TITLE':'Estudio de Hoy','JUMASH':'Jumash','PARASHA_TITLE':'Parashá','HAFTARA_TITLE':'Haftará','DAF_YOMI_TITLE':'Daf Yomi','SEFER_HAMITZVOT_TITLE':'Sefer HaMitzvot','RAMBAM_1':'Rambam 1 Perek','TEHILIM':'Tehilim','TANYA':'Tania','RAMBAM_3':'Rambam 3 Perek','HAIOM_IOM_TITLE':'Haiom Iom','MINIAN_TITLE':'Minian','ABOUT_ME_TITLE':'Sobre Mí','CHANGE_TO_HEBREW':'Cambiar a Hebreo','CHANGE_TO_SPANISH':'Cambiar a Español','CHANGE_TO_ENGLISH':'Cambiar a Inglés','SETTINGS_TITLE':'Configuración','SHOW_MINIAN':'Mostrar Minian','HIDE_MINIAN':'Ocultar Minian','SHOW_HAYOM_YOM':'Mostrar Haiom Iom','HIDE_HAYOM_YOM':'Ocultar Haiom Iom','ADD_MINIAN_PROMPT':'Agregar Horarios de Minian','ADD_MINIAN':'Agregar Minian','PRAYER':'Rezo','HOUR':'Hora','MINUTE':'Minuto','SAVE':'Guardar','AVISOS_EVENTS_TITLE':'Avisos y Eventos','SHAJARIT':'Shajarit','MINJA':'Minjá','MAARIV':'Maariv' },
  he: { 'ZMANIM_TITLE':'זמנים','NETZ_HAJAMA':'נץ החמה','SOF_SHEMA':'סוף זמן קריאת שמע','SHKIA':'שקיעה','CANDLE_LIGHTING':'הדלקת נרות','TZET_HAKOJABIM':'צאת הכוכבים','JATZOT':'חצות','STUDY_TITLE':'לימוד יומי','JUMASH':'חומש','PARASHA_TITLE':'פרשה','HAFTARA_TITLE':'הפטרה','DAF_YOMI_TITLE':'דף יומי','SEFER_HAMITZVOT_TITLE':'ספר המצוות','RAMBAM_1':'רמב"ם פרק אחד','TEHILIM':'תהילים','TANYA':'תניא','RAMBAM_3':'רמב"ם ג׳ פרקים','HAIOM_IOM_TITLE':'היום יום','MINIAN_TITLE':'תפילה ','ABOUT_ME_TITLE':'אודות','CHANGE_TO_HEBREW':'שנה לעברית','CHANGE_TO_SPANISH':'שנה לספרדית','CHANGE_TO_ENGLISH':'שנה לאנגלית','SETTINGS_TITLE':'הגדרות','SHOW_MINIAN':'הצג מניין','HIDE_MINIAN':'הסתר מניין','SHOW_HAYOM_YOM':'הצג היום יום','HIDE_HAYOM_YOM':'הסתר היום יום','ADD_MINIAN_PROMPT':'הוסף זמני מניין','ADD_MINIAN':'הוסף מניין','PRAYER':'תפילה','HOUR':'שעה','MINUTE':'דקה','SAVE':'שמור','AVISOS_EVENTS_TITLE':'הודעות ואירועים','SHAJARIT':'שחרית','MINJA':'מנחה','MAARIV':'ערבית' },
  en: { 'ZMANIM_TITLE':'Zmanim','NETZ_HAJAMA':'Sunrise','SOF_SHEMA':'Latest Shema','SHKIA':'Sunset','CANDLE_LIGHTING':'Candle Lighting','TZET_HAKOJABIM':'Nightfall','JATZOT':'Midday','STUDY_TITLE':"Today's Study",'JUMASH':'Chumash','PARASHA_TITLE':'Parasha','HAFTARA_TITLE':'Haftara','DAF_YOMI_TITLE':'Daf Yomi','SEFER_HAMITZVOT_TITLE':'Sefer HaMitzvot','RAMBAM_1':'Rambam 1 Perek','TEHILIM':'Tehilim','TANYA':'Tanya','RAMBAM_3':'Rambam 3 Perek','HAIOM_IOM_TITLE':'Hayom Yom','MINIAN_TITLE':'Minyan','ABOUT_ME_TITLE':'About Me','CHANGE_TO_HEBREW':'Change to Hebrew','CHANGE_TO_SPANISH':'Change to Spanish','CHANGE_TO_ENGLISH':'Change to English','SETTINGS_TITLE':'Settings','ADD_MINIAN':'Add Minyan','PRAYER':'Prayer','HOUR':'Hour','MINUTE':'Minute','SAVE':'Save' }
};

const LanguageContext = createContext();

// --- Protección de números ---
const protectNumbers = (text) => {
  if (!text) return { protectedText: '', placeholders: [] };
  const placeholders = [];
  const protectedText = String(text).replace(/(\d+[:.\-]?\d*)/g, (m) => {
    const ph = `__${placeholders.length}__`;
    placeholders.push(m);
    return ph;
  });
  return { protectedText, placeholders };
};
const restoreNumbers = (text, placeholders) =>
  String(text || '').replace(/__(\d+)__/g, (m, i) => placeholders[parseInt(i, 10)] || m);

// --- Gematria ---
const latinGematriaMap = { A:1,B:2,G:3,D:4,H:5,V:6,W:6,Z:7,CH:8,T:9,I:10,Y:10,K:20,L:30,M:40,N:50,S:60,O:70,P:80,F:80,TZ:90,Q:100,R:200,SH:300 };
const latinGematriaToNumber = (str) => {
  let total = 0, s = String(str).toUpperCase();
  if (s === 'TO') return 15;
  if (s === 'TZ') return 16;
  while (s.length) {
    const two = s.slice(0,2), one = s.slice(0,1);
    const val = latinGematriaMap[two] || latinGematriaMap[one] || 0;
    total += val; s = s.slice(latinGematriaMap[two] ? 2 : 1);
  }
  return total;
};

// --- API traducción (robusta) ---
async function translateWithApi(text, sourceLang, targetLang) {
  try {
    const { protectedText, placeholders } = protectNumbers(String(text));
    const { data } = await axios.get('https://api.mymemory.translated.net/get', {
      params: { q: protectedText.slice(0,4900), langpair: `${sourceLang}|${targetLang}`, de: import.meta.env.VITE_TRANSLATION_API_EMAIL }
    });
    let restored = restoreNumbers(data?.responseData?.translatedText ?? protectedText, placeholders);
    restored = restored.replace(/(\d+):([A-Z]+(?:-[A-Z]+)?)/gi, (m, ch, verses) =>
      `${ch}:${verses.split('-').map(latinGematriaToNumber).join('-')}`
    );
    return restored;
  } catch (e) {
    console.error('Error translating text:', e, 'Original:', text);
    return String(text);
  }
}

// --- Marcadores robustos para batch ---
const SEG_START = '\uE000', SEG_END = '\uE001';
const joinSegments  = (arr) => arr.map((txt,i)=>`${SEG_START}${i}${SEG_END}${txt}`).join('');
const splitSegments = (joined) => {
  const re = new RegExp(`${SEG_START}(\\d+)${SEG_END}`, 'g');
  const out = [], idxs = []; let m;
  while ((m = re.exec(joined)) !== null) idxs.push({ idx: parseInt(m[1],10), pos: m.index });
  idxs.forEach((seg,i)=>{
    const marker = `${SEG_START}${seg.idx}${SEG_END}`;
    const start = seg.pos + marker.length;
    const end = i+1<idxs.length ? idxs[i+1].pos : joined.length;
    out[seg.idx] = joined.slice(start,end);
  });
  return out;
};

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

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
};