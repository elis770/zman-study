import { useState } from 'react';
import icon from '../utils/icon.png';
import '../style/App.css';
import { TimeComponent } from '../components/TimeComponent.jsx';
import StudyContainer from '../components/StudyContainer.jsx';
import AvisosComponent from '../components/AvisosComponent.jsx';
import SettingsModal from '../components/SettingsModal.jsx';
import { DataProvider } from '../context/DataContext';
import { useTheme } from '../hooks/useTheme.js';
import { LanguageProvider, useLanguage } from '../context/LanguageContext';
import usePersistentState from '../hooks/usePersistentState.js';
import { allZmanim } from '../hooks/zmanimConfig.js';
import { allStudies } from '../hooks/studyConfig.js';

const defaultZmanim = ['NETZ_HAJAMA', 'SOF_SHEMA', 'SHKIA', 'TZET_HAKOJABIM'];
const defaultStudies = ['JUMASH', 'TEHILIM', 'TANYA', 'SEFER_HAMITZVOT', 'RAMBAM_1', 'PARASHA'];

const AppContent = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    <div className="app-container">
      <div className="header-container">
        <img src={icon} alt="ícono de la aplicación" className="app-icon" />
        <div className="controls-container">
          <button
            onClick={() => setIsModalOpen(true)}
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
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
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
    </div>
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