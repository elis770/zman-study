// useStudy.js
import { useState, useEffect } from "react";
import { Sedra, HDate } from "@hebcal/core";
import { getLeyningForParsha } from "@hebcal/leyning";

import useDailyLearning from "./useDailyLearning.js";

import {
  transformRambamText,
  transformSeferHaMitzvotText,
  transformJumashText,
  transformTehilimText,
} from "./studyTransformers.js";

export default function useStudy({
  date,
  loading: gregorianLoading,
  hebrewObj: hd,
  lang = "he",
}) {
  const [rambam1, setRambam1] = useState(null);
  const [rambam3, setRambam3] = useState(null);
  const [todaySH, setTodaySH] = useState(null);
  const [todayJumash, setTodayJumash] = useState(null);
  const [todayTehilim, setTodayTehilim] = useState(null);
  const [loading, setLoading] = useState(true);

  const dailyLearning = useDailyLearning(hd);

  useEffect(() => {
    if (!hd || !date) return;

    setLoading(true);

    const hd2 = hd instanceof HDate ? hd : new HDate(hd);

    // PARASHA → JUMASH
    const sedra = new Sedra(hd2.getFullYear(), true);
    const parshaEvent = sedra.get(hd2);
    const parshaNames = parshaEvent?.parsha || [];
    const rawJumash = parshaNames.map((p) => getLeyningForParsha(p)).find((l) => l);

    // TRANSFORMACIÓN RAMBAM
    const { rambam1: r1Text, rambam3: r3Text } = transformRambamText(
      {
        rambam1: dailyLearning.rambam1,
        rambam3: dailyLearning.rambam3,
      },
      lang
    );

    setRambam1(r1Text);
    setRambam3(r3Text);

    // SEFER HAMITZVOT
    setTodaySH(transformSeferHaMitzvotText(dailyLearning.seferHaMitzvot));

    // JUMASH
    setTodayJumash(transformJumashText(rawJumash, date, lang));

    // TEHILIM
    setTodayTehilim(transformTehilimText(dailyLearning.tehilim, hd2, lang));

    setLoading(false);
  }, [hd, date, lang, dailyLearning]);

  return {
    // lo de siempre
    rambam1,
    rambam3,
    todaySH,
    todayJumash,
    todayTehilim,

    // ✅ nuevos learnings crudos
    dafYomi: dailyLearning.dafYomi,
    yerushalmiYomi: dailyLearning.yerushalmiYomi,
    mishnaYomi: dailyLearning.mishnaYomi,
    nachYomi: dailyLearning.nachYomi,
    tehillimYomi: dailyLearning.tehillimYomi,

    loading: loading || gregorianLoading,
  };
}