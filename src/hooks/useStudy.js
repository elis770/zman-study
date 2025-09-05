import { useState, useEffect } from "react";
import { DailyLearning } from "@hebcal/core";
import "@hebcal/learning";
import useTime from "./useTime";

export default function useStudy() {
  const { hdObj } = useTime(); // obtenemos el HDate de useTime
  const [todayStudy, setTodayStudy] = useState(null);

  useEffect(() => {
    if (hdObj) {
      const learning = DailyLearning.lookup("seferHaMitzvot", hdObj);
      setTodayStudy(learning);
    }
  }, [hdObj]);

  return { todayStudy };
}