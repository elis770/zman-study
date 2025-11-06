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

  console.log(`Calculando chatzot para ${city}, año ${year}...`);

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
    console.log('⚠️ Ajuste de hora por cambio de horario detectado (DST). Se restó 1 hora.');
  }

  const options = { timeZone: tzid, hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
  const startStr = seventhHourStart.toLocaleTimeString('es-AR', options);
  const endStr = seventhHourEnd.toLocaleTimeString('es-AR', options);

  console.log('Chatzot mediana del año:', new Date(medianChatzot).toLocaleTimeString('es-AR', options));
  console.log('Séptima hora halájica promedio (ajustada si corresponde):', `${startStr} - ${endStr}`);

  return {
    medianChatzot: new Date(medianChatzot).toLocaleTimeString('es-AR', options),
    seventhHour: `${startStr} - ${endStr}`,
  };
}

// Ejemplo de uso
(async () => {
  const lat = 40.7128;                 // Latitud de Nueva York
  const lon = -74.0060;                // Longitud de Nueva York
  const tzid = 'America/New_York';     // Zona horaria correcta
  const city = 'New York';             // Nombre de la ciudad

  const result = await calculateSeventhHourMedian(lat, lon, tzid, city);
  console.log('=====================================');
  console.log('Resultado final:');
  console.log('Chatzot mediana:', result.medianChatzot);
  console.log('Séptima hora halájica promedio:', result.seventhHour);
})();

//.map
// const cities = [
//   { city: 'New York',        lat: 40.7128,  lon: -74.0060,  tzid: 'America/New_York' },
//   { city: 'Los Angeles',     lat: 34.0522,  lon: -118.2437, tzid: 'America/Los_Angeles' },
//   { city: 'Chicago',         lat: 41.8781,  lon: -87.6298,  tzid: 'America/Chicago' },
//   { city: 'Miami',           lat: 25.7617,  lon: -80.1918,  tzid: 'America/New_York' },
//   { city: 'Denver',          lat: 39.7392,  lon: -104.9903, tzid: 'America/Denver' },
//   { city: 'San Francisco',   lat: 37.7749,  lon: -122.4194, tzid: 'America/Los_Angeles' },
//   { city: 'Seattle',         lat: 47.6062,  lon: -122.3321, tzid: 'America/Los_Angeles' },
//   { city: 'Boston',          lat: 42.3601,  lon: -71.0589,  tzid: 'America/New_York' },
//   { city: 'Houston',         lat: 29.7604,  lon: -95.3698,  tzid: 'America/Chicago' },
//   { city: 'Phoenix',         lat: 33.4484,  lon: -112.0740, tzid: 'America/Phoenix' } // No DST
// ];

// (async () => {
//   const results = await Promise.all(
//     cities.map(async ({ city, lat, lon, tzid }) => {
//       const result = await calculateSeventhHourMedian(lat, lon, tzid, city);
//       return { city, ...result };
//     })
//   );

//   console.log('=====================================');
//   console.log('Resultados finales por ciudad:');
//   results.forEach(({ city, medianChatzot, seventhHour }) => {
//     console.log(`\n${city}`);
//     console.log('Chatzot mediana:', medianChatzot);
//     console.log('Séptima hora halájica promedio:', seventhHour);
//   });
// })();