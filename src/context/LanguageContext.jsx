import { createContext, useContext, useState, useCallback, useMemo } from 'react';

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

// Esta es una función de traducción simulada.
// ¡IMPORTANTE! En una aplicación real, deberías reemplazar esto con una llamada a un backend
// que use un servicio como Google Translate API. No expongas tus claves de API en el cliente.
async function translateWithApi(text, targetLang) {
  if (!text) return '';
  console.warn(`Simulando traducción de API para: "${text}" a ${targetLang}. Reemplazar con una llamada real a la API.`);
  // Simular retraso de red
  await new Promise(res => setTimeout(res, 200));
  return `[${targetLang}] ${text}`; // Devuelve una traducción simulada
}

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('es'); // 'es' o 'he'

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => (prev === 'es' ? 'he' : 'es'));
  }, []);

  const t = useCallback((key) => {
    return translations[language][key] || key;
  }, [language]);

  const translateDynamicText = useCallback(async (text, sourceLang) => {
    if (language === sourceLang) return text;
    return translateWithApi(text, language);
  }, [language]);

  const value = useMemo(() => ({ language, toggleLanguage, t, translateDynamicText }), [language, toggleLanguage, t, translateDynamicText]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};