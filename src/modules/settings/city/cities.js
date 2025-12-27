import cityTimezones from 'city-timezones';

// Create a more descriptive city name that includes the country
const allCitiesWithCountry = cityTimezones.cityMapping.map(city => {
  // Some entries might just have a city, so handle that.
  if (city.country) {
    return `${city.city}, ${city.country}`;
  }
  return city.city;
}).sort();


// Remove duplicates using a Set and spread back to an array
export const cityList = [...new Set(allCitiesWithCountry)];
