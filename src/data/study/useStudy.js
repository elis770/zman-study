import { useState, useEffect } from 'react';
import { DailyLearning, Sedra, HDate } from '@hebcal/core';
import { getLeyningForParsha } from '@hebcal/leyning';
import '@hebcal/learning';
import {
  SimpleYomiTransformer,
  JumashTransformer,
  DafYomiTransformer,
  RambamTransformer,
  SeferHaMitzvotTransformer,
  TehilimTransformer,
} from './studyTransformers.js';

export default function useStudy({
  date,
  loading: gregorianLoading,
  hebrewObj: hd,
  lang = 'he',
}) {
  const [rambam1, setRambam1] = useState(null);
  const [rambam3, setRambam3] = useState(null);
  const [SH, setSH] = useState(null);
  const [Jumash, setJumash] = useState(null);
  const [Tehilim, setTehilim] = useState(null);
  const [DafYomi, setDafYomi] = useState(null);
  const [Yerushalmi, setYerushalmi] = useState(null);
  const [MishnaYomi, setMishnaYomi] = useState(null);
  const [NachYomi, setNachYomi] = useState(null);
  const [TanakhYomi, setTanakhYomi] = useState(null);
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
    const x = DailyLearning.lookup('',hd2);
    const rawSeferHaMitzvot = DailyLearning.lookup('seferHaMitzvot', hd2);
    const rawTehilim = DailyLearning.lookup('tehilim', hd2);
    const rawDafYomi = DailyLearning.lookup('dafYomi', hd2);
    const rawYerushalmi = DailyLearning.lookup('yerushalmi-vilna', hd2);
    //const rawYerushalmi2 = DailyLearning.lookup('yerushalmi-schottenstein', hd2);
    const rawMishnaYomi = DailyLearning.lookup('mishnaYomi', hd2);
    const rawNachYomi = DailyLearning.lookup('nachYomi', hd2);
    const rawTanakhYomi = DailyLearning.lookup('tanakhYomi', hd2);

    // 2️⃣ Obtener la parashá actual o próxima
    const sedra = new Sedra(hd2.getFullYear(), true);
    let parshaEvent = sedra.get(hd2);

    let rawJumash = null;
    if (!/chol\s+ha-?moed/i.test(parshaEvent)) {
      for (const p of parshaEvent) {
        rawJumash = getLeyningForParsha(p);
        if (rawJumash) break;
      }
    }
    rawJumash = getLeyningForParsha(parshaEvent);

    // 3️⃣ Transformaciones usando clases
    const rambam = new RambamTransformer(rawRambam, lang).transform();
    setRambam1(rambam.rambam1);
    setRambam3(rambam.rambam3);

    setSH(new SeferHaMitzvotTransformer(rawSeferHaMitzvot, lang).transform());
    setJumash(new JumashTransformer(rawJumash, date, lang).transform());
    setTehilim(new TehilimTransformer(hd2, lang).transform());
    setDafYomi(new DafYomiTransformer(rawDafYomi, lang).transform());
    setYerushalmi(new DafYomiTransformer(rawYerushalmi, lang).transform());
    setMishnaYomi(new SimpleYomiTransformer(rawMishnaYomi, lang).transform());
    setNachYomi(new SimpleYomiTransformer(rawNachYomi, lang).transform());
    setTanakhYomi(new SimpleYomiTransformer(rawTanakhYomi, lang).transform());

    setLoading(false);
  }, [hd, date, lang]);

  return {
    rambam1,
    rambam3,
    SH,
    Jumash,
    Tehilim,
    DafYomi,
    Yerushalmi,
    MishnaYomi,
    NachYomi,
    TanakhYomi,
    loading: loading || gregorianLoading,
  };
}