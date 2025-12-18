import { Sunrise, Sun, Moon, Clock } from "lucide-react";
import { useSettings } from "../../SettingsContext";
import { useLanguage } from "@/shared/hooks/useLanguage.js";

export const useMinianCards = () => {
  const { minianimList } = useSettings();
  const { t } = useLanguage();

  const prayerIcons = {
    shajarit: Sunrise,
    minja: Sun,
    maariv: Moon,
  };

  const minianimCards = (minianimList || []).map(minian => ({
    icon: prayerIcons[minian.type] || Clock,
    title: t ? t(minian.type.toUpperCase()) : minian.type,
    hebrewTitle: null,
    value: minian.time,
  }));

  return { minianimCards };
};