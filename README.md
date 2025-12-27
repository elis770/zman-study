# TimTor - Time & Torah 🕰️

**TimTor** es una aplicación web moderna y completa diseñada para la comunidad judía. Su nombre, una fusión de "Time" (Tiempo) y "Torah", refleja su propósito central: integrar las práticas y estudios religiosos diarios con la vida moderna a través de la tecnología.

La aplicación proporciona horarios de Zmanim precisos, fechas del calendario hebreo, y acceso a estudios diarios como Chumash, Tehilim y Hayom Yom, todo presentado en una interfaz elegante, personalizable y fácil de usar.

## ✨ Funcionalidades Principales

- **Zmanim Precisos**: Cálculos automáticos de los horarios halájicos (Zmanim) basados en la ubicación del usuario.
- **Calendario Dual**: Muestra la fecha tanto en el calendario gregoriano como en el hebreo.
- **Estudios Diarios**: Incluye secciones de estudio diario como Hayom Yom, Chumash, Tehilim, Tanya y Rambam.
- **Avisos y Eventos**: Notificaciones sobre días especiales, ayunos, y eventos del calendario judío.
- **Alta Personalización**: Los usuarios pueden configurar su ubicación, formato de hora, y qué secciones y horarios desean ver.
- **Información Climática**: Muestra el clima actual de la ubicación seleccionada.
- **Interfaz Moderna**: Diseñada con un enfoque en la usabilidad y una experiencia de usuario fluida, incluyendo animaciones y un carrusel dinámico.

## 🛠️ Tecnologías Utilizadas

El proyecto está construido con un stack de tecnologías modernas para el desarrollo web:

- **Frontend**: React (con Vite) para una interfaz de usuario rápida y reactiva.
- **Componentes UI**: Material-UI (MUI) para un diseño consistente y accesible.
- **Animaciones**: Framer Motion para transiciones y animaciones fluidas.
- **APIs de Datos**:
  - **Hebcal**: Para los cálculos de Zmanim y fechas hebreas.
  - **Sefaria**: Para la obtención de textos sagrados y estudios diarios.

## 🚀 Cómo Empezar

Sigue estos pasos para clonar, instalar y ejecutar el proyecto en tu máquina local.

### 1. Clonar el Repositorio
```bash
git clone https://github.com/elis770/zman-study.git
cd zman-study
```

### 2. Instalar Dependencias
El proyecto utiliza `npm` para gestionar sus paquetes. Ejecuta el siguiente comando para instalar todas las dependencias necesarias:
```bash
npm install
```

### 3. Ejecutar en Modo Desarrollo
Para iniciar el servidor de desarrollo local, que se actualizará automáticamente a medida que hagas cambios en el código:
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:5173` (o el puerto que indique la terminal).

### 4. Construir para Producción
Cuando estés listo para desplegar la aplicación, puedes crear una versión optimizada para producción con el siguiente comando:
```bash
npm run build
```
Los archivos finales se generarán en la carpeta `dist/`.

## ⚙️ A Tener en Cuenta

- **Gestión de Estado**: La aplicación utiliza React Context (`AppContext`, `SettingsContext`) para gestionar el estado global, como las preferencias del usuario y los datos obtenidos de las APIs.
- **Persistencia de Datos**: Las configuraciones del usuario (ciudad, Zmanim visibles, etc.) se guardan en el `localStorage` del navegador para mantener la consistencia entre sesiones. El hook `usePersistentState` abstrae esta lógica.
- **Estructura de Datos**: Los datos relacionados con Zmanim, estudios y avisos se obtienen a través de hooks personalizados (ej. `useHayomYom`, `useSefaria`) que encapsulan la lógica de fetching y transformación.
- **Estilo y Convenciones**: El código sigue las convenciones de React y JavaScript moderno. Se utiliza ESLint para mantener la calidad y consisténcia del código.

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Si tienes ideas para mejorar la aplicación, corregir errores o agregar nuevas funcionalidades, no dudes en abrir un **Pull Request** o un **Issue** en el repositorio.