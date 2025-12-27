# Carpeta `modules`

Esta carpeta contiene los principales componentes de la interfaz de usuario que actúan como "módulos" o "características" de la aplicación. Cada subcarpeta representa una sección visualmente distinta y funcional de la aplicación.

## Estructura

- **Componentes de Alto Nivel**: Cada módulo (como `header`, `mainCard`, `settings`) agrupa componentes más pequeños para construir una parte significativa de la interfaz. Por ejemplo, `mainCard` contiene el carrusel y los diferentes tipos de tarjetas que se muestran en él.

- **Lógica de Módulo**: A menudo, estos módulos tienen su propia lógica interna, gestionan su estado local y utilizan los hooks de la carpeta `data` para obtener la información que necesitan mostrar.

- **Componentes de UI Reutilizables (locales)**: Dentro de un módulo, puede haber una carpeta `ui` o `components` para piezas más pequeñas que solo se reutilizan dentro de ese módulo específico.

En esencia, esta carpeta define "cómo" se estructura y se presenta la información al usuario en las diferentes secciones de la aplicación.