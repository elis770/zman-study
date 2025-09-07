import { useState, useEffect } from 'react';
import { GeoLocation, Zmanim } from '@hebcal/core';
import useGregorianTime from './useGregorianTime';

export default function useHdate() {
  const { latitude, longitude, tzid, date, loading: gregorianLoading } = useGregorianTime();
  const [zmanim, setZmanim] = useState({});

  useEffect(() => {
    if (gregorianLoading || !latitude || !longitude || !tzid || !date) {
      return;
    }

    const gloc = new GeoLocation(null, latitude, longitude, 0, tzid);
    const zmanimCalculator = new Zmanim(gloc, date, false);

    const zmanimToCalc = [
      { name: 'sunrise', fn: () => zmanimCalculator.sunrise() },
      { name: 'sofZmanShma', fn: () => zmanimCalculator.sofZmanShma() },
      { name: 'shkiah', fn: () => zmanimCalculator.sunset() },
      { name: 'tzet', fn: () => zmanimCalculator.tzeit() },
      { name: 'candleLighting', fn: () => (date.getDay() === 5 ? zmanimCalculator.sunsetOffset(gloc.getCandleLightingOffset()) : null) },
      { name: 'chatzot', fn: () => zmanimCalculator.chatzot() },
    ];

    const calculatedZmanim = zmanimToCalc.reduce((acc, z) => {
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

    setZmanim(calculatedZmanim);
  }, [latitude, longitude, tzid, date, gregorianLoading]);

  return { ...zmanim, loading: gregorianLoading };
}