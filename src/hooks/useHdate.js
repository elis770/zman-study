import { useState, useEffect } from 'react';
import { GeoLocation, Zmanim } from '@hebcal/core';

export default function useHdate() {
  const [sunrise, setSunrise] = useState(null);
  const [sofZmanShma, setSofZmanShma] = useState(null);
  const [shkiah, setShkiah] = useState(null);
  const [tzet, setTzet] = useState(null);
  const [candleLighting, setCandleLighting] = useState(null);
  const [chatzot, setChatzot] = useState(null);

  const latitude = -34.6037;
  const longitude = -58.3816;
  const tzid = 'America/Argentina/Buenos_Aires';
  const gloc = new GeoLocation(null, latitude, longitude, 0, tzid);

  useEffect(() => {
    const today = new Date();
    if (!today) return;

    const zmanim = new Zmanim(gloc, today, false);

    const zmanimList = [
      { name: 'sunrise', fn: () => zmanim.sunrise() },
      { name: 'sofZmanShma', fn: () => zmanim.sofZmanShma() },
      { name: 'shkiah', fn: () => zmanim.sunset() },
      { name: 'tzet', fn: () => zmanim.tzeit() },
      { name: 'candleLighting', fn: () => zmanim.sunsetOffset(-18, true) },
      { name: 'chatzot', fn: () => zmanim.chatzot() },
    ];

    // Recorremos todos los zmanim
    zmanimList.forEach(z => {
      const dateObj = z.fn();
      if (!dateObj) return;
      const hora = dateObj.toLocaleTimeString('he-IL', {
        timeZone: tzid,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });

      // Seteamos cada estado dinámicamente
      switch (z.name) {
        case 'sunrise':
          setSunrise(hora);
          break;
        case 'sofZmanShma':
          setSofZmanShma(hora);
          break;
        case 'shkiah':
          setShkiah(hora);
          break;
        case 'tzet':
          setTzet(hora);
          break;
        case 'candleLighting':
          setCandleLighting(hora);
          break;
        case 'chatzot':
          setChatzot(hora);
          break;
      }
    });
  }, []);

  return { sunrise, sofZmanShma, shkiah, tzet, candleLighting, chatzot };
}