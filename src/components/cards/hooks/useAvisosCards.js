import { useMemo } from 'react';
import { Flame, Moon, Scroll, Volume2, Star, Megaphone, Calendar, BookOpen, Bell, Heart } from "lucide-react";
import { useAppData } from '@/shared/hooks/useAppData.js';
import { useSettings } from "../../SettingsContext";
import useSpecialDay from '../../../modules/avisos/context/useSpecialDay';

export const useAvisosCards = () => {
  const { customAvisos } = useSettings();
  const { time, jadashot } = useAppData();
  const specialDay = useSpecialDay();

  const { date } = time || {};
  const dayOfWeek = date ? new Date(date).getDay() : -1;
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
        value: candleLighting
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