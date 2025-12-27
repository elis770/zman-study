# Carpeta `app`

Esta carpeta contiene los componentes centrales que orquestan la estructura principal de la aplicación. Es el punto de entrada de la interfaz de usuario de React, donde se ensamblan los proveedores de contexto y el componente principal de la aplicación.

## Contenido

-   **`App.jsx`**: El componente raíz de la aplicación. Es el encargado de renderizar la disposición general de la interfaz de usuario, integrando los diferentes módulos y secciones.

-   **`providers/AppProviders.jsx`**: Este componente es crucial para la inicialización de la aplicación. Agrupa y envuelve la aplicación con todos los Context Providers necesarios (de `src/context`, `src/data`, `src/shared`, etc.), asegurando que el estado global y las funcionalidades compartidas estén disponibles para todos los componentes.

En resumen, esta carpeta define la "columna vertebral" de la aplicación, uniendo todas las partes y preparando el entorno para que funcionen correctamente.