import { useEffect, useState } from "react";
import cityTimezones from "city-timezones";
import tzlookup from "tz-lookup";

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

export default function useUserLocation(options = {}) {
  const fallbackLat = -34.6037;
  const fallbackLon = -58.3816;
  const fallbackTz = "America/Argentina/Buenos_Aires";

  const [latitude, setLatitude] = useState(fallbackLat);
  const [longitude, setLongitude] = useState(fallbackLon);
  const [tzid, setTzid] = useState(fallbackTz);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detectionMethod, setDetectionMethod] = useState('default');

  useEffect(() => {
    let mounted = true;

    const detectLocation = async () => {
      setLoading(true);
      setError(null);

      // 1️⃣ Prioridad: Coordenadas manuales
      if (
        typeof options.manualLat === "number" &&
        typeof options.manualLon === "number"
      ) {
        if (!mounted) return;
        setLatitude(options.manualLat);
        setLongitude(options.manualLon);
        const tz = options.manualTz
          ? options.manualTz
          : tzlookup(options.manualLat, options.manualLon);
        setTzid(tz);
        setCity("Ubicación manual");
        setCountry("");
        setDetectionMethod('manual');
        setLoading(false);
        return;
      }

      // 2️⃣ Ciudad pasada por usuario
      if (options.city) {
        try {
          const results = cityTimezones.lookupViaCity(options.city);
          if (results && results.length > 0) {
            const location = results[0]; // Tomamos el primer match
            if (mounted) {
              setLatitude(location.lat);
              setLongitude(location.lng);
              const tz = location.timezone || tzlookup(location.lat, location.lng);
              setTzid(tz);
              setCity(location.city);
              setCountry(location.country || "");
              setDetectionMethod('city');
              setLoading(false);
              return;
            }
          }
        } catch (e) {
          console.warn(`Error buscando ciudad "${options.city}":`, e);
          // Si falla, continuamos con el siguiente método
        }
      }

      // 3️⃣ Geolocalización del navegador (Promisified)
      try {
        const pos = await new Promise((resolve, reject) => {
          if (!navigator.geolocation) return reject(new Error("Geolocation no soportado"));
          navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 10000 });
        });
        if (mounted) {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          setLatitude(lat);
          setLongitude(lon);
          const tz = tzlookup(lat, lon);
          setTzid(tz);
          setCity("Ubicación detectada");
          setCountry("");
          setDetectionMethod('geolocation');
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn("Geolocation failed:", err.message);
        // Si falla, continuamos con el siguiente método
      }

      // 4️⃣ Detección por IP (worldtimeapi)
      try {
        const data = await fetchWithTimeout("https://worldtimeapi.org/api/ip");
        if (mounted && data) {
          const tz = data.timezone || data.tzid;
          setTzid(tz);
          // worldtimeapi no siempre trae lat/lon, pero sí el timezone
          setCity("Ubicación por IP");
          setDetectionMethod('ip');
          setCountry("");
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn("IP Geolocation failed:", err.message);
        // Si falla, continuamos al fallback
      }

      // 5️⃣ Fallback final
      if (mounted) {
        setLatitude(fallbackLat);
        setLongitude(fallbackLon);
        setTzid(fallbackTz);
        setCity("Buenos Aires");
        setCountry("AR");
        setDetectionMethod('fallback');
        setError("No se pudo obtener ubicación. Usando valores por defecto.");
        setLoading(false);
      }
    };

    detectLocation();

    return () => {
      mounted = false;
    };
  }, [options.manualLat, options.manualLon, options.manualTz, options.city]);

  return { latitude, longitude, tzid, city, country, loading, error, detectionMethod };
}