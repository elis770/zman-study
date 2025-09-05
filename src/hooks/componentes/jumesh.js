import { HDate, Sedra } from '@hebcal/core';
import { getLeyningForParsha } from '@hebcal/leyning';

const hoyH = new HDate();
const sedra = new Sedra(hoyH.getFullYear(), true);
const parsha = sedra.get(hoyH);

// Obtenemos leyning de la primera parashá válida
let leyning = null;
for (let p of parsha) {
  leyning = getLeyningForParsha(p);
  if (leyning) break;
}

if (!leyning) {
  console.log("No se encontró leyning para esta parashá");
} else {
  const diasHeb = ['Dom','Lun','Mar','Mie','Jue','Vie','Sab'];
  const jsDow = new Date().getDay(); // 0=Domingo … 6=Sábado

  // Map JS day a fullkriyah key (1=Dom, 2=Lun ... 7=Shabat)
  const fullKriyahMap = {
    0: '1', // domingo
    1: '2', // lunes
    2: '3', // martes
    3: '4', // miércoles
    4: '5', // jueves
    5: '6', // viernes
    6: '7'  // shabat
  };

  const key = fullKriyahMap[jsDow];

  if (key && leyning.fullkriyah[key]) {
    const lecturaHoy = leyning.fullkriyah[key];
    console.log(`Lectura de hoy (${diasHeb[jsDow]}): ${lecturaHoy.k} ${lecturaHoy.b} a ${lecturaHoy.e}`);
  } else {
    console.log(`No hay lectura definida para hoy (${diasHeb[jsDow]})`);
  }

  // Haftará del Shabat
  console.log("Haftará del Shabat próximo:", leyning.haftara);
}