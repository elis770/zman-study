import { HebrewCalendar } from '@hebcal/core';
import specialDaysConfig from './specialDaysConfig.js';

export function getSpecialDays(hdate, date) {
  if (!hdate || !date) return [];

  // --- 1) Filtrar lista estática ---
  const staticDays = specialDaysConfig
    .filter(item => item.dayCondition.some(day => hdate.renderGematriya().includes(day)))
    .map(item => item.aviso);

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

  // --- 3) Combinar ambos arrays ---
  return [...staticDays, ...dynamicDays];
}
