import { useAppData } from '../context/DataContext';

export const TimeComponent = () => {
  const {
    formattedDate,
    time,
    tzid,
    city,
    country,
    error: geoError,
    hebrewDate,
    loadingGeo,
  } = useAppData();

  if (loadingGeo) {
    return <p>Obteniendo ubicación...</p>;
  }
  return (
    <>
      <h3 id="date">
        {formattedDate} - {hebrewDate}
      </h3>
      <h2 id="time">{time}</h2>
      <div id="timezone">
        {tzid}{' '}
        {city || country
          ? `— ${city ?? ''}${city && country ? ', ' : ''}${country ?? ''}`
          : ''}
      </div>
      {geoError && <small style={{ color: '#b00' }}>{geoError}</small>}
    </>
  );
};