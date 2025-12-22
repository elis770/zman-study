// studyTransformersClass.js
import { toHebGematria } from '../../context/study/helpers.js';
import { tehilimByelul, tehilimMonthly } from './tehilim.js';

// -------------------- Constants --------------------
const BOOK_MAP = {
  en: { Genesis: 'Genesis', Exod: 'Exodus', Lev: 'Leviticus', Num: 'Numbers', Deut: 'Deuteronomy' },
  he: { Genesis: 'בראשית', Exod: 'שמות', Lev: 'ויקרא', Num: 'במדבר', Deut: 'דברים' },
};

// -------------------- Base Transformer --------------------
export class BaseTransformer {
  constructor(obj, lang = 'he') {
    this.obj = obj;
    this.lang = lang;
  }

  getText() {
    if (!this.obj) return null;
    return this.obj?.render?.(this.lang) ?? this.obj?.render?.() ?? null;
  }
}

// -------------------- Simple Transformers --------------------
export class SimpleYomiTransformer extends BaseTransformer {
  transform() {
    return this.getText();
  }
}

// -------------------- Jumash --------------------
export class JumashTransformer extends BaseTransformer {
  constructor(jumashObj, date, lang = 'he') {
    super(jumashObj, lang);
    this.date = date;
  }

  transform() {
    if (!this.obj || !this.date) return null;

    const jsDow = this.date.getDay();
    const key = String(jsDow + 1);
    const lecturaHoy = this.obj.fullkriyah?.[key];
    if (!lecturaHoy) return null;

    const book = lecturaHoy.k;
    const bookLabel = BOOK_MAP[this.lang]?.[book] || book;

    return `${bookLabel} ${lecturaHoy.b} - ${lecturaHoy.e}`;
  }
}
// -------------------- Daf Yomi --------------------
export class DafYomiTransformer extends BaseTransformer {
  transform() {
    const text = this.getText();
    if (!text) return null;

    const regex = /(דַּף יוֹמִי:|יְרוּשַׁלְמִי)\s*(.*)/g;
    const matches = [];
    let match;

    while ((match = regex.exec(text)) !== null) {
      // match[2] contiene lo que viene después de la etiqueta
      matches.push(match[2].trim());
    }

    // Devolver texto completo si no se encontró ninguna coincidencia
    return matches.length === 0
      ? text
      : matches.length === 1
      ? matches[0]
      : matches;
  }
}

// -------------------- Rambam --------------------
export class RambamTransformer extends BaseTransformer {
  transform() {
    if (!this.obj) return { rambam1: null, rambam3: null };
    return {
      rambam1: new BaseTransformer(this.obj.rambam1, this.lang).getText(),
      rambam3: new BaseTransformer(this.obj.rambam3, this.lang).getText(),
    };
  }
}

// -------------------- Sefer HaMitzvot --------------------
export class SeferHaMitzvotTransformer extends BaseTransformer {
  transform() {
    if (!this.obj) return null;

    const desc = this.obj?.getDesc?.();
    if (desc) {
      const m = desc.match(/([PN]\d{1,3})/);
      if (m) {
        const code = m[1];
        const kind = code[0] === 'P' ? "מ''ע " : "מל''ת ";
        const num = parseInt(code.slice(1), 10);
        const numHe = toHebGematria(num);
        return `${kind} ${numHe}`;
      }
    }

    return this.getText();
  }
}