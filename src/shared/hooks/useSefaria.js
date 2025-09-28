import { useState, useEffect } from "react";
import useGregorianTime from "./useGregorianTime.js";

const ordersMap = {
  1: "parasha",
  2: "haftara",
  3: "daf_yomi",
  6: "Rambam1",
  7: "Rambam3",
  15: "Tanya",
};

const useSefaria = () => {
  const { tzid, formattedDate, loading: gregorianLoading } = useGregorianTime();
  const [studies, setStudies] = useState({});
  const [loading, setLoading] = useState(true);
  const [dateUsed, setDateUsed] = useState("");

  useEffect(() => {
    if (!tzid || !formattedDate) return;

    const fetchSefariaData = async () => {
      setLoading(true);
      try {
        // The formattedDate from useGregorianTime is already in 'en-CA' format (YYYY-MM-DD)
        setDateUsed(formattedDate);

        const response = await fetch(
          `https://www.sefaria.org/api/calendars?date=${formattedDate}`
        );
        const data = await response.json();

        const newStudies = data.calendar_items.reduce((acc, item) => {
          const key = ordersMap[item.order];
          if (key) {
            acc[key] =
              item.order === 15 ? { en: item.ref } : item.displayValue;
          }
          return acc;
        }, {});

        setStudies(newStudies);
      } catch (err) {
        console.error("Error en fetchSefariaData:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSefariaData();
  }, [tzid, formattedDate]);

  return {
    ...studies,
    loading: loading || gregorianLoading,
    timezone: tzid,
    dateUsed,
  };
};

export default useSefaria;