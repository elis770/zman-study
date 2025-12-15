import { useState, useEffect, useRef, useCallback } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  TextField,
  Button,
  Paper,
  List,
  ListItemButton,
  ListItemText
} from "@mui/material";
import {
  X,
  MapPin,
  Settings
} from "lucide-react";

import GeneralSettings from "../modules/general-settings/ui/GeneralSettings.jsx";
import ZmanimSettings from "../modules/zmanim/ui/ZmanimSettings.jsx";
import StudySettings from "../modules/study/ui/StudySettings.jsx";
import AvisosSettings from "../modules/avisos/ui/AvisosSettings.jsx";
import { cityList } from "../shared/lib/cities.js";
import useUserLocation from "../modules/time/hooks/useUserLocation.js";

import { useTheme } from "../shared/hooks/useTheme.js";
import { useLanguage } from "../shared/hooks/useLanguage.js";
import { useSettings } from "./SettingsContext.jsx";

export const SettingsSheet = ({
  isOpen,
  onClose,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { t, language, toggleLanguage } = useLanguage();
  const { 
    visibleZmanim, toggleZman, 
    visibleEstudios, toggleEstudio, 
    city: userCity, setCity: onUserCityChange,
    timeFormat, toggleTimeFormat,
    showMinian, toggleShowMinian,
    showHayomYom, toggleShowHayomYom,
    carouselInterval, setCarouselInterval
  } = useSettings();

  // Convert interval from seconds to milliseconds for internal use
  const autoSwitchDelay = carouselInterval * 1000;
  const onAutoSwitchDelayChange = (val) => setCarouselInterval(val / 1000);

  // Helper to convert object to array for child components
  const visibleZmanimArray = Object.keys(visibleZmanim).filter(k => visibleZmanim[k]);
  const visibleStudiesArray = Object.keys(visibleEstudios).filter(k => visibleEstudios[k]);

  // Handlers for bulk selection (mock implementation as context doesn't support bulk yet)
  const onZmanimSelectionChange = (action) => {
    // Implementation would go here, currently no-op or manual toggle loop
    console.log("Bulk change requested:", action);
  };
  const onStudiesSelectionChange = (action) => {
    console.log("Bulk change requested:", action);
  };
  
  // Dummy handlers for Avisos as they seem fully managed by props in original
  const [customAvisos, setCustomAvisos] = useState([]);
  const onAddAviso = (aviso) => setCustomAvisos(prev => [...prev, { ...aviso, id: Date.now() }]);
  const onDeleteAviso = (id) => setCustomAvisos(prev => prev.filter(a => a.id !== id));

  const { getUserLocation } = useUserLocation();

  const [expanded, setExpanded] = useState({
    general: true,
    zmanim: true,
    study: true,
    avisos: true
  });

  const [cityInput, setCityInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const cityInputWrapperRef = useRef(null);

  // ===============================
  // IP
  // ===============================
  const handleDetectByIp = useCallback(async () => {
    try {
      const location = await getUserLocation();
      if (location?.city) {
        onUserCityChange(location.city);
        setCityInput(""); // Limpiar el input, la ciudad se mostrará en el placeholder
        setShowSuggestions(false);
      } else {
        alert("No se pudo detectar la ubicación.");
      }
    } catch (error) {
      console.error(error);
      alert("Error al detectar la ubicación.");
    }
  }, [getUserLocation, onUserCityChange]);

  // ===============================
  // ESC
  // ===============================
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  // ===============================
  // CLICK FUERA
  // ===============================
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

  // ===============================
  // AUTOCOMPLETE (MISMO CÓDIGO)
  // ===============================
  const handleCityChange = (e) => {
    const value = e.target.value;
    setCityInput(value);

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

  // ===============================
  // RENDER
  // ===============================
  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 420 },
          background: "linear-gradient(to bottom right, #f5efe3, #e8dcc3)",
          p: 3
        }
      }}
    >
      <Box>
        {/* HEADER */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h5" sx={{ color: "#8b7355", fontWeight: 600 }}>
            {t("SETTINGS_TITLE") || "Configuración"}
          </Typography>
          <IconButton onClick={onClose}>
            <X color="#8b7355" />
          </IconButton>
        </Box>

        {/* GENERAL */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            sx={{ color: "#8b7355", mb: 1, cursor: "pointer" }}
            onClick={() => toggle("general")}
          >
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
              />

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
                  <TextField
                    fullWidth
                    value={cityInput}
                    onChange={handleCityChange}
                    onFocus={() =>
                      cityInput.length > 1 && setShowSuggestions(true)
                    }
                    placeholder={userCity || t("CITY_PLACEHOLDER") || "Ej: New York"}
                    autoComplete="off"
                    sx={{
                      mb: 2,
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "rgba(255,255,255,0.6)"
                      }
                    }}
                  />

                  {showSuggestions && suggestions.length > 0 && (
                    <Paper
                      sx={{
                        position: "absolute",
                        width: "100%",
                        zIndex: 10,
                        maxHeight: 200,
                        overflowY: "auto"
                      }}
                    >
                      <List dense>
                        {suggestions.map((s) => (
                          <ListItemButton
                            key={s}
                            onClick={() => handleSuggestionClick(s)}
                          >
                            <ListItemText primary={s} />
                          </ListItemButton>
                        ))}
                      </List>
                    </Paper>
                  )}
                </Box>

                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    fullWidth
                    onClick={handleSaveCity}
                    sx={{
                      backgroundColor: "#bca886",
                      color: "white",
                      "&:hover": { backgroundColor: "#a89474" }
                    }}
                  >
                    {t("SAVE") || "Guardar"}
                  </Button>

                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={handleDetectByIp}
                  >
                    {t("DETECT_BY_IP") || "Detectar por IP"}
                  </Button>
                </Box>
              </Box>
            </>
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* ZMANIM */}
        <Typography
          variant="h6"
          sx={{ color: "#8b7355", cursor: "pointer" }}
          onClick={() => toggle("zmanim")}
        >
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
        <Typography
          variant="h6"
          sx={{ color: "#8b7355", cursor: "pointer" }}
          onClick={() => toggle("study")}
        >
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
        <Typography
          variant="h6"
          sx={{ color: "#8b7355", cursor: "pointer" }}
          onClick={() => toggle("avisos")}
        >
          {t("AVISOS_EVENTS_TITLE") || "Avisos y Eventos"}
        </Typography>

        {expanded.avisos && (
          <AvisosSettings
            customAvisos={customAvisos}
            onAddAviso={onAddAviso}
            onDeleteAviso={onDeleteAviso}
          />
        )}
      </Box>
    </Drawer>
  );
};

export default SettingsSheet;