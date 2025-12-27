import { useState, useEffect } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { Sun, Cloud, CloudSun, Cloudy, CloudRain, CloudDrizzle, CloudLightning, Snowflake, Wind } from 'lucide-react';
import { useAppData } from '../../../../data/useAppData.js';
import { useLanguage } from '../../../../shared/traslantions/useLanguage.js';

export const WeatherApp = ({ isCard = false }) => {
  const theme = useTheme();
  const { time } = useAppData();
  const { t, language } = useLanguage();
  const city = time?.city;
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);

  const urlBase = 'https://api.openweathermap.org/data/2.5/weather';
  //const ApiKey = import.meta.env.VITE_OPENWEATHER_API_KEY; //agrega tu contraseña de la api
  const ApiKey = '36622212221222122212221222122212'; //agrega tu contraseña de la api

  const getWeatherIcon = (iconCode) => {
    const iconProps = {
      size: isCard ? 48 : 64,
      color: theme.palette.primary.main,
      strokeWidth: 1.5
    };

    switch (iconCode?.slice(0, 2)) {
      case '01': return <Sun {...iconProps} />;
      case '02': return <CloudSun {...iconProps} />;
      case '03': return <Cloud {...iconProps} />;
      case '04': return <Cloudy {...iconProps} />;
      case '09': return <CloudDrizzle {...iconProps} />;
      case '10': return <CloudRain {...iconProps} />;
      case '11': return <CloudLightning {...iconProps} />;
      case '13': return <Snowflake {...iconProps} />;
      case '50': return <Wind {...iconProps} />;
      default: return <CloudSun {...iconProps} />;
    }
  };

  const fetchWeatherData = async () => {
    if (!city) return;
    setLoading(true);
    try {
      const response = await fetch(
        `${urlBase}?q=${city}&appid=${ApiKey}&lang=${language}&units=metric`
      );
      const data = await response.json();
      if (data.cod === 200) {
        setWeatherData(data);
      } else {
        console.error("Weather API Error:", data.message);
      }
    } catch (error) {
      console.error('Ha habido un error: ', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (city) {
      fetchWeatherData();
    }
  }, [city]);

  if (!city) return null;

  const content = (
    <Box sx={{ width: '100%', textAlign: 'center' }}>
      {loading ? (
        <Typography sx={{ color: 'text.secondary', fontStyle: 'italic', py: { xs: 2, md: 4 }, fontSize: { xs: '0.875rem', md: '1rem' } }}>
          {t('LOADING_WEATHER')}
        </Typography>
      ) : weatherData ? (
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: { xs: 0.5, md: 1 } }}>
          <Typography
            variant="h6"
            sx={{
              fontSize: {
                xs: isCard ? '1rem' : '1.1rem',
                sm: isCard ? '1.1rem' : '1.25rem',
                md: isCard ? '1.2rem' : '1.5rem'
              },
              color: 'primary.dark',
              fontWeight: 600,
              lineHeight: 1.2
            }}
          >
            {weatherData.name},
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: { xs: 2, md: 4 }, my: 1 }}>
            <Box sx={{
              p: 1.5,
              backgroundColor: theme.custom?.colors?.border?.light || 'action.hover',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {getWeatherIcon(weatherData.weather?.[0]?.icon)}
            </Box>
            <Box sx={{ textAlign: 'left' }}>
              <Typography
                variant="h3"
                sx={{
                  fontSize: {
                    xs: isCard ? '1.8rem' : '2.2rem',
                    sm: isCard ? '2.4rem' : '3rem',
                    md: isCard ? '2.8rem' : '4rem'
                  },
                  fontWeight: 700,
                  color: 'primary.light',
                  lineHeight: 1
                }}
              >
                {Math.round(weatherData.main.temp)}°
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', fontWeight: 500 }}>
                {t('FEELS_LIKE') || 'Sensación'}: {Math.round(weatherData.main.feels_like)}°
              </Typography>
            </Box>
          </Box>

          <Typography
            sx={{
              fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
              color: 'text.secondary',
              textTransform: 'capitalize',
              fontWeight: 500,
              mt: 1
            }}
          >
            {weatherData.weather?.[0]?.description}
          </Typography>

          {/* Stats Grid */}
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
            mt: { xs: 1.5, md: 2 },
            pt: { xs: 1.5, md: 2 },
            borderTop: `1px solid ${theme.custom?.colors?.border?.main || 'divider'}`
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
              <Box>
                <Typography sx={{ fontSize: { xs: '0.55rem', md: '0.65rem' }, color: 'text.quaternary', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('HUMIDITY')}</Typography>
                <Typography sx={{ fontWeight: 600, fontSize: { xs: '0.8rem', md: '0.95rem' } }}>{weatherData.main.humidity}%</Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: { xs: '0.55rem', md: '0.65rem' }, color: 'text.quaternary', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('WIND')}</Typography>
                <Typography sx={{ fontWeight: 600, fontSize: { xs: '0.8rem', md: '0.95rem' } }}>{Math.round(weatherData.wind.speed * 3.6)} <small style={{ fontSize: '0.7em' }}>km/h</small></Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
              <Box>
                <Typography sx={{ fontSize: { xs: '0.55rem', md: '0.65rem' }, color: 'text.quaternary', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('TEMP_MIN_MAX')}</Typography>
                <Typography sx={{ fontWeight: 600, fontSize: { xs: '0.8rem', md: '0.95rem' } }}>{Math.round(weatherData.main.temp_min)}° / {Math.round(weatherData.main.temp_max)}°</Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: { xs: '0.55rem', md: '0.65rem' }, color: 'text.quaternary', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('VISIBILITY')}</Typography>
                <Typography sx={{ fontWeight: 600, fontSize: { xs: '0.8rem', md: '0.95rem' } }}>{Math.round(weatherData.visibility / 1000)} km</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      ) : (
        <Typography sx={{ color: 'text.secondary', fontSize: '0.8rem', py: 4 }}>
          {t('WEATHER_ERROR')}
        </Typography>
      )}
    </Box>
  );

  if (isCard) {
    return (
      <Box sx={{
        width: '100%',
        backgroundColor: theme.custom?.colors?.glass?.backgroundAlt || 'background.paper',
        border: `1px solid ${theme.custom?.colors?.border?.main || 'divider'}`,
        borderRadius: '16px',
        p: { xs: 1.5, sm: 2, md: 3 },
        mt: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: { xs: '140px', sm: '160px', md: '200px' }
      }}>
        {content}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: { xs: '100%', sm: '320px', md: '400px' },
        background: theme.custom?.colors?.glass?.background || 'background.paper',
        backdropFilter: 'blur(12px)',
        borderRadius: '32px',
        border: `1px solid ${theme.custom?.colors?.border?.main || 'divider'}`,
        p: { xs: 3, sm: 4, md: 5 },
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: `0 8px 32px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.4)' : alpha(theme.palette.primary.main, 0.1)}`,
        alignSelf: 'center',
        transition: 'all 0.3s ease'
      }}
    >
      <Typography
        variant="overline"
        sx={{
          color: 'primary.main',
          fontWeight: 700,
          letterSpacing: '0.2em',
          mb: { xs: 2, md: 3 },
          display: 'block',
          fontSize: { xs: '0.75rem', md: '0.9rem' }
        }}
      >
        {t('WEATHER_TITLE')}
      </Typography>
      {content}
    </Box>
  );
};