import { useState } from 'react';
import icon from '../utils/icon.png';
import '../shared/styles/App.css';
import { TimeComponent } from '../modules/time/ui/TimeComponent.jsx';
import StudyContainer from '../modules/study/ui/StudyContainer.jsx';
import AvisosComponent from '../modules/avisos/ui/AvisosComponent.jsx';
import SettingsModal from '../modules/settings/ui/SettingsModal.jsx';
import { DataProvider } from '../shared/context/DataContext.jsx';
import { useTheme } from '../shared/hooks/useTheme.js';
import { LanguageProvider, useLanguage } from '../shared/context/LanguageContext.jsx';
import usePersistentState from '../shared/hooks/usePersistentState.js';
import AboutMeModal from '../modules/AboutMe/ui/AboutMeModal.jsx';
import TrasladeText from '../shared/context/TrasladeText.jsx';
import { T } from '../shared/context/T.jsx';
const defaultZmanim = ['NETZ_HAJAMA', 'SOF_SHEMA', 'SHKIA', 'TZET_HAKOJABIM'];
const defaultStudies = ['JUMASH', 'TEHILIM', 'TANYA', 'SEFER_HAMITZVOT', 'RAMBAM_1', 'PARASHA'];

const AppContent = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAboutMeOpen, setIsAboutMeOpen] = useState(false);
  const [showMinian, setShowMinian] = usePersistentState('showMinian', false);
  const [showHayomYom, setShowHayomYom] = usePersistentState('showHayomYom', true);
  const [customAvisos, setCustomAvisos] = usePersistentState('customAvisos', []);
  const [visibleZmanim, setVisibleZmanim] = usePersistentState('visibleZmanim', defaultZmanim);
  const [visibleStudies, setVisibleStudies] = usePersistentState('visibleStudies', defaultStudies);

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

  const x = {color: theme === 'dark' ? '#fff' : '#000',
          backgroundColor: theme === 'dark' ? '#333' : '#eee',}
  return (
    <>
    <T/>
    <div className="app-container">
      <div className="header-container">
        <img src={icon} alt="ícono de la aplicación" className="app-icon" />
        <div className="controls-container">
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
          showMinian={showMinian}
          showHayomYom={showHayomYom}
          visibleZmanim={visibleZmanim}
          visibleStudies={visibleStudies}
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
        toggleShowMinian={toggleShowMinian}
        showHayomYom={showHayomYom}
        toggleShowHayomYom={toggleShowHayomYom}
        visibleZmanim={visibleZmanim}
        onZmanimChange={handleZmanimChange}
        visibleStudies={visibleStudies}
        onStudiesChange={handleStudiesChange}
        customAvisos={customAvisos}
        onAddAviso={addAviso}
        onDeleteAviso={deleteAviso}
      />
      <AboutMeModal
        isOpen={isAboutMeOpen}
        onClose={() => setIsAboutMeOpen(false)}
      />
    </div>
    </>
  );
};

const App = () => {
  return (
    <DataProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </DataProvider>
  );
};

export default App;