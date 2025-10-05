import axios from 'axios';

// --- Protección de números ---
export const protectNumbers = (text) => {
  if (!text) return { protectedText: '', placeholders: [] };
  const placeholders = [];
    const protectedText = String(text).replace(/(\d+[:.-]?\d*)/g, (m) => {
    const ph = `__${placeholders.length}__`;
    placeholders.push(m);
    return ph;
  });
  return { protectedText, placeholders };
};

export const restoreNumbers = (text, placeholders) =>
  String(text || '').replace(/__(\d+)__/g, (m, i) => placeholders[parseInt(i, 10)] || m);

// --- Gematria ---
const latinGematriaMap = { A:1,B:2,G:3,D:4,H:5,V:6,W:6,Z:7,CH:8,T:9,I:10,Y:10,K:20,L:30,M:40,N:50,S:60,O:70,P:80,F:80,TZ:90,Q:100,R:200,SH:300 };

export const latinGematriaToNumber = (str) => {
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
export async function translateWithApi(text, sourceLang, targetLang) {
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

export const joinSegments  = (arr) => arr.map((txt,i)=>`${SEG_START}${i}${SEG_END}${txt}`).join('');

export const splitSegments = (joined) => {
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

import { TANYA_REPLACE_MAP } from './translations.js';

// =========================
// Romanos → arábigos
// =========================
export function romanToInt(roman) {
  if (!roman) return NaN;
  const s = roman.toUpperCase().trim();
  const map = { I:1, V:5, X:10, L:50, C:100, D:500, M:1000 };
  let total = 0;
  for (let i = 0; i < s.length; i++) {
    const curr = map[s[i]] || 0;
    const next = map[s[i+1]] || 0;
    total += curr < next ? -curr : curr;
  }
  return total;
}

// =========================
// Número → גימטריא hebrea
// =========================
export function hebrewNumeral(n) {
  const num = parseInt(n, 10);
  if (!Number.isFinite(num) || num <= 0) return String(n);

  const units = ['', 'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט'];
  const tens = ['', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ'];
  const hundreds = ['', 'ק', 'ר', 'ש', 'ת', 'תק', 'תר', 'תש', 'תת', 'תתק'];

  if (num === 15) return 'ט״ו';
  if (num === 16) return 'ט״ז';

  let nLeft = num;
  let out = '';
  if (nLeft >= 100) {
    const h = Math.floor(nLeft / 100);
    out += hundreds[h];
    nLeft = nLeft % 100;
  }
  if (nLeft >= 10) {
    const t = Math.floor(nLeft / 10);
    out += tens[t];
    nLeft = nLeft % 10;
  }
  if (nLeft > 0) out += units[nLeft];

  if (out.length >= 2) return out.slice(0, -1) + '״' + out.slice(-1);
  return out + '׳';
}

// =========================
// Traducción manual de Tanya y secciones
// =========================
export const translateTanyaManual = (text) => {
  if (typeof text !== 'string') return null;

  // Heurística: sólo aplicar si parece referencia a Tanya/partes/secciones
  if (!/tanya|igeret|ig?geret|likku?tei amarim|sha[’'\u2019]?ar|kuntres|beinonim|teshuvah|kodesh|part\s+[IVXLCDM]+/i.test(text)) {
    return null;
  }

  let out = String(text).trim();

  // Normalizar separadores
  out = out.replace(/\s*;\s*/g, '; ').replace(/\s*,\s*/g, ', ');

  // Reemplazos léxicos a hebreo
  for (const { re, he } of TANYA_REPLACE_MAP) {
    out = out.replace(re, he);
  }

  // Asegurar "Tanya" → "תניא"
  out = out.replace(/\btanya\b/i, 'תניא');

  // Partes romanas → חלק + גימטריא
  out = out.replace(/\bPart\s+([IVXLCDM]+)\b/ig, (_, roman) => {
    const n = romanToInt(roman);
    return Number.isFinite(n) ? `חלק ${hebrewNumeral(n)}` : `חלק ${roman}`;
  });

  // Capítulo:verso con rango, luego simple
  out = out.replace(/\b(\d{1,3})\s*:\s*(\d{1,3})\s*[-–—]\s*(\d{1,3})\b/g,
    (_, ch, v1, v2) => `${hebrewNumeral(ch)}:${hebrewNumeral(v1)}–${hebrewNumeral(v2)}`
  );
  out = out.replace(/\b(\d{1,3})\s*:\s*(\d{1,3})\b/g,
    (_, ch, v) => `${hebrewNumeral(ch)}:${hebrewNumeral(v)}`
  );

  // Rangos sueltos
  out = out.replace(/\b(\d{1,3})\s*[-–—]\s*(\d{1,3})\b/g,
    (_, a, b) => `${hebrewNumeral(a)}–${hebrewNumeral(b)}`
  );

  // Limpieza final
  out = out.replace(/\s*;\s*/g, '; ').replace(/\s*,\s*/g, ', ');
  return out;
};