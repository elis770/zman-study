import { useMemo } from 'react';
import useUserLocation from "../../time/hooks/useUserLocation.js";
import { GeoLocation, Zmanim } from '@hebcal/core';

export default function useHdate() {
  const { latitude, longitude, tzid, city, loading, error } = useUserLocation({ city: "Jerusalem" });
  const date = new Date();

  const zmanim = useMemo(() => {
    if (loading || error || !latitude || !longitude || !tzid) {
      return {};
    }

    const gloc = new GeoLocation(city, latitude, longitude, 0, tzid);
    const zmanimCalculator = new Zmanim(gloc, date, false);
    // Todos los métodos de Zmanim.prototype
    const methods = Object.getOwnPropertyNames(Zmanim.prototype)
      .filter(fn => {
        if (fn === 'constructor') return false;       // ignorar constructor
        if (fn.startsWith('get') || fn.startsWith('set')) return false; // ignorar helpers
        return typeof zmanimCalculator[fn] === 'function';
      });

    const result = {};
    //console.log(methods)
    methods.forEach(fn => {
      try {
        const dateObj = zmanimCalculator[fn]();
        if (dateObj instanceof Date) {
          result[fn] = dateObj.toLocaleTimeString('es-AR', {
            timeZone: tzid,
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          });
        }
      } catch (e) {
        console.warn(`No se pudo calcular ${fn}:`, e.message);
      }
    });

    return result;
  }, [latitude, longitude, tzid, city, loading, error, date]);

  return { ...zmanim, loading };
}