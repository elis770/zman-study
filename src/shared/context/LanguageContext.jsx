import { createContext, useContext, useState, useCallback, useMemo, useRef } from 'react';
import axios from 'axios';

// Este es un diccionario simple para las traducciones de la interfaz.
// En una aplicación real, esto podría venir de una biblioteca como i18next.
const translations = {
  es: {
    'ZMANIM_TITLE': 'Zmanim',
    'NETZ_HAJAMA': 'Netz Hajama',
    'SOF_SHEMA': 'Sof Shema',
    'SHKIA': 'Shkia',
    'CANDLE_LIGHTING': 'Encendido de velas',
    'TZET_HAKOJABIM': 'Tzet hakojabim',
    'JATZOT': 'Jatzot',
    'STUDY_TITLE': 'Estudio de Hoy',
    'JUMASH': 'Jumash',
    'PARASHA_TITLE': 'Parashá',
    'HAFTARA_TITLE': 'Haftará',
    'DAF_YOMI_TITLE': 'Daf Yomi',
    'SEFER_HAMITZVOT_TITLE': 'Sefer HaMitzvot',
    'RAMBAM_1': 'Rambam 1 Perek',
    'TEHILIM': 'Tehilim',
    'TANYA': 'Tania',
    'RAMBAM_3': 'Rambam 3 Perek',
    'HAIOM_IOM_TITLE': 'Haiom Iom',
    'MINIAN_TITLE': 'Minian',
    'ABOUT_ME_TITLE': 'Sobre Mí',
    'CHANGE_TO_HEBREW': 'Cambiar a Hebreo',
    'CHANGE_TO_SPANISH': 'Cambiar a Español',
    'SETTINGS_TITLE': 'Configuración',
    'SHOW_MINIAN': 'Mostrar Minian',
    'HIDE_MINIAN': 'Ocultar Minian',
    'SHOW_HAYOM_YOM': 'Mostrar Haiom Iom',
    'HIDE_HAYOM_YOM': 'Ocultar Haiom Iom',
    'ADD_MINIAN_PROMPT': 'Agregar Horarios de Minian',
    'ADD_MINIAN': 'Agregar Minian',
    'PRAYER': 'Rezo',
    'HOUR': 'Hora',
    'MINUTE': 'Minuto',
    'SAVE': 'Guardar',
    'AVISOS_EVENTS_TITLE': 'Avisos y Eventos',
    'SHAJARIT': 'Shajarit',
    'MINJA': 'Minjá',
    'MAARIV': 'Maariv',
  },
  he: {
    'ZMANIM_TITLE': 'זמנים',
    'NETZ_HAJAMA': 'נץ החמה',
    'SOF_SHEMA': 'סוף זמן קריאת שמע',
    'SHKIA': 'שקיעה',
    'CANDLE_LIGHTING': 'הדלקת נרות',
    'TZET_HAKOJABIM': 'צאת הכוכבים',
    'JATZOT': 'חצות',
    'STUDY_TITLE': 'לימוד יומי',
    'JUMASH': 'חומש',
    'PARASHA_TITLE': 'פרשה',
    'HAFTARA_TITLE': 'הפטרה',
    'DAF_YOMI_TITLE': 'דף יומי',
    'SEFER_HAMITZVOT_TITLE': 'ספר המצוות',
    'RAMBAM_1': 'רמב"ם פרק אחד',
    'TEHILIM': 'תהילים',
    'TANYA': 'תניא',
    'RAMBAM_3': 'רמב"ם ג׳ פרקים',
    'HAIOM_IOM_TITLE': 'היום יום',
    'MINIAN_TITLE': 'תפילה ',
    'ABOUT_ME_TITLE': 'אודות',
    'CHANGE_TO_HEBREW': 'שנה לעברית',
    'CHANGE_TO_SPANISH': 'שנה לספרדית',
    'SETTINGS_TITLE': 'הגדרות',
    'SHOW_MINIAN': 'הצג מניין',
    'HIDE_MINIAN': 'הסתר מניין',
    'SHOW_HAYOM_YOM': 'הצג היום יום',
    'HIDE_HAYOM_YOM': 'הסתר היום יום',
    'ADD_MINIAN_PROMPT': 'הוסף זמני מניין',
    'ADD_MINIAN': 'הוסף מניין',
    'PRAYER': 'תפילה',
    'HOUR': 'שעה',
    'MINUTE': 'דקה',
    'SAVE': 'שמור',
    'AVISOS_EVENTS_TITLE': 'הודעות ואירועים',
    'SHAJARIT': 'שחרית',
    'MINJA': 'מנחה',
    'MAARIV': 'ערבית',
  },
};

