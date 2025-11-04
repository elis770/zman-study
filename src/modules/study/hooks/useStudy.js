import { useState, useEffect } from 'react';
import { DailyLearning, Sedra, HDate } from '@hebcal/core';
import { getLeyningForParsha } from '@hebcal/leyning';
import '@hebcal/learning';
import {
  transformRambamText,
  transformSeferHaMitzvotText,
  transformJumashText,
  transformTehilimText
} from './studyTransformers.js';

export default function useStudy({
  date,
  loading: gregorianLoading,
  hebrewObj: hd,
  lang = 'he',
}) {
  const [rambam1, setRambam1] = useState(null);
  const [rambam3, setRambam3] = useState(null);
  const [todaySH, setTodaySH] = useState(null);
  const [todayJumash, setTodayJumash] = useState(null);
  const [todayTehilim, setTodayTehilim] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hd || !date) return;

    setLoading(true);

    const hd2 = hd instanceof HDate ? hd : new HDate(hd);

    // 1️⃣ Datos base
    const rawRambam = {
      rambam1: DailyLearning.lookup('rambam1', hd2),
      rambam3: DailyLearning.lookup('rambam3', hd2),
    };
    const rawSeferHaMitzvot = DailyLearning.lookup('seferHaMitzvot', hd2);
    const rawTehilimDaily = DailyLearning.lookup('tehilim', hd2);

    // 2️⃣ Obtener la parashá actual o próxima
    const sedra = new Sedra(hd2.getFullYear(), true);
    let parshaEvent = sedra.get(hd2);

    let rawJumash = null;
   if (!/chol\s+ha-?moed/i.test(parshaEvent)) {
      // Obtenemos el leyning de la primera parashá válida
      for (const p of parshaEvent) {
        rawJumash = getLeyningForParsha(p);
        if (rawJumash) break;
      }
    }
    //TODO: manejar caso de jom tov con parashá (por ahora imprima que es shabat jol hamoed)
    rawJumash = getLeyningForParsha(parshaEvent);

    // 3️⃣ Transformaciones
    const { rambam1: r1Text, rambam3: r3Text } = transformRambamText(rawRambam, lang);
    setRambam1(r1Text);
    setRambam3(r3Text);
    setTodaySH(transformSeferHaMitzvotText(rawSeferHaMitzvot));
    setTodayJumash(transformJumashText(rawJumash, date, lang));
    setTodayTehilim(transformTehilimText(rawTehilimDaily, hd2, lang));
    setLoading(false);
  }, [hd, date, lang]);

  return {
    rambam1,
    rambam3,
    todaySH,
    todayJumash,
    todayTehilim,
    loading: loading || gregorianLoading,
  };
}