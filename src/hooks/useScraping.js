import { useState, useEffect } from "react";
import useTime from "./useTime.js";

const ordersMap = {
  1: "parasha",
  2: "haftara",
  3: "daf_yomi",
  6: "Rambam1",
  7: "Rambam3",
  15: "Tanya",
};

const useSefaria = () => {
  const { timezone } = useTime();
  const [studies, setStudies] = useState({});
  const [loading, setLoading] = useState(true);
  const [dateUsed, setDateUsed] = useState("");

  useEffect(() => {
    if (!timezone) return;

    const fetchSefariaData = async () => {
      setLoading(true);
      try {
        const formatter = new Intl.DateTimeFormat("en-CA", {
          timeZone: timezone,
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
        const formattedDate = formatter.format(new Date());
        setDateUsed(formattedDate);

        const response = await fetch(
          `https://www.sefaria.org/api/calendars?date=${formattedDate}`
        );
        const data = await response.json();

        const result = {};
        data.calendar_items.forEach((item) => {
          const key = ordersMap[item.order];
          if (key) {
            result[key] =
              item.order === 15 ? { en: item.ref } : item.displayValue;
          }
        });

        setStudies(result);
      } catch (err) {
        console.error("Error en fetchSefariaData:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSefariaData();
  }, [timezone]);

  return { ...studies, loading, timezone, dateUsed };
};

export default useSefaria;