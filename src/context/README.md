# Carpeta `context`

Esta carpeta está dedicada a la gestión del estado global o compartido a través de la aplicación mediante la API de Context de React.

## Propósito

- **Proveedores de Estado Global**: Contiene los proveedores (`Provider`) y consumidores (`Consumer` o hooks personalizados) de contextos que necesitan ser accedidos por múltiples componentes en diferentes partes del árbol de la aplicación.

- **Evitar "Prop Drilling"**: El uso de contextos aquí ayuda a evitar pasar props a través de muchos niveles de componentes, haciendo el código más limpio y fácil de mantener.

## Contenido

- **Contextos Específicos**: Se definen contextos para gestionar áreas específicas del estado de la aplicación, como la configuración de Zmanim (`zmanimConfig.js`) o el estado relacionado con los estudios.

Cualquier estado que deba ser accesible globalmente o en componentes muy distantes entre sí debe gestionarse a través de un contexto definido en esta carpeta.