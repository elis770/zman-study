import { createContext, useContext, useState } from "react";

const SettingsContext = createContext(undefined);

const defaultZmanim = {
  netz: true,
  shema: true,
  jatzot: true,
  shkia: true,
  tzet: true
};

const defaultEstudios = {
  jumash: true,
  tehilim: true,
  tanya: true,
  rambam1: true,
  rambam3: true,
  "sefer-mitzvot": true,
  "daf-yomi": true,
  "hayom-yom": true
};

const defaultSections = {
  zmanim: true,
  estudio: true,
  hayom: true,
  tefilot: true,
  seider: true
};

export function SettingsProvider({ children }) {
  const [visibleZmanim, setVisibleZmanim] = useState(defaultZmanim);
  const [visibleEstudios, setVisibleEstudios] = useState(defaultEstudios);
  const [visibleSections, setVisibleSections] = useState(defaultSections);
  const [city, setCity] = useState("Bogotá");
  const [timezone, setTimezone] = useState("America/Bogota");
  const [carouselInterval, setCarouselInterval] = useState(5);
  
  // Dynamic card configuration
  const [visibleCards, setVisibleCards] = useState({});
  const [cardDefinitions, setCardDefinitions] = useState({});

  const toggleZman = (id) => {
    setVisibleZmanim(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleEstudio = (id) => {
    setVisibleEstudios(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSection = (id) => {
    setVisibleSections(prev => ({ ...prev, [id]: !prev[id] }));
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
        toggleZman,
        toggleEstudio,
        toggleSection,
        registerCard,
        toggleCard,
        setCity,
        setTimezone,
        setCarouselInterval
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