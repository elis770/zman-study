import { useState, useEffect, useMemo } from 'react';
import { HDate, DailyLearning, Sedra } from '@hebcal/core';
import { getLeyningForParsha } from '@hebcal/leyning';
import tehillimElul from './tehilim-elul.js';

export default function useStudy() {
  const [todaySH, setTodaySH] = useState(null);
  const [todayJumesh, setTodayJumesh] = useState(null);
  const [todayTehilim, setTodayTehilim] = useState(null);

  const hd = useMemo(() => new HDate(new Date()), []);
  const sedra = useMemo(() => new Sedra(hd.getFullYear(), true), [hd]);
  const month = hd.getMonth(); // mes hebreo (1..13)
  const day = hd.getDate(); // día del mes hebreo
  const parsha = useMemo(() => sedra.get(hd), [sedra, hd]);

  useEffect(() => {
    if (!hd) return;

    // Sefer HaMitzvot del día
    const learning = DailyLearning.lookup('seferHaMitzvot', hd);
    setTodaySH(learning.render());

    // Jumash del día
    const jsDow = new Date().getDay(); // 0=Dom … 6=Sáb
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

    if (parsha?.length) {
      for (let p of parsha) {
        const leyning = getLeyningForParsha(p);
        if (leyning && key && leyning.fullkriyah[key]) {
          const lectura = leyning.fullkriyah[key];
          // ejemplo: "Bereshit 1:1-1:31"
          setTodayJumesh(`${lectura.k} ${lectura.b} - ${lectura.e}`);
          break;
        }
      }
    }

    // Tehilim del día
    const learning2 = DailyLearning.lookup('psalms', hd);
    let extra = null;
    if ((month === 6 && day >= 1) || (month === 7 && day <= 10)) {
      // buscar dentro del JSON usando el mes y el día
      if (tehillimElul[month] && tehillimElul[month][day]) {
        extra = tehillimElul[month][day];
      }
    }
    setTodayTehilim(
      learning2.render() + (extra ? ` + Tehilim Elul (Jabad): ${extra}` : '')
    );
  }, [hd, parsha, month, day]);

  return { todaySH, todayJumesh, todayTehilim };
}