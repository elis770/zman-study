import { useState, useEffect, useMemo } from 'react';
import { DailyLearning, Sedra } from '@hebcal/core';
import { getLeyningForParsha } from '@hebcal/leyning';
import { tehilimByelul, tehilimMonthly } from './tehilim.js';
import useGregorianTime from './useGregorianTime.js';
import useHebrewDate from './useHebrewDate.js';

export default function useStudy() {
  const { date, loading: gregorianLoading } = useGregorianTime();
  const { hebrewObj: hd } = useHebrewDate(date);

  const [todaySH, setTodaySH] = useState(null);
  const [todayJumesh, setTodayJumesh] = useState(null);
  const [todayTehilim, setTodayTehilim] = useState(null);

  const sedra = useMemo(() => (hd ? new Sedra(hd.getFullYear(), true) : null), [hd]);
  const parsha = useMemo(() => (hd && sedra ? sedra.get(hd) : null), [sedra, hd]);

  useEffect(() => {
    if (!hd || !date) return;

    const month = hd.getMonth(); // mes hebreo (1..13)
    const day = hd.getDate(); // día del mes hebreo

    // Sefer HaMitzvot del día
    const learning = DailyLearning.lookup('seferHaMitzvot', hd);
    setTodaySH(learning ? learning.render() : null);

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
  }, [hd, parsha, date]);

  return { todaySH, todayJumesh, todayTehilim, loading: gregorianLoading };
}