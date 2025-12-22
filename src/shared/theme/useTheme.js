import { useState, useEffect } from 'react';

export const useTheme = () => {
  // 1. Estado para guardar el tema actual ('light' o 'dark')
  const [theme, setTheme] = useState('light');

  // 2. Función para cambiar el tema
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // 3. Efecto que se ejecuta cada vez que el tema cambia
  useEffect(() => {
    // Elimina la clase anterior y añade la nueva al body
    document.body.className = '';
    document.body.classList.add(theme);
  }, [theme]); // Se ejecuta solo cuando `theme` cambia

  // 4. El hook devuelve el tema actual y la función para cambiarlo
  return { theme, toggleTheme };
};