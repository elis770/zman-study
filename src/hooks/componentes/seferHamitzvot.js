import {HDate, DailyLearning} from '@hebcal/core';
import '@hebcal/learning';

const dt = new Date();
const hd = new HDate(dt);
const ev3 = DailyLearning.lookup('seferHaMitzvot', hd);
console.log(hd.toString(), ev3.render('en'));
//const ev1 = DailyLearning.lookup('rambam1', hd);
//const ev2 = DailyLearning.lookup('rambam3', hd);
//console.log(dt.toLocaleDateString(), hd.toString(), ev1.render('en'));
//console.log(dt.toLocaleDateString(), hd.toString(), ev2.render('en'));