import { useState, useEffect, useRef, useCallback } from "react";
import { Drawer, Box, Typography, IconButton, Divider, TextField, Button, Paper, List, ListItemButton, ListItemText, Slider } from "@mui/material";
import { X, MapPin, } from "lucide-react";

import GeneralSettings from "../modules/general-settings/ui/GeneralSettings.jsx";
import ZmanimSettings from "../modules/zmanim/ui/ZmanimSettings.jsx";
import StudySettings from "../modules/study/ui/StudySettings.jsx";
import AvisosSettings from "../modules/avisos/ui/AvisosSettings.jsx";
import MinianSettings from "../modules/minian/MinianSettings.jsx";
import { cityList } from "../shared/lib/cities.js";
import useUserLocation from "../modules/time/useUserLocation.js";

import { useTheme } from "../shared/hooks/useTheme.js";
import { useLanguage } from "../shared/hooks/useLanguage.js";
import { useSettings } from "./SettingsContext.jsx";
import { allZmanim } from "../modules/zmanim/context/zmanimConfig.js";
import { allStudies } from "../modules/study/hooks/studyConfig.js";

export const SettingsSheet = ({ isOpen, onClose }) => {
  const { theme, toggleTheme } = useTheme();
  const { t, language, toggleLanguage } = useLanguage();
  const {
    visibleZmanim, toggleZman, visibleEstudios, toggleEstudio,
    city: userCity, setCity: onUserCityChange, timeFormat, toggleTimeFormat,
    showMinian, toggleShowMinian, showHayomYom, toggleShowHayomYom,
    carouselInterval, setCarouselInterval, scrollSpeed, setScrollSpeed,
    setBulkZmanim, setBulkEstudios, minianimList, setMinianimList,
    customAvisos, setCustomAvisos
  } = useSettings();

  const handleSaveMinian = (minian) => {
    const newMinian = { ...minian, id: Date.now() };
    setMinianimList(prev => [...prev, newMinian].sort((a, b) => a.time.localeCompare(b.time)));
  };

  const handleDeleteMinian = (id) => {
    setMinianimList(prev => prev.filter(m => m.id !== id));
  };

  const autoSwitchDelay = carouselInterval * 1000;
  const onAutoSwitchDelayChange = (val) => setCarouselInterval(val / 1000);

  const visibleZmanimArray = Object.keys(visibleZmanim).filter(k => visibleZmanim[k]);
  const visibleStudiesArray = Object.keys(visibleEstudios).filter(k => visibleEstudios[k]);



  const onZmanimSelectionChange = (action) => {
    if (action === 'all') {
      const newSettings = {};
      allZmanim.forEach(z => newSettings[z.key] = true);
      setBulkZmanim(newSettings);
    } else {
      // Default/None -> Deselect all so card disappears? Or reset to defaultZmanim?
      // User said: "cuando desclikee zmanim y study quiero que no se muestre".
      // So deselect all makes sense to hide it.
      setBulkZmanim({});
    }
  };

  const onStudiesSelectionChange = (action) => {
    if (action === 'all') {
      const newSettings = {};
      allStudies.forEach(s => newSettings[s.key] = true);
      setBulkEstudios(newSettings);
    } else {
      setBulkEstudios({});
    }
  };

  const onAddAviso = (aviso) => setCustomAvisos(prev => [...prev, { ...aviso, id: Date.now() }]);
  const onDeleteAviso = (id) => setCustomAvisos(prev => prev.filter(a => a.id !== id));

  const { getUserLocation } = useUserLocation();

  const [expanded, setExpanded] = useState({
    general: true,
    zmanim: true,
    study: true,
    avisos: true,
    minian: true
  });

  const [cityInput, setCityInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const cityInputWrapperRef = useRef(null);

  const handleDetectByIp = useCallback(async () => {
    try {
      const location = await getUserLocation();
      if (location?.city) {
        onUserCityChange(location.city);
        setCityInput("");
        setShowSuggestions(false);
      } else {
        alert("No se pudo detectar la ubicación.");
      }
    } catch (error) {
      console.error(error);
      alert("Error al detectar la ubicación.");
    }
  }, [getUserLocation, onUserCityChange]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        cityInputWrapperRef.current &&
        !cityInputWrapperRef.current.contains(e.target)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCityChange = (e) => {
    const value = e.target.value;
    setCityInput(value);
    setSelectedSuggestionIndex(-1); // Reset selection on typing

    if (value.length > 1) {
      const filtered = cityList.filter((city) =>
        city.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) => (prev > -1 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      if (selectedSuggestionIndex >= 0) {
        e.preventDefault();
        handleSuggestionClick(suggestions[selectedSuggestionIndex]);
      }
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const cityName = suggestion.split(",")[0];
    onUserCityChange(cityName); // Guardar inmediatamente
    setCityInput(""); // Limpiar el input
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSaveCity = () => {
    // Si el input está vacío, no hacer nada
    if (!cityInput.trim()) {
      setShowSuggestions(false);
      return;
    }
    const cityName = cityInput.split(",")[0].trim();
    onUserCityChange(cityName);
    setCityInput(""); // Limpiar el input después de guardar
    setShowSuggestions(false);
  };

  const toggle = (key) =>
    setExpanded((s) => ({ ...s, [key]: !s[key] }));

  if (!isOpen) return null;

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "70%", sm: "70%", md: 420 },
          maxWidth: '100%',
          background: "linear-gradient(to bottom right, #f5efe3, #e8dcc3)",
          p: { xs: 2, sm: 3 },
          borderRadius: { xs: '16px 0 0 16px', md: 0 },
          boxShadow: '-10px 0 30px rgba(0,0,0,0.1)',
        }
      }}
    >
      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h5" sx={{ color: "#8b7355", fontWeight: 600 }}>
            {t("SETTINGS_TITLE") || "Configuración"}
          </Typography>
          <IconButton onClick={onClose}>
            <X color="#8b7355" />
          </IconButton>
        </Box>

        <Typography variant="body2" sx={{ color: 'rgba(139, 115, 85, 0.7)', mb: 4 }}>
          Personaliza qué elementos deseas ver en la aplicación
        </Typography>

        <Divider sx={{ my: 3 }} />

        {/* CIUDAD */}
        <Box>
          <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
            <MapPin color="#bca886" />
            <Typography sx={{ color: "#8b7355" }}>
              {t("CITY_LABEL") || "Ciudad"}
            </Typography>
          </Box>

          <Box ref={cityInputWrapperRef} sx={{ position: "relative" }}>
            <TextField fullWidth value={cityInput} onChange={handleCityChange} onKeyDown={handleKeyDown} onFocus={() => cityInput.length > 1 && setShowSuggestions(true)} placeholder={userCity || t("CITY_PLACEHOLDER") || "Ej: New York"} autoComplete="off" sx={{ mb: 2, "& .MuiOutlinedInput-root": { backgroundColor: "rgba(255,255,255,0.6)" } }} />

            {showSuggestions && suggestions.length > 0 && (
              <Paper sx={{ position: "absolute", width: "100%", zIndex: 10, maxHeight: 200, overflowY: "auto" }}>
                <List dense>
                  {suggestions.map((s, index) => (
                    <ListItemButton
                      key={s}
                      onClick={() => handleSuggestionClick(s)}
                      selected={index === selectedSuggestionIndex}
                      sx={{
                        "&.Mui-selected": {
                          backgroundColor: "#bca886",
                          color: "white",
                          "&:hover": { backgroundColor: "#a89474" }
                        }
                      }}
                    >
                      <ListItemText primary={s} />
                    </ListItemButton>
                  ))}
                </List>
              </Paper>
            )}
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Button fullWidth onClick={handleSaveCity} sx={{ backgroundColor: "#bca886", color: "white", "&:hover": { backgroundColor: "#a89474" } }}>
              {t("SAVE") || "Guardar"}
            </Button>

            <Button fullWidth variant="outlined" onClick={handleDetectByIp}>
              {t("DETECT_IP_BUTTON") || "Detectar por IP"}
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* GENERAL */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ color: "#8b7355", mb: 1, cursor: "pointer" }} onClick={() => toggle("general")}>
            {t("GENERAL_SETTINGS") || "Configuración General"}
          </Typography>

          {expanded.general && (
            <>
              <GeneralSettings
                t={t}
                theme={theme}
                toggleTheme={toggleTheme}
                language={language}
                toggleLanguage={toggleLanguage}
                showMinian={showMinian}
                toggleShowMinian={toggleShowMinian}
                showHayomYom={showHayomYom}
                toggleShowHayomYom={toggleShowHayomYom}
                autoSwitchDelay={autoSwitchDelay}
                onAutoSwitchDelayChange={onAutoSwitchDelayChange}
                timeFormat={timeFormat}
                toggleTimeFormat={toggleTimeFormat}
                scrollSpeed={scrollSpeed}
                setScrollSpeed={setScrollSpeed}
              />

            </>
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* ZMANIM */}
        <Typography variant="h6" sx={{ color: "#8b7355", cursor: "pointer" }} onClick={() => toggle("zmanim")}>
          {t("ZMANIM_TITLE")}
        </Typography>

        {expanded.zmanim && (
          <ZmanimSettings
            t={t}
            visibleZmanim={visibleZmanimArray}
            onZmanimChange={toggleZman}
            onSelectionChange={onZmanimSelectionChange}
          />
        )}

        <Divider sx={{ my: 3 }} />

        {/* STUDY */}
        <Typography variant="h6" sx={{ color: "#8b7355", cursor: "pointer" }} onClick={() => toggle("study")}>
          {t("STUDY_TITLE")}
        </Typography>

        {expanded.study && (
          <StudySettings
            t={t}
            visibleStudies={visibleStudiesArray}
            onStudiesChange={toggleEstudio}
            onSelectionChange={onStudiesSelectionChange}
          />
        )}

        <Divider sx={{ my: 3 }} />

        {/* AVISOS */}
        <Typography variant="h6" sx={{ color: "#8b7355", cursor: "pointer" }} onClick={() => toggle("avisos")}>
          {t("AVISOS_EVENTS_TITLE") || "Avisos y Eventos"}
        </Typography>

        {expanded.avisos && (
          <AvisosSettings
            customAvisos={customAvisos}
            onAddAviso={onAddAviso}
            onDeleteAviso={onDeleteAviso}
          />
        )}

        <Divider sx={{ my: 3 }} />

        {/* MINIAN */}
        <Typography variant="h6" sx={{ color: "#8b7355", cursor: "pointer" }} onClick={() => toggle("minian")}>
          {t("MINIAN_TITLE") || "Minyanim"}
        </Typography>

        {expanded.minian && (
          <MinianSettings
            minianimList={minianimList}
            onSaveMinian={handleSaveMinian}
            onDeleteMinian={handleDeleteMinian}
          />
        )}
      </Box>
    </Drawer>
  );
};

export default SettingsSheet;