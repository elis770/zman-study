import { useMemo } from "react";
import { HDate } from "@hebcal/core";

export default function useHebrewDate(gregorianDate, tzid = null, afterSunset = false) {
  const { hebrewDate, hebrewObj } = useMemo(() => {
    if (gregorianDate) {
      try {
        // Si tenemos tzid, obtener la fecha en esa zona horaria
        let dateToUse = gregorianDate;
        if (tzid) {
          // Convertir la fecha a la zona horaria especificada
          const dateString = gregorianDate.toLocaleString("en-US", { timeZone: tzid });
          dateToUse = new Date(dateString);
        }
        
        let hd = new HDate(dateToUse);
        
        // 1) Después de shkia Y 2) Antes de las 23:59:59 de la hora local de ESE lugar.
        // Si ya son las 00:00 AM en el lugar indicado, la fecha gregoriana ya cambió 
        // y HDate ya nos da el día correcto, por lo que NO debemos sumar +1.
        const localHours = dateToUse.getHours();
        // Usamos >= 12 para asegurarnos que estamos en el bloque de la tarde/noche (PM)
        // y < 24 (siempre cierto) para el límite de medianoche.
        if (afterSunset && localHours >= 12) {
          hd = hd.next(); 
        }
        return {
          hebrewDate: `${hd.getDate()} ${hd.getMonthName()} ${hd.getFullYear()}`,
          hebrewObj: hd,
        };
      } catch (error) {
        console.error("Error calculating Hebrew date:", error);
        return { hebrewDate: "", hebrewObj: null };
      }
    }
    return { hebrewDate: "", hebrewObj: null };
  }, [gregorianDate, tzid, afterSunset]);

  return { hebrewDate, hebrewObj };
}