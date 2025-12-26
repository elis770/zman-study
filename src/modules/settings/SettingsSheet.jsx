import { useState, useEffect } from "react";
import { Drawer, Box, Typography, Divider, ThemeProvider } from "@mui/material";

import GeneralSettings1 from "./general-settings/GeneralSettings1.jsx";
import ZmanimSettings from "./zmanim/ZmanimSettings.jsx";
import StudySettings from "./study/StudySettings.jsx";
import AvisosSettings from "./avisos/AvisosSettings.jsx";
import TimeListSettings from "./timeList/TimeListSettings.jsx";
import LayoutSettings from "./layout/LayoutSettings.jsx";
import { CitySettings } from "./city/CitySettings.jsx";
import { SettingsHeader } from "./SettingsHeader.jsx";
import { SettingsSection } from "./SettingsSection.jsx";

import { useTheme } from "@mui/material";
import { useLanguage } from "../../shared/traslantions/useLanguage.js";
import { useSettings } from "./context/SettingsContext.jsx";
import { allZmanim } from "../../context/zmanim/zmanimConfig.js";
import { allStudies } from "./study/context/studyConfig.js";

export const SettingsSheet = ({ isOpen, onClose }) => {
  const theme = useTheme();
  const { t, language, toggleLanguage } = useLanguage();
  const {
    visibleZmanim, toggleZman, visibleEstudios, toggleEstudio,
    city: userCity, setCity: onUserCityChange, timeFormat, toggleTimeFormat,
    showMinian, toggleShowMinian, showHayomYom, toggleShowHayomYom,
    carouselInterval, setCarouselInterval, scrollSpeed, setScrollSpeed,
    carouselLayout, setCarouselLayout,
    setBulkZmanim, setBulkEstudios, minianimList, setMinianimList,
    seiderList, setSeiderList,
    customAvisos, setCustomAvisos
  } = useSettings();

  const handleSaveMinian = (minian) => {
    const newMinian = { ...minian, id: Date.now() };
    setMinianimList(prev => [...prev, newMinian].sort((a, b) => a.time.localeCompare(b.time)));
  };

  const handleDeleteMinian = (id) => {
    setMinianimList(prev => prev.filter(m => m.id !== id));
  };

  const handleSaveSeider = (item) => {
    const newItem = { ...item, id: Date.now() };
    setSeiderList(prev => [...prev, newItem].sort((a, b) => a.time.localeCompare(b.time)));
  };

  const handleDeleteSeider = (id) => {
    setSeiderList(prev => prev.filter(s => s.id !== id));
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

  const [expanded, setExpanded] = useState({
    general: true,
    zmanim: true,
    study: true,
    avisos: true,
    minian: true,
    seider: true,
    layout: true
  });

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

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
          width: { xs: "85%", sm: "70%", md: 420 },
          maxWidth: '100%',
          background: theme.palette.background.default,
          backgroundImage: theme.custom?.colors?.background?.gradient
            ? `linear-gradient(to bottom right, ${theme.custom.colors.background.gradient[0]}, ${theme.custom.colors.background.gradient[1]})`
            : 'none',
          p: { xs: 2, sm: 3 },
          borderRadius: { xs: '16px 0 0 16px', md: 0 },
          boxShadow: '-10px 0 30px rgba(0,0,0,0.2)',
        }
      }}
    >
      <ThemeProvider theme={theme}>
        <Box>
          <SettingsHeader title={t("SETTINGS_TITLE") || "Configuración"} onClose={onClose} />

          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
            Personaliza qué elementos deseas ver en la aplicación
          </Typography>

          <Divider sx={{ my: 3 }} />

          {/* CIUDAD */}
          <CitySettings t={t} userCity={userCity} onUserCityChange={onUserCityChange} />

          <Divider sx={{ my: 3 }} />

          {/* GENERAL */}
          <SettingsSection title={t("GENERAL_SETTINGS") || "Configuración General"} expanded={expanded.general} onToggle={() => toggle("general")}>
            <GeneralSettings1
              t={t}
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
          </SettingsSection>
          
          {/* LAYOUT */}
          <SettingsSection title={t("DISTRIBUTION_TITLE") || "Distribución de Pantalla"} expanded={expanded.layout} onToggle={() => toggle("layout")} showDivider={false}>
            <LayoutSettings
              layout={carouselLayout}
              setLayout={setCarouselLayout}
              t={t}
            />
          </SettingsSection>

          {/* ZMANIM */}
          <SettingsSection title={t("ZMANIM_TITLE")} expanded={expanded.zmanim} onToggle={() => toggle("zmanim")}>
            <ZmanimSettings
              t={t}
              visibleZmanim={visibleZmanimArray}
              onZmanimChange={toggleZman}
              onSelectionChange={onZmanimSelectionChange}
            />
          </SettingsSection>

          {/* STUDY */}
          <SettingsSection title={t("STUDY_TITLE")} expanded={expanded.study} onToggle={() => toggle("study")}>
            <StudySettings
              t={t}
              visibleStudies={visibleStudiesArray}
              onStudiesChange={toggleEstudio}
              onSelectionChange={onStudiesSelectionChange}
            />
          </SettingsSection>

          {/* AVISOS */}
          <SettingsSection title={t("AVISOS_EVENTS_TITLE") || "Avisos y Eventos"} expanded={expanded.avisos} onToggle={() => toggle("avisos")}>
            <AvisosSettings
              customAvisos={customAvisos}
              onAddAviso={onAddAviso}
              onDeleteAviso={onDeleteAviso}
            />
          </SettingsSection>

          {/* MINIAN */}
          <SettingsSection title={t("MINIAN_TITLE") || "Minyanim"} expanded={expanded.minian} onToggle={() => toggle("minian")}>
            <TimeListSettings
              list={minianimList}
              onSave={handleSaveMinian}
              onDelete={handleDeleteMinian}
              addTitleKey={'ADD_MINIAN'}
              manageTitleKey={'MANAGE_MINIANIM'}
            />
          </SettingsSection>

          {/* SEIDER */}
          <SettingsSection title={t("SEIDER_TITLE") || "Seider"} expanded={expanded.seider} onToggle={() => toggle("seider")}>
            <TimeListSettings
              list={seiderList}
              onSave={handleSaveSeider}
              onDelete={handleDeleteSeider}
              addTitleKey={'ADD_SEIDER'}
              manageTitleKey={'MANAGE_SEIDER'}
            />
          </SettingsSection>


          {/* Bottom spacing to prevent cutoff */}
          <Box sx={{ height: '80px' }} />

        </Box>
      </ThemeProvider>
    </Drawer>
  );
};
export default SettingsSheet;