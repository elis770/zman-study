export const translations = {
  es: { 'ZMANIM_TITLE':'Zmanim','NETZ_HAJAMA':'Netz Hajama','SOF_SHEMA':'Sof Shema','SHKIA':'Shkia','CANDLE_LIGHTING':'Encendido de velas','TZET_HAKOJABIM':'Tzet hakojabim','JATZOT':'Jatzot','STUDY_TITLE':'Estudio de Hoy','JUMASH':'Jumash','PARASHA_TITLE':'Parashá','HAFTARA_TITLE':'Haftará','DAF_YOMI_TITLE':'Daf Yomi','SEFER_HAMITZVOT_TITLE':'Sefer HaMitzvot','RAMBAM_1':'Rambam 1 Perek','TEHILIM':'Tehilim','TANYA':'Tania','RAMBAM_3':'Rambam 3 Perek','HAIOM_IOM_TITLE':'Haiom Iom','MINIAN_TITLE':'Minian','ABOUT_ME_TITLE':'Sobre Mí','CHANGE_TO_HEBREW':'Cambiar a Hebreo','CHANGE_TO_SPANISH':'Cambiar a Español','CHANGE_TO_ENGLISH':'Cambiar a Inglés','SETTINGS_TITLE':'Configuración','SHOW_MINIAN':'Mostrar Minian','HIDE_MINIAN':'Ocultar Minian','SHOW_HAYOM_YOM':'Mostrar Haiom Iom','HIDE_HAYOM_YOM':'Ocultar Haiom Iom','ADD_MINIAN_PROMPT':'Agregar Horarios de Minian','ADD_MINIAN':'Agregar Minian','PRAYER':'Rezo','HOUR':'Hora','MINUTE':'Minuto','SAVE':'Guardar','AVISOS_EVENTS_TITLE':'Avisos y Eventos','SHAJARIT':'Shajarit','MINJA':'Minjá','MAARIV':'Maariv', 'GENERAL_SETTINGS': 'Configuración General', 'ADD_AVISO_TITLE':'Agregar Nuevo Aviso','AVISO_TITLE':'Título','AVISO_CONTENT':'Contenido','AVISO_CATEGORY':'Categoría','AVISO_EVENT':'Evento','AVISO_DONATION':'Donación','AVISO_CLASS':'Clase/Shiur','AVISO_REMINDER':'Recordatorio','AVISO_OTHER':'Otro','ADD_AVISO_BUTTON':'Agregar Aviso','MANAGE_AVISOS':'Gestionar Avisos','DELETE':'Eliminar' },
  he: { 'ZMANIM_TITLE':'זמנים','NETZ_HAJAMA':'נץ החמה','SOF_SHEMA':'סוף זמן קריאת שמע','SHKIA':'שקיעה','CANDLE_LIGHTING':'הדלקת נרות','TZET_HAKOJABIM':'צאת הכוכבים','JATZOT':'חצות','STUDY_TITLE':'לימוד יומי','JUMASH':'חומש','PARASHA_TITLE':'פרשה','HAFTARA_TITLE':'הפטרה','DAF_YOMI_TITLE':'דף יומי','SEFER_HAMITZVOT_TITLE':'ספר המצוות','RAMBAM_1':'רמב"ם פרק אחד','TEHILIM':'תהילים','TANYA':'תניא','RAMBAM_3':'רמב"ם ג׳ פרקים','HAIOM_IOM_TITLE':'היום יום','MINIAN_TITLE':'תפילה ','ABOUT_ME_TITLE':'אודות','CHANGE_TO_HEBREW':'שנה לעברית','CHANGE_TO_SPANISH':'שנה לספרדית','CHANGE_TO_ENGLISH':'שנה לאנגלית','SETTINGS_TITLE':'הגדרות','SHOW_MINIAN':'הצג מניין','HIDE_MINIAN':'הסתר מניין','SHOW_HAYOM_YOM':'הצג היום יום','HIDE_HAYOM_YOM':'הסתר היום יום','ADD_MINIAN_PROMPT':'הוסף זמני מניין','ADD_MINIAN':'הוסף מניין','PRAYER':'תפילה','HOUR':'שעה','MINUTE':'דקה','SAVE':'שמור','AVISOS_EVENTS_TITLE':'הודעות ואירועים','SHAJARIT':'שחרית','MINJA':'מנחה','MAARIV':'ערבית', 'GENERAL_SETTINGS': 'הגדרות כלליות', 'ADD_AVISO_TITLE':'הוסף הודעה חדשה','AVISO_TITLE':'כותרת','AVISO_CONTENT':'תוכן','AVISO_CATEGORY':'קטגוריה','AVISO_EVENT':'אירוע','AVISO_DONATION':'תרומה','AVISO_CLASS':'שיעור','AVISO_REMINDER':'תזכורת','AVISO_OTHER':'אחר','ADD_AVISO_BUTTON':'הוסף הודעה','MANAGE_AVISOS':'נהל הודעות','DELETE':'מחק' },
  en: { 'ZMANIM_TITLE':'Zmanim','NETZ_HAJAMA':'Sunrise','SOF_SHEMA':'Latest Shema','SHKIA':'Sunset','CANDLE_LIGHTING':'Candle Lighting','TZET_HAKOJABIM':'Nightfall','JATZOT':'Midday','STUDY_TITLE':"Today's Study",'JUMASH':'Chumash','PARASHA_TITLE':'Parasha','HAFTARA_TITLE':'Haftara','DAF_YOMI_TITLE':'Daf Yomi','SEFER_HAMITZVOT_TITLE':'Sefer HaMitzvot','RAMBAM_1':'Rambam 1 Perek','TEHILIM':'Tehilim','TANYA':'Tanya','RAMBAM_3':'Rambam 3 Perek','HAIOM_IOM_TITLE':'Hayom Yom','MINIAN_TITLE':'Minyan','ABOUT_ME_TITLE':'About Me','CHANGE_TO_HEBREW':'Change to Hebrew','CHANGE_TO_SPANISH':'Change to Spanish','CHANGE_TO_ENGLISH':'Change to English','SETTINGS_TITLE':'Settings','ADD_MINIAN':'Add Minyan','PRAYER':'Prayer','HOUR':'Hour','MINUTE':'Minute','SAVE':'Save', 'GENERAL_SETTINGS': 'General Settings', 'ADD_AVISO_TITLE':'Add New Notice','AVISO_TITLE':'Title','AVISO_CONTENT':'Content','AVISO_CATEGORY':'Category','AVISO_EVENT':'Event','AVISO_DONATION':'Donation','AVISO_CLASS':'Class/Shiur','AVISO_REMINDER':'Reminder','AVISO_OTHER':'Other','ADD_AVISO_BUTTON':'Add Notice','MANAGE_AVISOS':'Manage Notices','DELETE':'Delete' }
};

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