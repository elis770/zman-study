import { useState, useEffect } from 'react';
import { DailyLearning, Sedra, HDate } from '@hebcal/core';
import { getLeyningForParsha } from '@hebcal/leyning';
import '@hebcal/learning';
import { tehilimByelul, tehilimMonthly } from './tehilim.js';
// Si tu bundler soporta exports nombrados de @hebcal/learning, descomenta:
// import { seferHaMitzvot as shm } from '@hebcal/learning';

// --- Mapa mínimo para nombres de los 5 libros de la Torá ---
const BOOK_MAP = {
  en: {
    Genesis: 'Genesis', Gen: 'Genesis',
    Exodus: 'Exodus', Exod: 'Exodus',
    Leviticus: 'Leviticus', Lev: 'Leviticus',
    Numbers: 'Numbers', Num: 'Numbers',
    Deuteronomy: 'Deuteronomy', Deut: 'Deuteronomy',
  },
  he: {
    Genesis: 'בראשית', Gen: 'בראשית',
    Exodus: 'שמות', Exod: 'שמות',
    Leviticus: 'ויקרא', Lev: 'ויקרא',
    Numbers: 'במדבר', Num: 'במדבר',
    Deuteronomy: 'דברים', Deut: 'דברים',
  },
};

// --- Conversión ligera a gematría hebrea (hasta 999, sobra para SH) ---
const GEM = {
  400: 'ת', 300: 'ש', 200: 'ר', 100: 'ק',
  90: 'צ', 80: 'פ', 70: 'ע', 60: 'ס', 50: 'נ', 40: 'מ', 30: 'ל', 20: 'כ', 10: 'י',
  9: 'ט', 8: 'ח', 7: 'ז', 6: 'ו', 5: 'ה', 4: 'ד', 3: 'ג', 2: 'ב', 1: 'א',
};
function toHebGematria(n) {
  if (!Number.isFinite(n) || n <= 0) return '';
  let x = Math.floor(n);
  let out = '';

  // centenas (>=400 repite 'ת' las veces necesarias)
  while (x >= 400) { out += 'ת'; x -= 400; }
  for (const k of [300, 200, 100]) {
    if (x >= k) { out += GEM[k]; x -= k; }
  }
  // decenas y unidades cuidando 15 y 16 (ט״ו y ט״ז)
  if (x === 15) { out += 'טו'; x = 0; }
  else if (x === 16) { out += 'טז'; x = 0; }
  else {
    for (const k of [90, 80, 70, 60, 50, 40, 30, 20, 10]) {
      if (x >= k) { out += GEM[k]; x -= k; }
    }
    for (const k of [9, 8, 7, 6, 5, 4, 3, 2, 1]) {
      if (x >= k) { out += GEM[k]; x -= k; }
    }
  }

  // gershayim/geresh
  if (out.length >= 2) {
    return out.slice(0, -1) + '״' + out.slice(-1);
  }
  if (out.length === 1) {
    return out + '׳';
  }
  return out;
}

