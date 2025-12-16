import { Clock, Sunrise, Sun, Sunset, Moon, Scroll, BookOpen, Music, Gavel, Calendar, Scale } from "lucide-react";
import { useSettings } from "../../SettingsContext";
import { useAppData } from "@/shared/hooks/useAppData.js";
import { useLanguage } from "@/shared/hooks/useLanguage.js";

export const useListCards = () => {
  const { visibleZmanim, visibleEstudios } = useSettings();
  const { zmanim, study } = useAppData();
  const { t } = useLanguage();

  // Configurations for Zmanim
  const zmanimConfig = {
    alotHaShachar: { titleKey: 'ALOT_HASHACHAR', icon: Sunrise },
    misheyakir: { titleKey: 'MISHEYAKIR', icon: Sun },
    sunrise: { titleKey: 'NETZ_HAJAMA', icon: Sunrise },
    sofZmanShma: { titleKey: 'SOF_SHEMA', icon: Clock },
    sofZmanShmaMGA: { titleKey: 'SOF_SHEMA_MGA', icon: Clock },
    sofZmanShmaGra: { titleKey: 'SOF_SHEMA', icon: Clock },
    sofZmanTfilla: { titleKey: 'SOF_TFILA', icon: Clock },
    chatzot: { titleKey: 'CHATZOT', icon: Sun },
    minchaGedola: { titleKey: 'MINCHA_GEDOLA', icon: Sun },
    minchaKetana: { titleKey: 'MINCHA_KETANA', icon: Sun },
    plagHaMincha: { titleKey: 'PLAG_HAMINCHA', icon: Sunset },
    sunset: { titleKey: 'SHKIA', icon: Sunset },
    tzeit: { titleKey: 'TZEIT', icon: Moon },
  };

  const zmanimCards = Object.entries(zmanim || {})
    .filter(([key]) => key !== 'loading' && key !== 'seventhHour' && zmanimConfig[key])
    .map(([key, value]) => {
      if (!visibleZmanim?.[key]) return null;

      const config = zmanimConfig[key];
      if (!config) return null;

      let minutes = 0;
      try {
        const [timePart, modifier] = value.split(' ');
        let [hours, mins] = timePart.split(':').map(Number);
        
        if (modifier) {
           if (modifier.toLowerCase() === 'pm' && hours < 12) hours += 12;
           if (modifier.toLowerCase() === 'am' && hours === 12) hours = 0;
        }
        minutes = hours * 60 + mins;
      } catch (e) {
        minutes = 0;
      }

      return {
        key: key,
        icon: config.icon,
        title: t ? t(config.titleKey) : config.titleKey,
        hebrewTitle: null, 
        value: value,
        minutes: minutes
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.minutes - b.minutes);

  // Configuration for Study
  const studyIcons = {
    JUMASH: Scroll,
    TANYA: BookOpen,
    TEHILIM: Music,
    RAMBAM_1: Gavel,
    RAMBAM_3: Gavel,
    DAF_YOMI: Calendar,
    YERUSHALMI_YOMI: Calendar,
    MISHNA_YOMI: Scale,
    NACH_YOMI: BookOpen,
    TANACH_YOMI: BookOpen,
    SEFER_HAMITZVOT: Scale
  };

  const studyCards = (study?.studyCards || [])
    .filter(item => visibleEstudios?.[item.key])
    .map(item => {
      const Icon = studyIcons[item.key] || BookOpen;
      return {
        icon: Icon,
        title: t ? t(item.labelKey) : item.key,
        hebrewTitle: null,
        value: item.value,
      };
    });

  return { zmanimCards, studyCards };
};
