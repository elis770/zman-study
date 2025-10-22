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

// --- Gematria (para post-procesado) ---
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

// --- API de traducción ---
export async function translateWithApi(text, sourceLang, targetLang) {
  try {
    const { protectedText, placeholders } = protectNumbers(String(text));
    const { data } = await axios.get('https://api.mymemory.translated.net/get', {
      params: { q: protectedText.slice(0,4900), langpair: `${sourceLang}|${targetLang}`, de: import.meta.env.VITE_TRANSLATION_API_EMAIL }
    });
    let restored = restoreNumbers(data?.responseData?.translatedText ?? protectedText, placeholders);
    // Post-procesado específico que la API a veces rompe
    restored = restored.replace(/(\d+):([A-Z]+(?:-[A-Z]+)?)/gi, (m, ch, verses) =>
      `${ch}:${verses.split('-').map(latinGematriaToNumber).join('-')}`
    );
    return restored;
  } catch (e) {
    console.error('Error translating text:', e, 'Original:', text);
    return String(text);
  }
}

// --- Marcadores para procesamiento en lotes ---
export const SEG_START = '\uE000';
export const SEG_END = '\uE001';

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