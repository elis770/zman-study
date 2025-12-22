import { Drawer, Box, Typography, IconButton, Divider } from "@mui/material";
import { X } from "lucide-react";
import GeneralSettings from "./general-settings/GeneralSettings.jsx";
import ZmanimSettings from "./zmanim/ZmanimSettings.jsx";
import StudySettings from "./study/StudySettings.jsx";
import AvisosSettings from "./avisos/AvisosSettings.jsx";
import TimeListSettings from "./timeList/TimeListSettings.jsx";
import LayoutSettings from "./layout/LayoutSettings.jsx";
import CitySettings from "./city/CitySettings.jsx";
import { SettingsSection } from "./SettingsSection.jsx";
import { useLanguage } from "../../shared/traslantions/useLanguage.js";
import { useSettings } from "./context/SettingsContext.jsx";
import { allZmanim } from "../../context/zmanim/zmanimConfig.js";
import { allStudies } from "./study/context/studyConfig.js";

export const SettingsSheet = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const {
    visibleZmanim, toggleZman, visibleEstudios, toggleEstudio,
    carouselInterval, setCarouselInterval,
    setBulkZmanim, setBulkEstudios, minianimList, setMinianimList,
    seiderList, setSeiderList,
    customAvisos, setCustomAvisos
  } = useSettings();

  const createListHandlers = (setList) => ({
    onSave: (item) => {
      setList(prev => [...prev, { ...item, id: Date.now() }].sort((a, b) => a.time.localeCompare(b.time)));
    },
    onDelete: (id) => setList(prev => prev.filter(i => i.id !== id))
  });

  const createBulkHandler = (config, setter) => (action) => {
    if (action === 'all') {
      const newSettings = {};
      config.forEach(item => newSettings[item.key] = true);
      setter(newSettings);
    } else {
      setter({});
    }
  };

  const getVisibleKeys = (obj) => Object.keys(obj).filter(k => obj[k]);

  const { onSave: handleSaveMinian, onDelete: handleDeleteMinian } = createListHandlers(setMinianimList);
  const { onSave: handleSaveSeider, onDelete: handleDeleteSeider } = createListHandlers(setSeiderList);

  const autoSwitchDelay = carouselInterval * 1000;
  const onAutoSwitchDelayChange = (val) => setCarouselInterval(val / 1000);

  const visibleZmanimArray = getVisibleKeys(visibleZmanim);
  const visibleStudiesArray = getVisibleKeys(visibleEstudios);

  const onZmanimSelectionChange = createBulkHandler(allZmanim, setBulkZmanim);
  const onStudiesSelectionChange = createBulkHandler(allStudies, setBulkEstudios);

  const onAddAviso = (aviso) => setCustomAvisos(prev => [...prev, { ...aviso, id: Date.now() }]);
  const onDeleteAviso = (id) => setCustomAvisos(prev => prev.filter(a => a.id !== id));

  if (!isOpen) return null;

  return (
    <Drawer
      anchor="right" open={isOpen} onClose={onClose}
      PaperProps={{
        sx: {
          height: '100dvh', width: { xs: "70%", sm: "70%", md: 420},
          maxWidth: '100%', background: "linear-gradient(to bottom right, #f5efe3, #e8dcc3)",
          borderRadius: { xs: '16px 0 0 16px', md: 0 }, boxShadow: '-10px 0 30px rgba(0,0,0,0.1)', p: 0
        }
      }}>

      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>

        {/* Fixed Header */}
        <Box sx={{ p: { xs: 2, sm: 3 }, pb: 0, flexShrink: 0 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
            <Typography variant="h5" sx={{ color: "#8b7355", fontWeight: 600 }}>
              {t("SETTINGS_TITLE") || "Configuración"}
            </Typography>
            <IconButton onClick={onClose}>
              <X color="#8b7355" />
            </IconButton>
          </Box>

          <Typography variant="body2" sx={{ color: 'rgba(139, 115, 85, 0.7)' }}>
            Personaliza qué elementos deseas ver en la aplicación
          </Typography>
          <Divider sx={{ my: 3 }} />
        </Box>

        <Box sx={{
          px: { xs: 2, sm: 3 },   // 👈 espacio lateral real
          pb: 2,
          overflowY: 'auto',
          flexGrow: 1,
        }}>
          <CitySettings />

          <SettingsSection title={t("DISTRIBUTION_TITLE") || "Distribución de Pantalla"}>
            <LayoutSettings />
          </SettingsSection>

          <SettingsSection title={t("GENERAL_SETTINGS") || "Configuración General"}>
            <GeneralSettings
              autoSwitchDelay={autoSwitchDelay}
              onAutoSwitchDelayChange={onAutoSwitchDelayChange}
            />
          </SettingsSection>

          <SettingsSection title={t("ZMANIM_TITLE")}>
            <ZmanimSettings
              t={t}
              visibleZmanim={visibleZmanimArray}
              onZmanimChange={toggleZman}
              onSelectionChange={onZmanimSelectionChange}
            />
          </SettingsSection>

          <SettingsSection title={t("STUDY_TITLE")}>
            <StudySettings
              t={t}
              visibleStudies={visibleStudiesArray}
              onStudiesChange={toggleEstudio}
              onSelectionChange={onStudiesSelectionChange}
            />
          </SettingsSection>

          <SettingsSection title={t("AVISOS_EVENTS_TITLE") || "Avisos y Eventos"}>
            <AvisosSettings
              customAvisos={customAvisos}
              onAddAviso={onAddAviso}
              onDeleteAviso={onDeleteAviso}
            />
          </SettingsSection>

          <SettingsSection title={t("MINIAN_TITLE") || "Minyanim"}>
            <TimeListSettings
              list={minianimList}
              onSave={handleSaveMinian}
              onDelete={handleDeleteMinian}
              addTitleKey={'ADD_MINIAN'}
              manageTitleKey={'MANAGE_MINIANIM'}
            />
          </SettingsSection>

          <SettingsSection title={t("SEIDER_TITLE") || "Seider"}>
            <TimeListSettings
              list={seiderList}
              onSave={handleSaveSeider}
              onDelete={handleDeleteSeider}
              addTitleKey={'ADD_SEIDER'}
              manageTitleKey={'MANAGE_SEIDER'}
            />
          </SettingsSection>

          <Box sx={{ height: '80px' }} />
        </Box>
      </Box>
    </Drawer>
  );
};
export default SettingsSheet;