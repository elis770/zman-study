// seventhHourMedianBA_corrected.js
import { GeoLocation, Zmanim } from '@hebcal/core';

/**
 * Retorna el número de días en un mes de un año determinado
 */
function daysInMonth(year, month) {
  return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
}

/**
 * Calcula chatzot de todo el año y devuelve la séptima hora halájica según la mediana
 */
async function calculateSeventhHourMedian(lat, lon, tzid, city, year = new Date().getFullYear()) {
  const chatzotArray = [];

  // console.log(`Calculando chatzot para ${city}, año ${year}...`);

  for (let month = 0; month < 12; month++) {
    const days = daysInMonth(year, month);

    for (let day = 1; day <= days; day++) {
      // Fecha en UTC para evitar problemas de DST
      const date = new Date(Date.UTC(year, month, day));
      const gloc = new GeoLocation(city, lat, lon, 0, tzid);
      const zmanimCalc = new Zmanim(gloc, date);

      try {
        const chatzot = zmanimCalc.chatzot();
        if (chatzot) {
          chatzotArray.push(chatzot.getTime()); // Guardamos timestamp UTC
        }
      } catch (e) {
        console.warn(`No se pudo calcular chatzot para ${date.toISOString().slice(0, 10)}: ${e.message}`);
      }
    }
  }

  if (chatzotArray.length === 0) {
    throw new Error('No se pudieron calcular Zmanim para el año');
  }

  // Ordenar los chatzot
  chatzotArray.sort((a, b) => a - b);

  // Día central (mediana)
  const midIndex = Math.floor(chatzotArray.length / 2);
  const medianChatzot = chatzotArray[midIndex];

  // Séptima hora halájica = mediana + 6h → mediana + 7h
// Ajustada 4 minutos antes
let seventhHourStart = new Date(medianChatzot + 6 * 60 * 60 * 1000 - 4 * 60 * 1000);
let seventhHourEnd   = new Date(medianChatzot + 7 * 60 * 60 * 1000 - 4 * 60 * 1000);

  // Detectar DST comparando la diferencia entre UTC y hora local
  const startOffset = seventhHourStart.getTime() - new Date(seventhHourStart.toLocaleString('en-US', { timeZone: 'UTC' })).getTime();
  const endOffset   = seventhHourEnd.getTime() - new Date(seventhHourEnd.toLocaleString('en-US', { timeZone: 'UTC' })).getTime();

  // Normalmente el offset es constante; si difiere de 3600000*offset esperado, hay DST
  if (Math.abs(endOffset - startOffset - 3600000) > 1000) {
    // Ajuste por DST: restar 1 hora
    seventhHourStart = new Date(seventhHourStart.getTime() - 60 * 60 * 1000);
    seventhHourEnd   = new Date(seventhHourEnd.getTime() - 60 * 60 * 1000);
    // console.log('⚠️ Ajuste de hora por cambio de horario detectado (DST). Se restó 1 hora.');
  }

  const options = { timeZone: tzid, hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
  const startStr = seventhHourStart.toLocaleTimeString('es-AR', options);
  const endStr = seventhHourEnd.toLocaleTimeString('es-AR', options);

  // console.log('Chatzot mediana del año:', new Date(medianChatzot).toLocaleTimeString('es-AR', options));
  // console.log('Séptima hora halájica promedio (ajustada si corresponde):', `${startStr} - ${endStr}`);

  const x =  {
    medianChatzot: new Date(medianChatzot).toLocaleTimeString('es-AR', options), //por si las dudas
    seventhHour: `${startStr} - ${endStr}`,
  };
  return x.seventhHour;
}
export default calculateSeventhHourMedian;