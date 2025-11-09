import { useState, createContext } from 'react';
import icon from '../../public/icon.png';
import { DataProvider } from '../shared/context/DataContext.jsx';
import '../shared/styles/App.css';
import { TimeComponent } from '../modules/time/ui/TimeComponent.jsx';
import StudyContainer from './StudyContainer.jsx';
import AvisosComponent from '../modules/avisos/ui/AvisosComponent.jsx';
import SettingsModal from '../modules/settings/ui/SettingsModal.jsx';
import { useTheme } from '../shared/hooks/useTheme.js';
import { useLanguage } from '../shared/hooks/useLanguage.js';
import usePersistentState from '../shared/hooks/usePersistentState.js';
import AboutMeModal from '../modules/AboutMe/ui/AboutMeModal.jsx';
import AboutProyectModal from '../modules/AboutProyect/ui/AboutProyectModal.jsx';
import { allZmanim } from '../modules/zmanim/context/zmanimConfig.js';
import { allStudy } from '../modules/study/context/studyConfig.js';
import { Analytics } from "@vercel/analytics/next"

// Valores por defecto y listas completas de claves
const defaultZmanim = ['sunrise', 'sofZmanShma', 'shkiah', 'tzeit'];
const defaultStudies = ['JUMASH', 'TEHILIM', 'TANYA', 'SEFER_HAMITZVOT', 'RAMBAM_1', 'PARASHA'];

const AppContent = ({
  userCity,
  onUserCityChange,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAboutProyectOpen, setIsAboutProyectOpen] = useState(false);
  const [isAboutMeOpen, setIsAboutMeOpen] = useState(false);
  const [showMinian, setShowMinian] = usePersistentState('showMinian', false);
  const [showHayomYom, setShowHayomYom] = usePersistentState('showHayomYom', true);
  const [customAvisos, setCustomAvisos] = usePersistentState('customAvisos', []);
  const [visibleZmanim, setVisibleZmanim] = usePersistentState('visibleZmanim', defaultZmanim);
  const [visibleStudies, setVisibleStudies] = usePersistentState('visibleStudies', defaultStudies);
  const [autoSwitchDelay, setAutoSwitchDelay] = usePersistentState('autoSwitchDelay', 10000);

  const toggleShowMinian = () => setShowMinian(prev => !prev);
  const toggleShowHayomYom = () => setShowHayomYom(prev => !prev);

  const addAviso = (aviso) => {
    // Adds a unique ID to the new aviso
    setCustomAvisos(prev => [...prev, { ...aviso, id: Date.now() }]);
  };

  const deleteAviso = (id) => {
    setCustomAvisos(prev => prev.filter(a => a.id !== id));
  };

  const handleZmanimChange = (key) => {
    setVisibleZmanim(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  };

  const handleStudiesChange = (key) => {
    setVisibleStudies(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  };

  // Funciones para seleccionar todos o resetear
  const handleZmanimSelection = (type) => {
    const allKeys = allZmanim.map(z => z.key);
    setVisibleZmanim(type === 'all' ? allKeys : defaultZmanim);
  };
  const handleStudiesSelection = (type) => {
    const allKeys = allStudy.map(s => s.key);
    setVisibleStudies(type === 'all' ? allKeys : defaultStudies);
  };

  const x = {color: theme === 'dark' ? '#fff' : '#000',
          backgroundColor: theme === 'dark' ? '#333' : '#eee',}
  return (
    <>
  <div className="app-container">
      <div className="header-container">
        <div className="controls-container">
          <button
            onClick={() => setIsAboutProyectOpen(true)}
            className="about-proyect-button"
            style={x}
            aria-label="Sobre el Proyecto"
          >
        <img src={icon} alt="ícono de la aplicación" className="app-icon" />
          </button>
          <button
            onClick={() => setIsAboutMeOpen(true)}
            className="about-me-button"
            style={x}
            aria-label="Sobre Mí"
          >
            👤
          </button>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="settings-button"
            style={x}
            aria-label="Configuración"
          >
            ⚙️
          </button>
        </div>
      </div>
      <div className="main-content">

        <TimeComponent />
        <AvisosComponent customAvisos={customAvisos} />
        <StudyContainer
          customAvisos={customAvisos}
          showMinian={showMinian}
          showHayomYom={showHayomYom}
          visibleZmanim={visibleZmanim}
          visibleStudies={visibleStudies}
          autoSwitchDelay={autoSwitchDelay}
        />
      </div>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        toggleTheme={toggleTheme}
        language={language}
        toggleLanguage={toggleLanguage}
        t={t}
        showMinian={showMinian}
        userCity={userCity}
        onUserCityChange={onUserCityChange}
        toggleShowMinian={toggleShowMinian}
        showHayomYom={showHayomYom}
        toggleShowHayomYom={toggleShowHayomYom}
        visibleZmanim={visibleZmanim}
        onZmanimSelectionChange={handleZmanimSelection}
        onZmanimChange={handleZmanimChange}
        visibleStudies={visibleStudies}
        onStudiesSelectionChange={handleStudiesSelection}
        onStudiesChange={handleStudiesChange}
        customAvisos={customAvisos}
        onAddAviso={addAviso}
        onDeleteAviso={deleteAviso}
        autoSwitchDelay={autoSwitchDelay}
        onAutoSwitchDelayChange={setAutoSwitchDelay}
      />
      <AboutMeModal
        isOpen={isAboutMeOpen}
        onClose={() => setIsAboutMeOpen(false)}
      />
      <AboutProyectModal
        isOpen={isAboutProyectOpen}
        onClose={() => setIsAboutProyectOpen(false)}
      />
    </div>
    </>
  );
};

const App = () => {
  // El estado de la ciudad ahora vive aquí, en el componente padre.
  const [userCity, setUserCity] = usePersistentState('userCity', '');

  // Función para actualizar la ciudad y forzar una recarga completa
  const handleCityChange = (newCity) => {
    setUserCity(newCity);
    // Forzamos una actualización completa del contexto
    // setTimeout(() => {
    //   console.log("Actualizando contexto con nueva ciudad:", newCity);
    // }, 0);
  };

  return (
    // 1. DataProvider recibe la ciudad para que pueda recalcular los datos.
    <DataProvider key={userCity} userCity={userCity}>
      {/* 2. AppContent recibe la ciudad y la función para cambiarla desde el modal. */}
      <AppContent userCity={userCity} onUserCityChange={handleCityChange} />
      {/* //<Analytics /> */}
    </DataProvider>
  );
};

export default App;