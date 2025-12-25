import { createContext, useContext, useEffect } from "react";
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
      { id: 'col2', cards: ["minian", "avisos", "seider", "weather"], width: 45 }
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
  const registerCard = (id, title, icon) => {
    setCardDefinitions(prev => ({
      ...prev,
      [id]: { title, icon }
    }));

    // Initialize as visible by default if not already set
    setVisibleCards(prev => ({
      ...prev,
      [id]: prev[id] !== undefined ? prev[id] : true
    }));
  };

  // Toggle card visibility
  const toggleCard = (id) => {
    setVisibleCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Migration/Initialization: Ensure weather card is in the layout if not present
  useEffect(() => {
    const isWeatherInLayout = carouselLayout.some(col => col.cards.includes('weather'));
    if (!isWeatherInLayout && carouselLayout.length > 0) {
      setCarouselLayout(prev => {
        const newLayout = [...prev];
        // Add to the second column by default if it exists, otherwise the first
        const targetColIndex = newLayout.length > 1 ? 1 : 0;
        newLayout[targetColIndex] = {
          ...newLayout[targetColIndex],
          cards: [...newLayout[targetColIndex].cards, 'weather']
        };
        return newLayout;
      });
    }
  }, []); // Only run on mount

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