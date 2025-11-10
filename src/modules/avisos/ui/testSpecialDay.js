
import { HDate, HebrewCalendar } from '@hebcal/core';
import specialDaysConfig from './specialDaysConfig.js';

/**
 * Obtiene los días especiales para una fecha dada, combinando una lista estática
 * y eventos dinámicos de Hebcal.
 * @param {Date} date - La fecha gregoriana para la cual obtener los días especiales.
 */
function getSpecialDaysForDate(date) {
  if (!date) {
    console.log("Fecha no proporcionada.");
    return [];
  }

  const hdate = new HDate(date);
  console.log(`Fecha Gregoriana: ${date.toDateString()}`);
  console.log(`Fecha Hebrea: ${hdate.renderGematriya()}`);
  console.log('---');

  // --- 1) Filtrar lista estática de specialDaysConfig.js ---
  const staticDays = specialDaysConfig
    .filter(item => item.dayCondition.some(day => hdate.renderGematriya().includes(day)))
    .map(item => item.aviso);

  if (staticDays.length > 0) {
    console.log('Avisos encontrados en specialDaysConfig.js:');
    console.log(staticDays);
    console.log('---');
  }

  // --- 2) Generar eventos especiales desde Hebcal ---
  const year = date.getFullYear();
  const hebcalEvents = HebrewCalendar.calendar({ year, isHebrewYear: false });

  const dynamicDays = hebcalEvents
    .filter(ev => ev.getDate().isSameDate(hdate))
    .map(ev => ({
      id: `hebcal-${ev.getDesc()}`,
      title: ev.render(),
      content: ev.memo || ev.render(),
      icon: '✨',
    }));

  if (dynamicDays.length > 0) {
    console.log('Avisos encontrados en Hebcal:');
    console.log(dynamicDays);
    console.log('---');
  }

  // --- 3) Combinar y devolver ambos arrays ---
  const allAvisos = [...staticDays, ...dynamicDays];

  if (allAvisos.length === 0) {
    console.log('No se encontraron avisos especiales para esta fecha.');
  }

  return allAvisos;
}

// --- EJECUCIÓN DE PRUEBA ---
// Puedes cambiar la fecha aquí para probar diferentes días.
// Formato: YYYY-MM-DD
const manualDate = new Date('2025-11-09'); // Corresponde a 18 Cheshvan 5786

console.log('========================================');
console.log('INICIANDO PRUEBA DEL SCRIPT DE DÍAS ESPECIALES');
console.log('========================================');

const specialDays = getSpecialDaysForDate(manualDate);

console.log('\n========================================');
console.log('RESULTADO FINAL COMBINADO:');
console.log(specialDays);
console.log('========================================');