export default function useStudy({
  date,
  loading: gregorianLoading,
  hebrewObj: hd,
  lang = 'he', // 'he' o 'en'
}) {
  const [todaySH, setTodaySH] = useState(null);         // string renderizado
  const [todayJumesh, setTodayJumesh] = useState(null); // string renderizado
  const [todayTehilim, setTodayTehilim] = useState(null);

  useEffect(() => {
    if (!hd || !date) return;
    let cancelled = false;

    const calculateStudies = () => {
      if (cancelled) return;

      // Asegurar misma clase HDate que usa @hebcal/core
      const hd2 = hd instanceof HDate ? hd : new HDate(hd);

      const month = hd2.getMonth(); // 1..13
      const day = hd2.getDate();    // 1..30

      // --- Rambam (hebreo directo) ---
      const evR1 = DailyLearning.lookup('rambam1', hd2);
      const evR3 = DailyLearning.lookup('rambam3', hd2);

      // --- Sefer HaMitzvot (SH) ---
      const evSH = DailyLearning.lookup('seferHaMitzvot', hd2);

      // Rambam: render() sí está traducido
      const rambam1Text = evR1?.render?.('he') ?? null;
      const rambam3Text = evR3?.render?.('he') ?? null;
      // Si querés exponerlos, podrías agregarlos al return; aquí nos enfocamos en SH

      // SH: construir hebreo propio (porque render('he') no trae traducción fiable)
      function getShReadingCode() {
        // intento 1: si puedes importar la función directa del paquete:
        // try { return shm?.(hd2)?.reading || null; } catch { /* noop */ }

        // intento 2 (fallback universal): parsear del desc del evento
        const desc = evSH?.getDesc?.(); // ej: "Sefer HaMitzvot: P72 (Positive Commandment 72)"
        const m = desc && /(?:^|\s)([PN]\d{1,3})(?:\b|$)/.exec(desc);
        if (m) return m[1]; // "P72" o "N131"
        return null;
      }

      let shText = null;
      const code = getShReadingCode();
      if (code) {
        const kind = code[0] === 'P' ? 'מצוות עשה' : 'מצוות לא תעשה';
        const num = parseInt(code.slice(1), 10);
        const numHe = toHebGematria(num);
        shText = `ספר המצוות — ${kind} ${numHe}`;
      } else {
        // último recurso: lo que tenga render(), aunque probablemente venga en inglés
        shText = evSH?.render?.('he') ?? evSH?.render?.() ?? null;
      }
      setTodaySH(shText || null);

      // --- Parashá(s) y Jumash del día ---
      const sedra = new Sedra(hd2.getFullYear(), true);
      const raw = sedra.get(hd2);
      const parshaNames = Array.isArray(raw) ? raw : (raw?.parsha || []);

      // Día de la semana (0=Dom … 6=Sáb)
      const jsDow = date.getDay();
      const fullKriyahMap = { 0:'1', 1:'2', 2:'3', 3:'4', 4:'5', 5:'6', 6:'7' };
      const key = fullKriyahMap[jsDow];

      let leyning = null;
      for (const p of parshaNames) {
        leyning = getLeyningForParsha(p);
        if (leyning) break;
      }

      if (leyning && key && leyning.fullkriyah?.[key]) {
        const lecturaHoy = leyning.fullkriyah[key]; // { k, b, e }
        const k = lecturaHoy.k; // 'Gen'/'Genesis'/etc.
        const bookLabel = (BOOK_MAP[lang] && BOOK_MAP[lang][k]) ? BOOK_MAP[lang][k] : k;
        const jumeshText = `${bookLabel} ${lecturaHoy.b} - ${lecturaHoy.e}`;
        setTodayJumesh(jumeshText);
      } else {
        setTodayJumesh(null);
      }

      // --- Tehilim del día ---
      const learning2 = DailyLearning.lookup('tehilim', hd2);
      let dailyTehilim = null;
      if (learning2 && typeof learning2.render === 'function') {
        try {
          dailyTehilim = learning2.render({ lang });
        } catch {
          try {
            dailyTehilim = learning2.render(lang);
          } catch {
            dailyTehilim = learning2.render();
          }
        }
      }

      // Si hebcal no devuelve (p.ej. Shabat), usar ciclo mensual
      if (!dailyTehilim && tehilimMonthly[day]) {
        dailyTehilim = `${tehilimMonthly[day]}`;
      }

      // Extra de Elul (1 Elul – 10 Tishrei)
      let extra = null;
      if ((month === 6 && day >= 1) || (month === 7 && day <= 10)) {
        if (tehilimByelul[month]?.[day]) {
          extra = `${tehilimByelul[month][day]}`;
        }
      }

      const combinedTehilim = [dailyTehilim, extra].filter(Boolean).join(' | ');
      setTodayTehilim(combinedTehilim || null);
    };

    calculateStudies();
    return () => { cancelled = true; };
  }, [hd, date, lang]);

  return { todaySH, todayJumesh, todayTehilim, loading: gregorianLoading };
}