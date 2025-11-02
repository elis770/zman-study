// studyTransformers.js
import { toHebGematria } from './helpers.js';
import { tehilimByelul, tehilimMonthly } from './tehilim.js';

const BOOK_MAP = {
  en: { Genesis: 'Genesis', Exod: 'Exodus', Lev: 'Leviticus', Num: 'Numbers', Deut: 'Deuteronomy' },
  he: { Genesis: 'בראשית', Exod: 'שמות', Lev: 'ויקרא', Num: 'במדבר', Deut: 'דברים' },
};

export function transformRambamText(rambamObj, lang = 'he') {
  if (!rambamObj) return { rambam1: null, rambam3: null };
  return {
    rambam1: rambamObj.rambam1?.render?.(lang) ?? null,
    rambam3: rambamObj.rambam3?.render?.(lang) ?? null,
  };
}

export function transformSeferHaMitzvotText(shObj) {
  if (!shObj) return null;
  const desc = shObj?.getDesc?.();

  if (desc) {
    const m = desc.match(/([PN]\d{1,3})/);
    if (m) {
      const code = m[1];
      const kind = code[0] === 'P' ? 'מצוות עשה' : 'מצוות לא תעשה';
      const num = parseInt(code.slice(1), 10);
      const numHe = toHebGematria(num);
      return `ספר המצוות — ${kind} ${numHe}`;
    }
  }
  return shObj?.render?.('he') ?? shObj?.render?.() ?? null;
}

export function transformJumashText(jumashObj, date, lang = 'he') {
  if (!jumashObj || !date) return null;
  const jsDow = date.getDay();
  const key = String(jsDow + 1);
  const lecturaHoy = jumashObj.fullkriyah?.[key];
  if (!lecturaHoy) return null;

  const book = lecturaHoy.k; // 'Genesis', 'Exod', etc.
  const bookLabel = BOOK_MAP[lang]?.[book] || book;

  return `${bookLabel} ${lecturaHoy.b} - ${lecturaHoy.e}`;
}

export function transformTehilimText(tehilimObj, hd, lang = 'he') {
  if (!hd) return null;
  const month = hd.getMonth();
  const day = hd.getDate();

  // Hebcal a veces no devuelve Tehilim (ej. Shabat), así que usamos nuestro fallback.
  const daily = tehilimObj?.render?.({ lang }) ?? tehilimMonthly[day] ?? null;

  let extra = null;
  // Período especial de Elul y Tishrei
  if ((month === 6 && day >= 1) || (month === 7 && day <= 10)) {
    extra = tehilimByelul[month]?.[day] ?? null;
  }

  return [daily, extra].filter(Boolean).join(' | ') || null;
}