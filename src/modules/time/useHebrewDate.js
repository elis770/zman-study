import { useMemo } from "react";
import { HDate } from "@hebcal/core";

export default function useHebrewDate(gregorianDate, tzid = null) {
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
        
        const hd = new HDate(dateToUse);
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
  }, [gregorianDate, tzid]);

  return { hebrewDate, hebrewObj };
}