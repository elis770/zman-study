import { useState, useEffect } from 'react';

const usePersistentState = (key, defaultValue) => {
  const [state, setState] = useState(() => {
    try {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : defaultValue;
    } catch (error) {
      console.error(`Error reading localStorage key “${key}”:`, error);
      return defaultValue;
    }
  });

  // Sync state with key changes (important for dynamic keys like weather_cache_${city})
  useEffect(() => {
    try {
      const storedValue = localStorage.getItem(key);
      if (storedValue) {
        setState(JSON.parse(storedValue));
      } else {
        setState(defaultValue);
      }
    } catch (error) {
      console.error(`Error syncing localStorage key “${key}”:`, error);
    }
  }, [key]);

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error(`Error setting localStorage key “${key}”:`, error);
    }
  }, [key, state]);

  return [state, setState];
};

export default usePersistentState;