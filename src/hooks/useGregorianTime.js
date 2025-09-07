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

export default function useGregorianTime(options = {}) {
  const fallbackTZ =
    options.defaultTz ||
    Intl.DateTimeFormat().resolvedOptions().timeZone ||
    "America/Argentina/Buenos_Aires";

  const fallbackLat = options.defaultLat ?? -34.6037;
  const fallbackLon = options.defaultLon ?? -58.3816;

  const [tzid, setTzid] = useState(fallbackTZ);
  const [latitude, setLatitude] = useState(fallbackLat);
  const [longitude, setLongitude] = useState(fallbackLon);
  const [city, setCity] = useState(undefined);
  const [country, setCountry] = useState(undefined);

  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    if (options.disableNetwork) {
      setLoading(false);
      return;
    }

    (async () => {
      setLoading(true);
      setError(null);

      try {
        const cachedLocation = sessionStorage.getItem('zman-user-location');
        if (cachedLocation) {
          const data = JSON.parse(cachedLocation);
          if (mounted) {
            setTzid(data.tzid);
            setLatitude(data.latitude);
            setLongitude(data.longitude);
            setCity(data.city);
            setCountry(data.country);
            setLoading(false);
          }
          return;
        }
      } catch (e) { /* ignore */ }

      try {
        const data = await fetchWithTimeout("https://worldtimeapi.org/api/ip");
        if (!mounted) return;
        if (data?.timezone) setTzid(data.timezone);
        setLoading(false);
        return;
      } catch {}

      // Fallback
      if (mounted) {
        setTzid(fallbackTZ);
        setLatitude(fallbackLat);
        setLongitude(fallbackLon);
        setError("No se pudo obtener ubicación por IP. Usando valores por defecto.");
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [options.disableNetwork]);

  useEffect(() => {
    const tick = () => {
      const localDate = new Date();
      setDate(localDate);
      setTime(
        localDate.toLocaleTimeString("es-AR", {
          timeZone: tzid,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [tzid]);

  const formattedDate = useMemo(
    () =>
      date.toLocaleDateString("en-CA", {
        timeZone: tzid,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
    [date, tzid]
  );

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