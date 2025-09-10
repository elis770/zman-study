import icon from '../utils/icon.png';
import '../style/App.css';
import { TimeComponent } from '../components/TimeComponent.jsx';
import StudyContainer from '../components/StudyContainer.jsx';
import { DataProvider } from '../context/DataContext';
import { useTheme } from '../hooks/useTheme.js';
import { LanguageProvider, useLanguage } from '../context/LanguageContext';

const AppContent = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();

  const x = {color: theme === 'dark' ? '#fff' : '#000',
          backgroundColor: theme === 'dark' ? '#333' : '#eee',}
  return (
    <div className="app-container">
      <img src={icon} alt="ícono de la aplicación" className="app-icon" />
      <button
        onClick={toggleTheme}
        className="theme-toggle-button"
        style={{
          ...x
        }}
      >
        Cambiar a modo {theme === 'dark' ? 'claro' : 'oscuro'}
      </button>
      <button onClick={toggleLanguage} className="language-toggle-button" style={{
          ...x
        }}>
        {t(language === 'es' ? 'CHANGE_TO_HEBREW' : 'CHANGE_TO_SPANISH')}
      </button>
      <div className="main-content">
        <TimeComponent />
        <StudyContainer />
      </div>
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