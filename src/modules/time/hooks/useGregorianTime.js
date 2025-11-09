import { useEffect, useMemo, useState } from "react";
import useUserLocation from "./useUserLocation.js";

// --- Utilidades de validación ---
const isValidTimeZone = (tz) => {
  if (typeof tz !== "string" || !tz) return false;
  try {
    // Si no es válido, esto tira.
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
};

export default function useGregorianTime(options = {}) {
  // 1. Obtener datos de ubicación del hook especializado.
  const { latitude, longitude, tzid, city, country, loading, error, detectionMethod } = useUserLocation({ city: options.city });

  // 2. Gestionar el estado del tiempo basado en la ubicación obtenida.
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState("");

  // 3. Efecto para actualizar la hora cada segundo.
  useEffect(() => {
    const tick = () => {
      const localDate = new Date();
      setDate(localDate);
      // Intentar con tz; si falla, sin tz (usa local)
      try {
        setTime(
          localDate.toLocaleTimeString("es-AR", {
            timeZone: tzid,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: options.timeFormat === '12h',
          })
        );
      } catch {
        setTime(
          localDate.toLocaleTimeString("es-AR", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: options.timeFormat === '12h',
          })
        );
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [tzid]);

  // 4. Memoizar la fecha formateada para evitar recálculos innecesarios.
  const formattedDate = useMemo(() => {
    // Igual que arriba: usar tz si es válida; si no, sin tz
    try {
      return date.toLocaleDateString('es-ES', {
        timeZone: tzid,
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
  }, [date, tzid]);

  return {
    tzid,
    latitude,
    longitude,
    time,
    date,
    formattedDate,
    city,
    country,
    loading,
    detectionMethod,
    error,
  };
}