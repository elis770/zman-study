import { useEffect, useMemo, useState } from "react";

// Helper con timeout
const fetchWithTimeout = async (url, ms = 5000) => {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
    return res.json();
  } finally {
    clearTimeout(t);
  }
};

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
  const detectedTZ =
    Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

  const fallbackTZ =
    (typeof options.defaultTz === "string" && isValidTimeZone(options.defaultTz)
      ? options.defaultTz
      : undefined) ||
    (isValidTimeZone(detectedTZ) ? detectedTZ : "America/Argentina/Buenos_Aires");

  const fallbackLat =
    typeof options.defaultLat === "number" ? options.defaultLat : -34.6037;
  const fallbackLon =
    typeof options.defaultLon === "number" ? options.defaultLon : -58.3816;

  const [tzid, setTzid] = useState(fallbackTZ);
  const [latitude, setLatitude] = useState(fallbackLat);
  const [longitude, setLongitude] = useState(fallbackLon);
  const [city, setCity] = useState(undefined);
  const [country, setCountry] = useState(undefined);

  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Normaliza/asegura que tzid sea válido antes de setearlo
  const applyTzSafe = (maybeTz) => {
    const next = isValidTimeZone(maybeTz) ? maybeTz : fallbackTZ;
    setTzid(next);
    return next;
  };

  useEffect(() => {
    let mounted = true;
    if (options.disableNetwork) {
      setLoading(false);
      return;
    }

    (async () => {
      setLoading(true);
      setError(null);

      // 1) Intentar cache
      try {
        const cachedLocation = sessionStorage.getItem("zman-user-location");
        if (cachedLocation) {
          const data = JSON.parse(cachedLocation);
          if (mounted && data) {
            applyTzSafe(
              typeof data.tzid === "string" ? data.tzid : data.timezone
            );
            if (typeof data.latitude === "number") setLatitude(data.latitude);
            if (typeof data.longitude === "number") setLongitude(data.longitude);
            if (typeof data.city === "string") setCity(data.city);
            if (typeof data.country === "string") setCountry(data.country);
            setLoading(false);
            return;
          }
        }
      } catch {
        // ignorar cache corrupto
      }

      // 2) worldtimeapi
      try {
        const data = await fetchWithTimeout("https://worldtimeapi.org/api/ip");
        if (!mounted) return;
        if (data) {
          const tz = data.timezone || data.tzid;
          applyTzSafe(tz);
          // worldtimeapi no siempre trae lat/lon; si tenés otro endpoint, podés completar acá.
          setLoading(false);
          return;
        }
      } catch {
        // sigue al fallback
      }

      // 3) Fallback
      if (mounted) {
        applyTzSafe(fallbackTZ);
        setLatitude(fallbackLat);
        setLongitude(fallbackLon);
        setError(
          "No se pudo obtener ubicación por IP. Usando valores por defecto."
        );
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [options.disableNetwork]); // eslint-disable-line react-hooks/exhaustive-deps

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
            hour12: false,
          })
        );
      } catch {
        setTime(
          localDate.toLocaleTimeString("es-AR", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          })
        );
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [tzid]);

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
    error,
  };
}