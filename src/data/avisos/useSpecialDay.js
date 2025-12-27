import { useAppData } from '@/data/useAppData.js';
import { HDate, HebrewCalendar } from '@hebcal/core';
import specialDaysConfig from './specialDaysConfig.js';

export default function useSpecialDay() {
  const { time } = useAppData();
  const { date } = time;
  // Si la fecha no está disponible, no devolver nada.
  if (!date) {
    return [];
  }

  // Crear un objeto HDate para la fecha actual. Es más robusto que usar strings.
  const hdate = new HDate(date);

  // --- 1) Filtrar lista estática usando la fecha hebrea renderizada ---
  const staticDays = specialDaysConfig
    .filter(item => item.dayCondition.some(day => hdate.renderGematriya().includes(day)))
    .map(item => item.aviso);

  // --- 2) Generar eventos especiales desde Hebcal ---
  const year = date.getFullYear();
  const hebcalEvents = HebrewCalendar.calendar({ year, isHebrewYear: false });

  // Filtrar eventos de Hebcal comparando objetos de fecha, que es el método correcto.
  const dynamicDays = hebcalEvents
    .filter(ev => ev.getDate().isSameDate(hdate))
    .map(ev => ({
      id: `hebcal-${ev.getDesc()}`,
      title: ev.render(),
      content: ev.memo || ev.render(),
      icon: '✨',
    }));

  // --- 3) Combinar y devolver ambos arrays ---
  return [...staticDays, ...dynamicDays];
}