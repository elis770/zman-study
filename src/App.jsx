import useTime from '../hooks/useTime';
import './App.css'

const App = () => {
  const time = useTime();

  return (
    <>
      <div style={{
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center',
        marginTop: '50px',
        background: 'blueviolet',
        padding: '20px',
      }}>
        <h1>Hora actual según tu ubicación</h1>
        <div id="time">{time}</div>
      </div>
    </>
  );
};

export default App;