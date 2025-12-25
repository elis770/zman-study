import { useState } from 'react';
import './WeatherApp.css';
export const WeatherApp = () => {
  // const [city, setCity] = useState('');
  const {city} = useAppData()
  const [weatherData, setWeatherData] = useState(null);
  const urlBase = 'https://api.openweathermap.org/data/2.5/weather';
  const ApiKey = '3ac42ad3305b0d407c4883df3467a9cc';
  const diffKelvin = 273.15;

  const fetchWeatherData = async () => {
    try {
      const response = await fetch(
        `${urlBase}?q=${city}&appid=${ApiKey}&lang=es`
      );
      const data = await response.json();
      console.log(data);
      setWeatherData(data);
    } catch (error) {
      console.error('Ha habido un error: ', error);
    }
  };
  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchWeatherData();
    console.log(city);
  };
  return (
    <div className="container" sx={{ maxWidth: '50%', m: '0 auto', p: '20px' }}>
      <h1 sx={{ fontSize: '40px', mb: '20px'}}>Clima Actual</h1>
      {weatherData && (
        <div>
          <h2 sx={{ fontSize: '24px', mb: '10px' }}>
            {weatherData.name}, {weatherData.sys.country}
          </h2>
          <p sx={{ fontSize: '18px', mb: '10px' }}>
            La temperatura actual es {' '}
            {Math.floor(weatherData.main.temp - diffKelvin)}°C
          </p>
          <p sx={{ fontSize: '18px', mb: '10px' }}>
            La condicion meteorologica actual:{' '}
            {weatherData.weather[0].description}
          </p>
          <img
            src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
            alt={weatherData.weather[0].description}
            sx={{ width: '100px', height: 'auto', mt: '10px' }}
          />
        </div>
      )}
    </div>
  );
};