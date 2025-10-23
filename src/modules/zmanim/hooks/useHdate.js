import { useMemo } from 'react';
import { GeoLocation, Zmanim } from '@hebcal/core';

export default function useHdate(gregorianData) {
  const { latitude, longitude, tzid, date, loading: gregorianLoading } = gregorianData;

  const zmanim = useMemo(() => {
    if (gregorianLoading || !latitude || !longitude || !tzid || !date) {
      return {};
    }

    const gloc = new GeoLocation(null, latitude, longitude, 0, tzid);
    const zmanimCalculator = new Zmanim(gloc, date, false);

    const zmanimToCalc = [
      { name: 'alotHaShachar', fn: () => zmanimCalculator.alotHaShachar() },
      { name: 'misheyakir', fn: () => zmanimCalculator.misheyakir() },
      { name: 'misheyakirMachmir', fn: () => zmanimCalculator.misheyakirMachmir() },
      { name: 'dawn', fn: () => zmanimCalculator.dawn() },
      { name: 'sunrise', fn: () => zmanimCalculator.sunrise() },
      { name: 'sofZmanShma', fn: () => zmanimCalculator.sofZmanShma() },
      { name: 'sofZmanTfilla', fn: () => zmanimCalculator.sofZmanTfilla() },
      { name: 'chatzot', fn: () => zmanimCalculator.chatzot() },
      { name: 'minchaGedola', fn: () => zmanimCalculator.minchaGedola() },
      { name: 'minchaKetana', fn: () => zmanimCalculator.minchaKetana() },
      { name: 'plagHaMincha', fn: () => zmanimCalculator.plagHaMincha() },
      { name: 'shkiah', fn: () => zmanimCalculator.sunset() }, // 'sunset' es el alias de 'shkiah'
      { name: 'beinHaShmashos', fn: () => zmanimCalculator.beinHaShmashos() },
      { name: 'tzeit', fn: () => zmanimCalculator.tzeit() }, // Tzeit por defecto (8.5 grados)
      { name: 'tzeit42min', fn: () => zmanimCalculator.sunsetOffset(42) },
      { name: 'tzeit72min', fn: () => zmanimCalculator.sunsetOffset(72) },
      { name: 'chatzotNight', fn: () => zmanimCalculator.chatzotNight() },
    ];

    return zmanimToCalc.reduce((acc, z) => {
      try {
        const dateObj = z.fn();
        if (dateObj) {
          acc[z.name] = dateObj.toLocaleTimeString('es-AR', {
            timeZone: tzid,
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          });
        }
      } catch (e) {
        // Some zmanim might not be available for all locations/dates
        console.warn(`Could not calculate zman '${z.name}':`, e);
      }
      return acc;
    }, {});
  }, [latitude, longitude, tzid, date, gregorianLoading]);

  return { ...zmanim, loading: gregorianLoading };
}