# Carpeta `shared`

Esta carpeta contiene código, componentes y utilidades que son genéricos y reutilizables en toda la aplicación. El código aquí no está atado a ninguna característica o módulo específico.

## Propósito

El objetivo principal es la reutilización y la consistencia. Al centralizar estos elementos compartidos, evitamos la duplicación de código y aseguramos que ciertas funcionalidades se comporten de la misma manera en toda la aplicación.

## Contenido

- **Hooks Genéricos (`hooks`)**: Hooks de React personalizados que encapsulan lógica común y reutilizable, como `usePersistentState` para guardar y recuperar estado del `localStorage`.

- **Tema (`theme`)**: Contiene la configuración del tema de la aplicación (colores, tipografía, etc.) utilizando Material-UI, y el hook `useTheme` para acceder a él.

- **Traducciones (`traslantions`)**: Lógica para la internacionalización (i18n) de la aplicación, incluyendo el `LanguageContext` y el hook `useLanguage` para gestionar el idioma actual.

- **Utilidades Generales**: Cualquier otra función o componente que pueda ser útil en múltiples lugares, como componentes de UI muy genéricos (botones, modales, etc.) o funciones de formato.