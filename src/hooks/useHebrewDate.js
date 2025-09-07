import { useState, useEffect } from "react";
import { HDate } from "@hebcal/core";

export default function useHebrewDate(gregorianDate) {
  const [hebrewDate, setHebrewDate] = useState("");
  const [hebrewObj, setHebrewObj] = useState(null);

  useEffect(() => {
    if (gregorianDate) {
      const hd = new HDate(gregorianDate);
      setHebrewDate(`${hd.getDate()} ${hd.getMonthName()} ${hd.getFullYear()}`);
      setHebrewObj(hd);
    }
  }, [gregorianDate]);

  return { hebrewDate, hebrewObj };
}