const LanguageContext = createContext();

// --- Lógica de Protección de Números ---
const protectNumbers = (text) => {
  if (!text) return { protectedText: '', placeholders: [] };
  const placeholders = [];
  // Ya no se convierte la gematria. Solo se protegen los números arábigos existentes.
  const protectedText = text.replace(/(\d+[:.\-]?\d*)/g, (match) => {
    const placeholder = `__${placeholders.length}__`;
    placeholders.push(match);
    return placeholder;
  });
  return { protectedText, placeholders };
};

const restoreNumbers = (text, placeholders) => {
  if (!text) return '';
  return text.replace(/__(\d+)__/g, (match, index) => placeholders[parseInt(index, 10)] || match);
};

// --- Lógica de Post-Procesamiento para Gematria mal traducida ---
const latinGematriaMap = {
  'A': 1, 'B': 2, 'G': 3, 'D': 4, 'H': 5, 'V': 6, 'W': 6, 'Z': 7,
  'CH': 8, 'T': 9, 'I': 10, 'Y': 10, 'K': 20, 'L': 30, 'M': 40,
  'N': 50, 'S': 60, 'O': 70, 'P': 80, 'F': 80, 'TZ': 90,
  'Q': 100, 'R': 200, 'SH': 300,
};

const latinGematriaToNumber = (str) => {
  let total = 0;
  let s = str.toUpperCase();
  // Casos especiales de dos letras
  if (s === 'TO') return 15; // טו
  if (s === 'TZ') return 16; // טז
  
  // Procesar de izquierda a derecha para combinaciones
  while (s.length > 0) {
    const twoLetter = s.substring(0, 2);
    const oneLetter = s.substring(0, 1);
    const value = latinGematriaMap[twoLetter] || latinGematriaMap[oneLetter] || 0;
    total += value;
    s = s.substring(latinGematriaMap[twoLetter] ? 2 : 1);
  }
  return total;
};

// --- Función de Traducción Real ---
async function translateWithApi(text, sourceLang, targetLang) {
  try {
    const { protectedText, placeholders } = protectNumbers(text);
    const response = await axios.post('https://api.mymemory.translated.net/get', null, {
      params: { q: protectedText, langpair: `${sourceLang}|${targetLang}` },
    });
    const rawTranslatedText = response.data.responseData.translatedText;
    let restoredText = restoreNumbers(rawTranslatedText, placeholders);

    // Post-procesamiento para corregir gematria transliterada (ej. "22:A-NA")
    restoredText = restoredText.replace(/(\d+):([A-Z]+(?:-[A-Z]+)?)/gi, (match, chapter, verses) => {
      const correctedVerses = verses.split('-').map(latinGematriaToNumber).join('-');
      return `${chapter}:${correctedVerses}`;
    });
    return restoredText;
  } catch (err) {
    console.error('Error translating text:', err, 'Original text:', text);
    // En caso de error, devolvemos el texto original para no romper la UI.
    return text;
  }
}

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('es'); // 'es' o 'he'

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => (prev === 'es' ? 'he' : 'es'));
  }, []);

  const t = useCallback((key) => {
    return translations[language][key] || key;
  }, [language]);

  const translationCache = useRef({});

  const translateDynamicText = useCallback(async (text, sourceLang) => {
    if (!text || language === sourceLang) {
      return text;
    }

    const cacheKey = `${sourceLang}:${language}:${text}`;
    if (translationCache.current[cacheKey]) {
      return translationCache.current[cacheKey];
    }

    const translatedText = await translateWithApi(text, sourceLang, language);
    translationCache.current[cacheKey] = translatedText; // Guardar en caché
    return translatedText;

  }, [language]);

  const value = useMemo(() => ({ language, toggleLanguage, t, translateDynamicText }), [language, toggleLanguage, t, translateDynamicText]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};