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
          padding: '10px',
          marginBottom: '20px',
        }}
      >
        <h3 id="date">{date} - {hebrewDate}</h3>
         {parasha && <p><strong>Parashá:</strong> {parasha.he} - {parasha.en}</p>}
        <h2 id="time">{time}</h2>
        <div id="timezone">{timezone}</div>

        {loading ? (
          <p>Cargando...</p>
        ) : (
          <>
            <h2>Zmanim</h2>
            <ul>
              {sofZmanShma && <li><strong>Sof Shema:</strong> {sofZmanShma}</li>}
              {shkiah && <li><strong>Shkia:</strong> {shkiah}</li>}
              {candleLighting && <li><strong>Encendido de velas:</strong> {candleLighting}</li>}
              {tzet && <li><strong>Tzet hakojabim:</strong> {tzet}</li>}
              {chatzot && <li><strong>Jatzot:</strong> {chatzot}</li>}
            </ul>

            <h2>Estudio de Hoy</h2>
            <ul>
              {todayJumesh && <li><strong>Jumash:</strong> {todayJumesh}</li>}
              {todayTehilim && <li><strong>Tehilim:</strong> {todayTehilim}</li>}
              {Tanya && <li><strong>Tanya:</strong> {Tanya.en}</li>}
              {Rambam3 && <li><strong>Rambam 3 Perek:</strong> {Rambam3.he} - {Rambam3.en}</li>}
            </ul>

            <h2>Más Zmanim y Estudio</h2>
            <ul>
              {sunrise && <li><strong>Netz Hajama:</strong> {sunrise}</li>}
              {todaySH && <li><strong>Sefer HaMitzvot:</strong> {todaySH}</li>}
              {haftara && <li><strong>Haftará:</strong> {haftara.he} - {haftara.en}</li>}
              {daf_yomi && <li><strong>Daf Yomi:</strong> {daf_yomi.he} - {daf_yomi.en}</li>}
              {Rambam1 && <li><strong>Rambam 1 Perek:</strong> {Rambam1.he} - {Rambam1.en}</li>}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default App;