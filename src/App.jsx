import useGregorianTime from './hooks/useGregorianTime.js';
import useHebrewDate from './hooks/useHebrewDate.js';
import useSefaria from './hooks/useSefaria.js';
import useHdate from './hooks/useHdate.js';
import useStudy from './hooks/useStudy.js';
import { shouldShowChatzot, shouldShowNetz, isFriday, isShabbat, isOmer } from './utils/dateChecks.js';
import './style/App.css';

const App = () => {
  const {
    tzid, latitude, longitude,
    time, date, formattedDate,
    city, country,
    loading: loadingGeo,
    error: geoError,
  } = useGregorianTime();

 const { hebrewDate, hebrewObj } = useHebrewDate(date);

  const { parasha, haftara, /*daf_yomi, Rambam1,*/ Rambam3, Tanya, loading } =
    useSefaria();

  const { todaySH, todayJumesh, todayTehilim, omer } = useStudy({hebrewObj});

  const { sunrise, sofZmanShma, shkiah, tzet, candleLighting, chatzot } =
    useHdate({ tzid, latitude, longitude });

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
        <h3 id="date">
          {formattedDate} - {hebrewDate}
        </h3>

        {parasha && (
          <p>
            <strong>Parashá:</strong> {parasha.he} - {parasha.en}
          </p>
        )}

        {isShabbat(date) && haftara && (
          <p>
            <strong>Haftará:</strong> {haftara.en} - {haftara.he}
          </p>
        )}

        {isOmer(hebrewDate) && omer > 0 && (
          <p>
            <strong>Omer:</strong> {omer}
          </p>
        )}
        {isOmer(hebrewDate) && omer > 2 && (
          <p>
            <strong>Daf Guemara Sota:</strong> {omer}
          </p>
        )}

        <h2 id="time">{time}</h2>

        <div id="timezone">
          {tzid} {city || country ? `— ${city ?? ''}${city && country ? ', ' : ''}${country ?? ''}` : ''}
        </div>
        {geoError && <small style={{ color: '#b00' }}>{geoError}</small>}

        {(loading || loadingGeo) ? (
          <p>Cargando...</p>
        ) : (
          <>
            <h2>Zmanim</h2>
            <ul>
              {shouldShowNetz(hebrewDate) && sunrise && (
                <li>
                  <strong>Netz Hajama:</strong> {sunrise}
                </li>
              )}
              {sofZmanShma && (
                <li>
                  <strong>Sof Shema:</strong> {sofZmanShma}
                </li>
              )}
              {shkiah && (
                <li>
                  <strong>Shkia:</strong> {shkiah}
                </li>
              )}
              {isFriday(date) && candleLighting && (
                <li>
                  <strong>Encendido de velas:</strong> {candleLighting}
                </li>
              )}
              {tzet && (
                <li>
                  <strong>Tzet hakojabim:</strong> {tzet}
                </li>
              )}
              {shouldShowChatzot(hebrewDate) && chatzot && (
                <li>
                  <strong>Jatzot:</strong> {chatzot}
                </li>
              )}
            </ul>

            <h2>Estudio de Hoy</h2>
            <ul>
              {todayJumesh && (
                <li>
                  <strong>Jumash:</strong> {todayJumesh}
                </li>
              )}
              {todayTehilim && (
                <li>
                  <strong>Tehilim:</strong> {todayTehilim}
                </li>
              )}
              {Tanya && (
                <li>
                  <strong>Tanya:</strong> {Tanya.en}
                </li>
              )}
              {Rambam3 && (
                <li>
                  <strong>Rambam 3 Perek:</strong> {Rambam3.he} - {Rambam3.en}
                </li>
              )}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default App;