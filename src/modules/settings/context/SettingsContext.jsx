import { createContext, useContext, useCallback } from "react";
import usePersistentState from "../../../shared/hooks/usePersistentState";

const SettingsContext = createContext(undefined);

const defaultZmanim = {
  sunrise: true,
  sofZmanShma: true,
  chatzot: true,
  sunset: true,
  tzeit: true
};

const defaultEstudios = {
  JUMASH: true,
  TEHILIM: true,
  TANYA: true,
  RAMBAM_1: true,
  RAMBAM_3: true,
  SEFER_HAMITZVOT: true,
  DAF_YOMI: true,
  HAYOM_YOM: true
};

const defaultSections = {
  zmanim: true,
  estudio: true,
  hayom: true,
  tefilot: true,
  seider: true
};

export function SettingsProvider({ children }) {
  const [visibleZmanim, setVisibleZmanim] = usePersistentState("visibleZmanim", defaultZmanim);
  const [visibleEstudios, setVisibleEstudios] = usePersistentState("visibleEstudios", defaultEstudios);
  const [visibleSections, setVisibleSections] = usePersistentState("visibleSections", defaultSections);
  const [city, setCity] = usePersistentState("userCity", null);
  const [timezone, setTimezone] = usePersistentState("timezone", null);
  const [carouselInterval, setCarouselInterval] = usePersistentState("carouselInterval", 5);
  // Layout configuration: Array of columns
  const [carouselLayout, setCarouselLayout] = usePersistentState(
    "carouselLayout",
    [
      { id: 'col1', cards: ["zmanim", "study"], width: 45 },
      { id: 'col2', cards: ["minian", "avisos", "seider"], width: 45 }
    ]
  );
  const [timeFormat, setTimeFormat] = usePersistentState("timeFormat", "24h");
  const [showMinian, setShowMinian] = usePersistentState("showMinian", true);
  const [showHayomYom, setShowHayomYom] = usePersistentState("showHayomYom", true);
  const [scrollSpeed, setScrollSpeed] = usePersistentState("scrollSpeed", 2.6);
  const [showDots, setShowDots] = usePersistentState("showDots", false);
  const [showArrows, setShowArrows] = usePersistentState("showArrows", false);

  // Dynamic card configuration
  const [visibleCards, setVisibleCards] = usePersistentState("visibleCards", {});
  const [minianimList, setMinianimList] = usePersistentState("minianimList", []);
  const [seiderList, setSeiderList] = usePersistentState("seiderList", []);
  const [customAvisos, setCustomAvisos] = usePersistentState("customAvisos", []);
  const [cardDefinitions, setCardDefinitions] = usePersistentState("cardDefinitions", {});

  const toggleZman = (id) => {
    setVisibleZmanim(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleEstudio = (id) => {
    setVisibleEstudios(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSection = (id) => {
    setVisibleSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleTimeFormat = () => {
    setTimeFormat(prev => prev === "24h" ? "12h" : "24h");
  };

  const toggleShowMinian = () => {
    setShowMinian(prev => !prev);
  };

  const toggleShowHayomYom = () => {
    setShowHayomYom(prev => !prev);
  };

  // Register a card from MainCardCarousel
  const registerCard = useCallback((id, title, icon) => {
    setCardDefinitions(prev => {
      // Avoid update if same
      if (prev[id] && prev[id].title === title && prev[id].icon === icon) return prev;
      return {
        ...prev,
        [id]: { title, icon }
      };
    });

    setVisibleCards(prev => {
      // Initialize as visible by default if not already set, otherwise return same ref
      if (prev[id] !== undefined) return prev;
      return {
        ...prev,
        [id]: true
      };
    });
  }, [setCardDefinitions, setVisibleCards]);

  // Toggle card visibility
  const toggleCard = (id) => {
    setVisibleCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <SettingsContext.Provider
      value={{
        visibleZmanim,
        visibleEstudios,
        visibleSections,
        visibleCards,
        cardDefinitions,
        city,
        timezone,
        carouselInterval,
        carouselLayout,
        setCarouselLayout,
        timeFormat,
        showMinian,
        showHayomYom,
        scrollSpeed,
        setScrollSpeed,
        toggleZman,
        toggleEstudio,
        setBulkZmanim: setVisibleZmanim, // Expose setter for bulk updates
        setBulkEstudios: setVisibleEstudios, // Expose setter for bulk updates
        toggleSection,
        toggleTimeFormat,
        toggleShowMinian,
        toggleShowHayomYom,
        registerCard,
        toggleCard,
        setCity,
        setTimezone,
        setCarouselInterval,
        minianimList,
        setMinianimList,
        seiderList,
        setSeiderList,
        customAvisos,
        setCustomAvisos,
        showDots,
        setShowDots,
        showArrows,
        setShowArrows
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}