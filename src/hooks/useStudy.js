import { useState, useEffect } from 'react';
import { tehilimByelul, tehilimMonthly } from './tehilim.js';

export default function useStudy({ date, loading: gregorianLoading, hebrewObj: hd }) {
  const [todaySH, setTodaySH] = useState(null);
  const [todayJumesh, setTodayJumesh] = useState(null);
  const [todayTehilim, setTodayTehilim] = useState(null);

  useEffect(() => {
    if (!hd || !date) return;
    let cancelled = false;

    const calculateStudies = async () => {
      // Carga diferida para que vivan en un chunk aparte
      const { DailyLearning, Sedra } = await import('@hebcal/core');
      const { getLeyningForParsha } = await import('@hebcal/leyning');
      await import('@hebcal/learning'); // side-effect: registra schedules

      if (cancelled) return;

    const month = hd.getMonth(); // mes hebreo (1..13)
    const day = hd.getDate(); // día del mes hebreo

    // Sefer HaMitzvot del día
    const learning = DailyLearning.lookup('seferHaMitzvot', hd);
    setTodaySH(learning || null);

      const sedra = new Sedra(hd.getFullYear(), true);
      const parsha = sedra.get(hd);

    // Jumash del día
    const jsDow = date.getDay(); // 0=Dom … 6=Sáb
    const fullKriyahMap = {
      0: '1', // domingo
      1: '2', // lunes
      2: '3', // martes
      3: '4', // miércoles
      4: '5', // jueves
      5: '6', // viernes
      6: '7', // shabat
    };
    const key = fullKriyahMap[jsDow];

    let jumashSet = false;
    if (parsha?.length) {
      for (let p of parsha) {
        const leyning = getLeyningForParsha(p);
        if (leyning && key && leyning.fullkriyah[key]) {
          const lectura = leyning.fullkriyah[key];
          // ejemplo: "Bereshit 1:1-1:31"
          setTodayJumesh(`${lectura.k} ${lectura.b} - ${lectura.e}`);
          jumashSet = true;
          break;
        }
      }
    }
    if (!jumashSet) {
      setTodayJumesh(null);
    }

    // Tehilim del día
    const learning2 = DailyLearning.lookup('psalms', hd);
    let dailyTehilim = learning2 ? learning2.render() : null;

    // Si hebcal no devuelve el Tehilim del día (ej. en Shabat), usamos el ciclo mensual.
    if (!dailyTehilim && tehilimMonthly[day]) {
      dailyTehilim = `${tehilimMonthly[day]}`;
    }

    let extra = null;
    if ((month === 6 && day >= 1) || (month === 7 && day <= 10)) {
      // buscar dentro del JSON usando el mes y el día
      if (tehilimByelul[month] && tehilimByelul[month][day]) {
        extra = `${tehilimByelul[month][day]}`;
      }
    }

    const combinedTehilim = [dailyTehilim, extra].filter(Boolean).join(' | ');
    setTodayTehilim(combinedTehilim);
    };

    calculateStudies();

    return () => {
      cancelled = true;
    };
  }, [hd, date]);

  return { todaySH, todayJumesh, todayTehilim, loading: gregorianLoading };
}