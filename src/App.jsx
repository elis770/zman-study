import useTime from './hooks/useTime.js';
import useSefaria from './hooks/useSefaria.js';
import useHdate from './hooks/useHdate.js';
import useStudy from './hooks/useStudy.js';
//import useScraping from './hooks/useScraping.js';
import './style/App.css';

const App = () => {
  const { time, date, timezone, hebrewDate } = useTime();
  const { parasha, haftara, daf_yomi, Rambam1, Rambam3, Tanya, loading } = useSefaria();
  const { todaySH, todayJumesh, todayTehilim } = useStudy();
  const { sunrise, sofZmanShma, shkiah, tzet, candleLighting, chatzot } = useHdate();
  //const { /*algo va a enviar aca */ } = useScraping();
  //console.log(Hz);

  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center',
        marginTop: '50px',
      }}
    >
      <div
        style={{
          background: 'blueviolet',
          padding: '20px',
          marginBottom: '20px',
        }}
      >
        <h2>Hora actual según tu ubicación</h2>
        <div id="date">
          {date} - {hebrewDate}
        </div>
        <div id="time">{time}</div>
        <div id="timezone">{timezone}</div>
      </div>

      <div style={{ background: 'blue', padding: '20px' }}>
        <h2>Sefaria</h2>
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <ul>
            {parasha && (
              <div>
                <strong>Parashá:</strong> {parasha.he} - {parasha.en}
              </div>
            )}
            {haftara && (
              <div>
                <strong>Haftará:</strong> {haftara.he} - {haftara.en}
              </div>
            )}
            {daf_yomi && (
              <div>
                <strong>Daf Yomi:</strong> {daf_yomi.he} - {daf_yomi.en}
              </div>
            )}
            {Rambam1 && (
              <div>
                <strong>Rambam 1 Perek:</strong> {Rambam1.he} - {Rambam1.en}
              </div>
            )}
            {Rambam3 && (
              <div>
                <strong>Rambam 3 Perek:</strong> {Rambam3.he} - {Rambam3.en}
              </div>
            )}
            {Tanya && (
              <div>
                <strong>Tanya:</strong> {Tanya.en}
              </div>
            )}
          </ul>
        )}
      </div>

      <br />

      <div style={{ background: 'green', padding: '20px' }}>
        <h2>Hdate</h2>
      <div style={{ background: 'red', padding: '20px' }}>
        <h2>Estudio de Hoy</h2>
        {todaySH || todayJumesh ? (
          <>
            {todaySH && (
              <div>
                <strong>Sefer HaMitzvot:</strong> {todaySH}
              </div>
            )}
            {todayJumesh && (
              <div>
                <strong>Jumash:</strong> {todayJumesh}
              </div>
            )}
            {todayTehilim && (
              <div>
                <strong>Tehilim:</strong> {todayTehilim}
              </div>
            )}
          </>
        ) : (
          <p>Cargando...</p>
        )}
      </div>
      <br />
      <div style={{ background: 'orange', padding: '20px' }}>
        <h2>Zmanim</h2>
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <ul>
            {sunrise && (
              <div>
                <strong>Netz Hajama:</strong> {sunrise}
              </div>
            )}
            {sofZmanShma && (
              <div>
                <strong>Sof Shema:</strong> {sofZmanShma}
              </div>
            )}
            {shkiah && (
              <div>
                <strong>Shkia:</strong> {shkiah}
              </div>
            )}
            {tzet && (
              <div>
                <strong>Tzet hacojabim:</strong> {tzet}
              </div>
            )}
            {candleLighting && (
              <div>
                <strong>Encendido de velas:</strong> {candleLighting}
              </div>
            )}
            {chatzot && (
              <div>
                <strong>Jatzot:</strong> {chatzot}
              </div>
            )}
          </ul>
        )}
      </div>
      <br />
      <div style={{ background: 'orange', padding: '20px' }}>
        <h2>Scraping</h2>
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <ul>
            {sunrise && (
              <div>
               <strong>Haiom iom:</strong> {sunrise}
              </div>
            )}
          </ul>
        )}
      </div>
    </div>
    </div>
  );
};

export default App;