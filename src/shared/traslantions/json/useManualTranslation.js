import { useCallback } from 'react';
import { TANYA_REPLACE_MAP } from './constants.js';
import { hebrewNumeral, romanToInt } from './utils.js';

export const useManualTranslation = () => {
  const translateTanyaManual = useCallback((text) => {
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
  }, []);

  return { translateTanyaManual };
};