import { Sunrise, Sun, Moon, Clock } from "lucide-react";
import { useSettings } from "../../SettingsContext";
import { useLanguage } from "@/shared/hooks/useLanguage.js";

const defaultPrayerIcons = {
  shajarit: Sunrise,
  minja: Sun,
  maariv: Moon,
};

function mapListToCards(list = [], icons = defaultPrayerIcons, t) {
  return (list || []).map(item => ({
    icon: icons[item.type] || Clock,
    title: t ? t(item.type.toUpperCase()) : item.type,
    hebrewTitle: item.hebrew || null,
    value: item.time,
  }));
}

export const useTimeCards = () => {
  const { minianimList, seiderList } = useSettings();
  const { t } = useLanguage();

  const minianimCards = mapListToCards(minianimList, defaultPrayerIcons, t);

  // For seider we may want different icons; reuse default unless overridden elsewhere
  const seiderIcons = { ...defaultPrayerIcons };
  const seiderCards = mapListToCards(seiderList, seiderIcons, t);

  return { minianimCards, seiderCards };
};
