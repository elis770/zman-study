# Carpeta `data`

Esta carpeta es el núcleo de la lógica de datos y negocio de la aplicación. Contiene todos los hooks personalizados, contextos y utilidades responsables de obtener, transformar y gestionar los datos que se muestran en la interfaz de usuario.

## Contenido

- **Hooks de Datos (`use...`)**: Hooks de React que encapsulan la lógica para buscar datos de fuentes externas (como APIs de Sefaria o Hebcal) o para procesar datos internos. Por ejemplo, `useHayomYom`, `useHebrewDate`, y `useSpecialDay`.

- **Contextos de Datos (`DataContext`, `AppContext`)**: Proveedores de contexto que hacen que los datos obtenidos estén disponibles en todo el árbol de componentes, evitando la necesidad de pasar props a través de múltiples niveles.

- **Configuraciones**: Archivos de configuración que definen parámetros para la obtención o presentación de datos, como `specialDaysConfig.js`.

- **Transformadores y Utilidades**: Funciones que procesan, formatean o transforman los datos crudos en el formato que la aplicación necesita para su visualización (ej. `studyTransformers.js`).

En resumen, cualquier archivo relacionado con "qué" datos mostrar y "de dónde" obtenerlos, reside aquí.