import icon from './utils/icon.png';
import './style/App.css';
import { HaiomYomComponent } from './components/HaiomYomComponent.jsx';
import { TimeComponent } from './components/TimeComponent.jsx';
import ZmanimComponent from './components/ZmanimComponent.jsx';
import StudyComponent from './components/StudyComponent.jsx';
import { DataProvider, useAppData } from './context/DataContext';

const AppContent = () => {
  const { loading, loadingGeo } = useAppData();

  return (
    <div className="app-container">
      <img src={icon} alt="ícono de la aplicación" className="app-icon" />
      <div className="main-content">
        <TimeComponent />
        {loading || loadingGeo ? (
          <p>Cargando...</p>
        ) : (
          <>
            <ZmanimComponent />
            <br />
            <StudyComponent />
            <br />
            <HaiomYomComponent />
          </>
        )}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
};

export default App;