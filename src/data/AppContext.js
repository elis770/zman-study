import { createContext } from 'react';

// Separamos el contexto en su propio archivo para evitar problemas de HMR en Vite
// (Cuando un archivo exporta un componente y un objeto plano, Vite puede invalidar el estado)
export const AppContext = createContext(null);
