import { GeoLocation, Zmanim } from '@hebcal/core';

// Coordenadas de Buenos Aires
const latitude = -34.6037;
const longitude = -58.3816;
const tzid = 'America/Argentina/Buenos_Aires';

// Objeto GeoLocation
const gloc = new GeoLocation(null, latitude, longitude, 0, tzid);

// Función para imprimir los zmanim de una fecha
function printZmanim(date) {
  const zmanim = new Zmanim(gloc, date, false);

  console.log('Fecha:', date.toLocaleDateString());

  // 1) Netz Hachama - sunrise
  const sunrise = zmanim.sunrise();
  console.log('1) Netz Hachama (Sunrise):', Zmanim.formatISOWithTimeZone(tzid, sunrise));

  // 2) Sof Zman Kriat Shema – según Gra o Magen Avraham
  const sofZmanShma = zmanim.sofZmanShma();
  console.log('2) Sof Zman Kriat Shema (Gra):', Zmanim.formatISOWithTimeZone(tzid, sofZmanShma));

  // 3) Shkiah – sunset
  const shkiah = zmanim.sunset();
  console.log('3) Shkiah (Sunset):', Zmanim.formatISOWithTimeZone(tzid, shkiah));

  // 4) Tzet Hakochavim – nightfall (8.5° below horizon)
//   const tzet = zmanim.tzeit85deg();
//   console.log('4) Tzet Hakochavim (8.5° nightfall):', Zmanim.formatISOWithTimeZone(tzid, tzet));

  // 5) Encendido de velas – 18 min antes del atardecer (ejemplo general)
  const candleLighting = zmanim.sunsetOffset(-18, true);
  console.log('5) Encendido de velas (-18 min):', Zmanim.formatISOWithTimeZone(tzid, candleLighting));

  // 6) Fin de Shabat (Havdalah) – normalmente coincide con tzet
//   console.log('6) Fin de Shabat (Havdalah):', Zmanim.formatISOWithTimeZone(tzid, tzet));

  console.log('---');
}

// Obtener zmanim para cada día de esta semana (por ejemplo, hoy y los próximos 6 días)
const today = new Date();
for (let i = 0; i < 7; i++) {
  const date = new Date(today);
  date.setDate(today.getDate() + i);
  printZmanim(date);
}