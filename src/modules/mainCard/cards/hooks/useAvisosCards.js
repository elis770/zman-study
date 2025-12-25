import { useMemo } from 'react';
import { Flame, Moon, Scroll, Volume2, Star, Megaphone, Calendar, BookOpen, Bell, Heart } from "lucide-react";
import { useAppData } from '../../../../data/useAppData.js';
import { useSettings } from "../../../settings/context/SettingsContext";
import useSpecialDay from '../../../../data/avisos/useSpecialDay';

export const useAvisosCards = () => {
  const { customAvisos } = useSettings();
  const { time, jadashot, zmanim } = useAppData();
  const specialDay = useSpecialDay();

  const { date } = time || {};
  
  // Si ya pasó la puesta del sol, el día "lógico" para los avisos es el de mañana.
  const effectiveDate = useMemo(() => {
    if (!date) return null;
    if (zmanim?.isAfterSunset) {
      const tomorrow = new Date(date);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow;
    }
    return date;
  }, [date, zmanim?.isAfterSunset]);

  const dayOfWeek = effectiveDate ? effectiveDate.getDay() : -1;
  const { jadashotCards, candleLighting, tzet_hashabat: tzet } = jadashot || {};

  const categoryIcons = {
    evento: Calendar,
    donacion: Heart,
    clase: BookOpen,
    recordatorio: Bell,
    otro: Megaphone,
    shabbat: Flame,
    reading: Scroll,
    special: Star
  };

  const avisosCards = useMemo(() => {
    let allAvisos = [];

    // Shabbat Candle Lighting (Friday)
    if (dayOfWeek === 5 && candleLighting) {
      allAvisos.push({
        icon: categoryIcons.shabbat,
        title: 'Encendido de Velas',
        value: (() => {
          const [h, m] = candleLighting.split(':').map(Number);
          const isJerusalem = time?.tzid?.toLowerCase().includes('jerusalem');
          const displayDate = new Date();
          displayDate.setHours(h, m - (isJerusalem ? 30 : 18));
          return displayDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        })()
      });
    }

    // Shabbat End (Saturday)
    if (dayOfWeek === 6 && tzet) {
      allAvisos.push({
        icon: Moon,
        title: 'Fin de Shabat',
        value: tzet
      });
    }

    // Weekly Readings
    const weeklyReadingsConfig = [
      { key: 'PARASHA', title: 'Parashá', icon: categoryIcons.reading },
      { key: 'HAFTARA', title: 'Haftará', icon: Volume2 },
    ];

    if (jadashotCards) {
      weeklyReadingsConfig.forEach(reading => {
        const card = jadashotCards.find(c => c.key === reading.key);
        if (card?.value) {
          allAvisos.push({
            icon: reading.icon,
            title: reading.title,
            value: card.value
          });
        }
      });
    }

    // Special Days
    if (specialDay && specialDay.length > 0) {
      specialDay.forEach(day => {
        allAvisos.push({
          icon: categoryIcons.special,
          title: day.title,
          value: day.content
        });
      });
    }

    // Custom Avisos
    if (customAvisos && customAvisos.length > 0) {
      customAvisos.forEach(aviso => {
        allAvisos.push({
          icon: categoryIcons[aviso.category] || Megaphone,
          title: aviso.title,
          value: aviso.content
        });
      });
    }

    return allAvisos;
  }, [jadashotCards, specialDay, customAvisos, dayOfWeek, candleLighting, tzet]);

  return { avisosCards };
};