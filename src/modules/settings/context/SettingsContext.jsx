import { createContext, useContext } from "react";
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
  // layout for the two main carousels: arrays of card ids (order matters)
  const [carouselLayout, setCarouselLayout] = usePersistentState(
    "carouselLayout",
    { left: ["zmanim", "study"], right: ["minian", "avisos", "seider"] }
  );
  const [timeFormat, setTimeFormat] = usePersistentState("timeFormat", "24h");
  const [showMinian, setShowMinian] = usePersistentState("showMinian", true);
  const [showHayomYom, setShowHayomYom] = usePersistentState("showHayomYom", true);
  const [scrollSpeed, setScrollSpeed] = usePersistentState("scrollSpeed", 2.6);

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
        setCustomAvisos
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