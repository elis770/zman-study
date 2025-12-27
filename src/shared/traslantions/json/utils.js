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