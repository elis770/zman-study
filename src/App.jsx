import useTime from './hooks/useTime.js';
import useSefaria from './hooks/useSefaria.js';
import useHdate from './hooks/useHdate.js';
import useStudy from './hooks/useStudy.js';
import './style/App.css';

const App = () => {
  const {time, date, timezone, hebrewDate} = useTime();
  const { parasha, haftara, daf_yomi, Rambam1, Rambam3, Tanya, loading } = useSefaria();
  const { todayStudy } = useStudy();
  const {/*algo va a estar esperando aca */} = useHdate();

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      textAdivgn: 'center',
      marginTop: '50px',
    }}>
      <div style={{ background: 'blueviolet', padding: '20px', marginBottom: '20px' }}>
        <h2>Hora actual según tu ubicación</h2>
        <div id="date">{date} - {hebrewDate}</div>
        <div id="time">{time}</div>
        <div id="timezone">{timezone}</div>
      </div>
      <h2>Estudio de Hoy</h2>
      <div style={{ background: 'blue', padding: '20px' }}>
        <h2>Sefaria</h2>
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <ul>
            {parasha && <div><strong>Parashá:</strong> {parasha.he} - {parasha.en}</div>}
            {haftara && <div><strong>Haftará:</strong> {haftara.he} - {haftara.en}</div>}
            {daf_yomi && <div><strong>Daf Yomi:</strong> {daf_yomi.he} - {daf_yomi.en}</div>}
            {Rambam1 && <div><strong>Rambam 1 Perek:</strong> {Rambam1.he} - {Rambam1.en}</div>}
            {Rambam3 && <div><strong>Rambam 3 Perek:</strong> {Rambam3.he} - {Rambam3.en}</div>}
            {Tanya && <div><strong>Tanya:</strong> {Tanya.en}</div>}
          </ul>
        )}
      </div>
      <br />
      <div style={{ background: 'red', padding: '20px' }}>
        <h2>Estudio de Hoy</h2>
        {todayStudy ? (
          <div>
            <strong>Sefer HaMitzvot:</strong> {todayStudy.he} - {todayStudy.en}
          </div>
        ) : (
          <p>Cargando...</p>
        )}
      </div>
    </div>
  );
};

export default App;