import { HDate, DailyLearning } from '@hebcal/core';
import '@hebcal/learning';

const dt = new Date();
const hd = new HDate(dt);

const ev1 = DailyLearning.lookup('rambam1', hd);      // 1 capítulo por día
const ev2 = DailyLearning.lookup('rambam3', hd);      // 3 capítulos por día
const ev3 = DailyLearning.lookup('seferHaMitzvot', hd);

console.log(dt.toLocaleDateString(), hd.toString(), ev1?.render('he'));
console.log(dt.toLocaleDateString(), hd.toString(), ev2?.render('he'));
console.log(dt.toLocaleDateString(), hd.toString(), ev3?.render('he'));

// Si necesitás el enlace a la fuente:
console.log('URL Rambam 1-chap:', ev1?.url());
console.log('URL Rambam 3-chap:', ev2?.url());
console.log('URL Sefer Ha Mitzvot:', ev3?.url());