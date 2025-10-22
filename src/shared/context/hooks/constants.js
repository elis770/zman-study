// === NUEVO: catálogo de secciones de Tanya (tabla pedida) ===
export const TANYA_SECTIONS = [
  { order: 1,  he: null,                        es: 'Portada / cubierta / título',         en: null,                              note: 'La página inicial del libro, con título, autor, etc.' },
  { order: 2,  he: 'הסכמות',                   es: 'Aprobaciones / prefacios rabínicos',  en: 'Approvals / Prefaces',            note: 'Aprobaciones rabínicas' },
  { order: 3,  he: 'מבוא / הקדמה',             es: 'Introducción',                         en: 'Introduction',                    note: 'Propósito general, método' },
  { order: 4,  he: 'חינוך קטן',                 es: 'Educación pequeña / “Jinuj Katan”',    en: 'Chinukh Katan / “Little Education”', note: 'Antes de שער היחוד והאמונה' },
  { order: 5,  he: 'ליקוטי אמרים / ספר של בינונים', es: 'Colección de dichos / Libro de los intermedios', en: 'Likkutei Amarim / Sefer shel Beinonim', note: 'Primera sección principal' },
  { order: 6,  he: 'שער היחוד והאמונה',         es: 'Puerta de Unidad y Fe',               en: 'Gate of Unity and Faith',         note: 'Filosofía profunda' },
  { order: 7,  he: 'אגרת התשובה',               es: 'Carta del arrepentimiento',           en: 'Epistle of Repentance',           note: 'Teshuvá' },
  { order: 8,  he: 'אגרת הקודש',                es: 'Carta santa / epístola sagrada',      en: 'Holy Epistle',                    note: 'Cartas del Alter Rebe' },
  { order: 9,  he: 'קונטרס אחרון',              es: 'Tratado / folleto final',             en: 'Final Treatise',                  note: 'Ajustes y adiciones' },
];

// === NUEVO: diccionario de reemplazos para parser manual ===
export const TANYA_REPLACE_MAP = [
  // Frases largas primero (para evitar solapamientos)
  { re: /\blikku?tei amarim\b/i,                he: 'ליקוטי אמרים' },
  { re: /\bsefer shel beinonim\b/i,             he: 'ספר של בינונים' },
  { re: /\bsha[’'\u2019]?ar ha?yichud veha?emunah\b/i, he: 'שער היחוד והאמונה' },
  { re: /\bigeret ha?t(e)?shuvah\b/i,           he: 'אגרת התשובה' },
  { re: /\bigeret ha?kodesh\b/i,                he: 'אגרת הקודש' },
  { re: /\bkuntres acharon\b/i,                 he: 'קונטרס אחרון' },
  { re: /\bchin(u|o)kh katan\b/i,               he: 'חינוך קטן' },
  { re: /\bintroduc(?:cion|tion)\b/i,           he: 'מבוא' },
  { re: /\bhaskom(?:ot|a|os)\b/i,               he: 'הסכמות' },

  // Términos genéricos
  { re: /\btanya\b/i,                           he: 'תניא' },
  { re: /\bepistle\b/i,                         he: 'אגרת' },
  { re: /\bchapter\b/i,                         he: 'פרק' },
  { re: /\bpart\b/i,                            he: 'חלק' },
];