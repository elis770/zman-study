import { useMemo } from "react";
import { HDate } from "@hebcal/core";

export default function useHebrewDate(gregorianDate) {
  const { hebrewDate, hebrewObj } = useMemo(() => {
    if (gregorianDate) {
      const hd = new HDate(gregorianDate);
      return {
        hebrewDate: `${hd.getDate()} ${hd.getMonthName()} ${hd.getFullYear()}`,
        hebrewObj: hd,
      };
    }
    return { hebrewDate: "", hebrewObj: null };
  }, [gregorianDate]);

  return { hebrewDate, hebrewObj };
}