import { useState, useEffect } from "react";
import { HDate } from "@hebcal/core";
import '@hebcal/learning';

export default function useTime() {
  const fallbackTZ =
    Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

  const [timezone, setTimezone] = useState(fallbackTZ);
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [hebrewDate, setHebrewDate] = useState("");
  const [hdObj, setHdObj] = useState(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("https://worldtimeapi.org/api/ip");
        const data = await res.json();
        if (!cancelled && data?.timezone) {
          setTimezone(data.timezone);
        }
      } catch (err) {
        console.error("Error al obtener timezone:", err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hd = new HDate(now);

      // Guardamos el objeto HDate
      setHdObj(hd);

      // Hora y fecha normal
      setTime(
        now.toLocaleTimeString(undefined, {
          timeZone: timezone,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );

      setDate(
        now.toLocaleDateString(undefined, {
          timeZone: timezone,
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
      );

      // Fecha hebrea en string
      setHebrewDate(`${hd.getDate()} ${hd.getMonthName()} ${hd.getFullYear()}`);
    };

    updateTime();
    const id = setInterval(updateTime, 1000); // actualiza cada segundo

    return () => clearInterval(id);
  }, [timezone]);

  // Retornamos tanto el string como el objeto HDate
  return { time, date, timezone, hebrewDate, hdObj };
}