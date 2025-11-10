import { useAppData } from '@/shared/hooks/useAppData.js';
import { HebrewCalendar } from '@hebcal/core';
import specialDaysConfig from './specialDaysConfig.js';

export default function useSpecialDay() {
  const { time } = useAppData();
  const { date, hebrewDate } = time;

  if (!hebrewDate || !date) return [];

  // --- 1) Filtrar lista estática ---
  const staticDays = specialDaysConfig
    .filter(item => item.dayCondition.some(day => hebrewDate.includes(day)))
    .map(item => item.aviso);

  // --- 2) Generar eventos especiales desde Hebcal ---
  const year = date.getFullYear();

  // HebrewCalendar.calendar genera todos los eventos del año
  const hebcalEvents = HebrewCalendar.calendar({ year, isHebrewYear: false });

  const dynamicDays = hebcalEvents
    .filter(ev => ev.hdate?.includes(hebrewDate)) // filtra por fecha hebrea
    .map(ev => ({
      id: `hebcal-${ev.key || ev.title}`,
      title: ev.title,
      content: ev.desc || ev.title,
      icon: '✨', // se puede personalizar según tipo de evento
    }));

  // --- 3) Combinar ambos arrays ---
  return [...staticDays, ...dynamicDays];
}