import { useState, useEffect } from "react";

const ordersMap = {
  1: "parasha",
  2: "haftara",
  3: "daf_yomi",
  6: "Rambam1",
  7: "Rambam3",
  15: "Tanya",
};

const useSefaria = (gregorianData) => {
  // Añadimos userCity como dependencia para forzar la actualización
  const { tzid, date, loading: gregorianLoading } = gregorianData || {};
  const [studies, setStudies] = useState({});
  const [loading, setLoading] = useState(true);
  const [dateUsed, setDateUsed] = useState("");

  const dayIdentifier = date ? date.toLocaleDateString() : null;

  useEffect(() => {
    if (!tzid || !date) return;

    const fetchSefariaData = async () => {
      setLoading(true);
      try {
        // Formatear la fecha aquí, ya que no viene pre-formateada para Sefaria
        const formattedDate = date.toLocaleDateString('en-CA', {
          timeZone: tzid,
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        });

        setDateUsed(formattedDate); // YYYY-MM-DD

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
  }, [tzid, dayIdentifier]);

  return {
    ...studies,
    loading: loading || gregorianLoading,
    timezone: tzid,
    dateUsed,
  };
};

export default useSefaria;