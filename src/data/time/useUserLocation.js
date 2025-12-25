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
  const [trigger, setTrigger] = useState(0);

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
          // Normalización básica para casos conocidos
          let searchCity = options.city.trim();          
          const results = cityTimezones.lookupViaCity(searchCity);
          if (results && results.length > 0) {
            const location = results[0]; // Tomamos el primer match
            if (mounted) {
              setLatitude(location.lat);
              setLongitude(location.lng);
              const tz = location.timezone || tzlookup(location.lat, location.lng);
              setTzid(tz);
              setCity(options.city); // Mantenemos el nombre original para mostrar
              setCountry(location.country || "");
              setDetectionMethod('city');
              setLoading(false);
              return;
            }
          } else {
            console.warn(`No se encontraron resultados para la ciudad "${options.city}"`);
          }
        } catch (e) {
          console.warn(`Error buscando ciudad "${options.city}":`, e);
        }
      }

      // 3️⃣ Detección por IP
      try {
        const data = await fetchWithTimeout("https://ipapi.co/json/");
        if (mounted && data && !data.error) {
          setLatitude(data.latitude);
          setLongitude(data.longitude);
          setTzid(data.timezone);
          setCity(data.city || "Ubicación por IP");
          setCountry(data.country_name || "");
          setDetectionMethod('ip');
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn("ipapi.co failed, trying api.ipify.org:", err.message);
        try {
          const ipData = await fetchWithTimeout("https://api.ipify.org?format=json");
          if (mounted && ipData.ip) {
            // Con la IP, podríamos intentar otro servicio, pero por ahora al menos sabemos que falló el geo-ip completo
            console.log("IP detectada via ipify:", ipData.ip);
          }
          
          const data = await fetchWithTimeout("https://worldtimeapi.org/api/ip");
          if (mounted && data) {
            setTzid(data.timezone || data.tzid);
            setCity("Ubicación por IP (TZ)");
            setDetectionMethod('ip');
            setLoading(false);
            return;
          }
        } catch (err2) {
          console.warn("All IP Geolocation failed:", err2.message);
        }
      }

      // 4️⃣ Detección por Navegador (opcional, solo si no hay IP y queremos fallback)
      // Nota: En el useEffect automático, es mejor evitar el prompt de geolocalización
      // para no molestar al usuario al entrar. 

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
  }, [options.manualLat, options.manualLon, options.manualTz, options.city, trigger]);

  // Función para forzar la detección de ubicación (usada por el botón)
  const getUserLocation = async () => {
    setLoading(true);
    setError(null);

    // 1️⃣ Intentar primero por IP (Silencioso y completo)
    try {
      const data = await fetchWithTimeout("https://ipapi.co/json/");
      if (data && !data.error) {
        setLoading(false);
        return {
          latitude: data.latitude,
          longitude: data.longitude,
          tzid: data.timezone,
          city: data.city || "Ubicación por IP",
          country: data.country_name || "",
        };
      }
    } catch (ipErr) {
      console.warn("IP Geolocation (ipapi) failed:", ipErr.message);
    }

    // 2️⃣ Si IP falla o queremos más precisión, intentar con geolocalización del navegador (Prompt)
    try {
      const pos = await new Promise((resolve, reject) => {
        if (!navigator.geolocation) return reject(new Error("Geolocation no soportado"));
        navigator.geolocation.getCurrentPosition(resolve, reject, { 
          enableHighAccuracy: true, 
          timeout: 10000 
        });
      });
      
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      const tz = tzlookup(lat, lon);
      const cityFromTz = tz.split('/').pop()?.replace(/_/g, ' ') || "Ubicación detectada";
      
      setLoading(false);
      return {
        latitude: lat,
        longitude: lon,
        tzid: tz,
        city: cityFromTz,
        country: "",
      };
    } catch (geoErr) {
      console.warn("Geolocation failed:", geoErr.message);
      setLoading(false);
      throw new Error("No se pudo detectar la ubicación");
    }
  };

  return { 
    latitude, 
    longitude, 
    tzid, 
    city, 
    country, 
    loading, 
    error, 
    detectionMethod,
    getUserLocation 
  };
}