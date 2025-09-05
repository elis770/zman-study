import { useState, useEffect } from "react";
import {HDate, DailyLearning} from '@hebcal/core';
import "@hebcal/learning";
//import useTime from "./useTime";

export default function useStudy() {
  //const { date } = useTime(); // obtenemos el HDate de useTime
  const dt = new Date();
  const hd = new HDate(dt);
  const [todayStudy, setTodayStudy] = useState(null);

  useEffect(() => {
    if (hd) {
      const learning = DailyLearning.lookup("seferHaMitzvot", hd);
      setTodayStudy(learning.render());
    }
  }, []);

  return { todayStudy };
}