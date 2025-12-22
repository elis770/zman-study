// helpers.js
export const GEM = {
  400: 'ת', 300: 'ש', 200: 'ר', 100: 'ק',
  90: 'צ', 80: 'פ', 70: 'ע', 60: 'ס', 50: 'נ', 40: 'מ', 30: 'ל', 20: 'כ', 10: 'י',
  9: 'ט', 8: 'ח', 7: 'ז', 6: 'ו', 5: 'ה', 4: 'ד', 3: 'ג', 2: 'ב', 1: 'א',
};

export function toHebGematria(n) {
  if (!Number.isFinite(n) || n <= 0) return '';
  let x = Math.floor(n);
  let out = '';

  // centenas (>=400 repite 'ת' las veces necesarias)
  while (x >= 400) { out += 'ת'; x -= 400; }
  for (const k of [300, 200, 100]) { if (x >= k) { out += GEM[k]; x -= k; } }
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
  if (out.length >= 2) return out.slice(0, -1) + '״' + out.slice(-1);
  if (out.length === 1) return out + '׳';
  return out;
}