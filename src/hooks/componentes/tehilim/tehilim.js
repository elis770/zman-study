import { HDate, DailyLearning } from '@hebcal/core';
import '@hebcal/learning';
import tehillimElul from './tehilim-elul.js';

const dt = new Date();
const hd = new HDate(dt);

const ev = DailyLearning.lookup('psalms', hd);

const month = hd.getMonth();
const day = hd.getDate();

let extra = null;

// 1 Elul (6:1) hasta 10 Tishrei (7:10)
if (
  (month === 6 && day >= 1) || 
  (month === 7 && day <= 10)
) {
  // buscar dentro del JSON usando el mes y el día
  if (tehillimElul[month] && tehillimElul[month][day]) {
    extra = tehillimElul[month][day];
  }
}

// mostrar resultados
if (ev) {
  console.log(
    dt.toLocaleDateString(),
    hd.toString(),
    ev.render('en'),
    extra ? `+ Extra (Jabad): ${extra}` : ""
  );
} else {
  console.log(
    dt.toLocaleDateString(),
    hd.toString(),
    "No hay Tehilim asignado para hoy",
    extra ? `+ Extra (Jabad): ${extra}` : ""
  );
}