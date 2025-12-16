// useHdate.js
import { useMemo, useState, useEffect } from 'react';
import useUserLocation from "../../time/hooks/useUserLocation.js";
import calculateSeventhHourMedian from "./use7th.js";
import { GeoLocation, Zmanim } from '@hebcal/core';

export default function useHdate({ userCity, timeFormat, latitude: latProp, longitude: lonProp, tzid: tzidProp }) {
  // Si nos pasan coordenadas (desde DataProvider -> useGregorianTime), las usamos "manual" para evitar doble fetch
  const { latitude, longitude, tzid, city, loading, error } = useUserLocation({ 
    city: userCity || "Jerusalem",
    manualLat: latProp,
    manualLon: lonProp,
    manualTz: tzidProp
  });
  const date = new Date();

  const [seventhHour, setSeventhHour] = useState(null);

  // Calculamos la séptima hora async
  useEffect(() => {
    if (loading || error || !latitude || !longitude || !tzid) return;

    const fetchSeventhHour = async () => {
      try {
        const result = await calculateSeventhHourMedian(latitude, longitude, tzid, city);
        setSeventhHour(result);
      } catch (e) {
        console.error("Error calculando séptima hora:", e);
      }
    };

    fetchSeventhHour();
  }, [latitude, longitude, tzid, city, loading, error]);

  const zmanim = useMemo(() => {
    if (loading || error || !latitude || !longitude || !tzid) {
      return {};
    }

    const gloc = new GeoLocation(city, latitude, longitude, 0, tzid);
    const zmanimCalculator = new Zmanim(gloc, date, false);

    const methods = Object.getOwnPropertyNames(Zmanim.prototype)
      .filter(fn => {
        if (fn === 'constructor') return false;
        if (fn.startsWith('get') || fn.startsWith('set')) return false;
        return typeof zmanimCalculator[fn] === 'function';
      });

    const result = {};
    methods.forEach(fn => {
      try {
        const dateObj = zmanimCalculator[fn]();
        if (dateObj instanceof Date) {
          result[fn] = dateObj.toLocaleTimeString('es-AR', {
            timeZone: tzid,
            hour: '2-digit',
            minute: '2-digit',
            hour12: timeFormat === '12h',
          });
        }
      } catch (e) {
        console.warn(`No se pudo calcular ${fn}:`, e.message);
      }
    });

    return result;
  }, [latitude, longitude, tzid, city, loading, error, date, timeFormat]);

  return { ...zmanim, seventhHour, loading };
}