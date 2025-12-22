// useHdate.js
import { useMemo, useState, useEffect } from 'react';
import useUserLocation from "../time/useUserLocation.js";
import calculateSeventhHourMedian from "./use7th.js";
import { GeoLocation, Zmanim } from '@hebcal/core';

export default function useHdate({ date: dateProp, userCity, timeFormat, latitude: latProp, longitude: lonProp, tzid: tzidProp }) {
  // Si nos pasan coordenadas (desde DataProvider -> useGregorianTime), las usamos "manual" para evitar doble fetch
  const { latitude, longitude, tzid, city, loading, error } = useUserLocation({ 
    city: userCity || "Jerusalem",
    manualLat: latProp,
    manualLon: lonProp,
    manualTz: tzidProp
  });
  
  // Usar la fecha propizada o fallback a la actual si no viene
  const date = dateProp || new Date();

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
    const now = date; // Usar la fecha sincronizada del prop
    
    // 1. Calcular la puesta del sol de HOY (referencia para la transición)
    const todayZmanim = new Zmanim(gloc, now, false);
    const shkiahToday = todayZmanim.shkiah() || todayZmanim.sunset();
    
    const isAfterSunset = shkiahToday && now > shkiahToday;
    
    // 2. Si ya pasó la puesta del sol, calculamos los zmanim para el día siguiente
    const calculationDate = isAfterSunset 
      ? new Date(now.getTime() + 24 * 60 * 60 * 1000) 
      : now;

    const zmanimCalculator = new Zmanim(gloc, calculationDate, false);

    const methods = Object.getOwnPropertyNames(Zmanim.prototype)
      .filter(fn => {
        if (fn === 'constructor') return false;
        if (fn.startsWith('get') || fn.startsWith('set')) return false;
        return typeof zmanimCalculator[fn] === 'function';
      });

    const result = {
      isAfterSunset,
      shkiahTodayRaw: shkiahToday,
    };
    methods.forEach(fn => {
      try {
        const dateObj = zmanimCalculator[fn]();
        if (dateObj instanceof Date) {
          const formattedTime = dateObj.toLocaleTimeString('es-AR', {
            timeZone: tzid,
            hour: '2-digit',
            minute: '2-digit',
            hour12: timeFormat === '12h',
          });
          result[fn] = formattedTime;

          // Capture raw date for comparison and add user's requested key
          if (fn === 'shkiah' || fn === 'sunset') {
            result.puesta_del_sol = formattedTime;
            result.puesta_del_sol_raw = dateObj;
          }
        }
      } catch (e) {
        console.warn(`No se pudo calcular ${fn}:`, e.message);
      }
    });

    return result;
  }, [latitude, longitude, tzid, city, loading, error, date, timeFormat]);

  return { ...zmanim, seventhHour, loading };
}