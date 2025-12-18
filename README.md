# KosherClock 🕰️

**KosherClock** es una aplicación moderna y receptiva diseñada para la comunidad judía, proporcionando horarios precisos de Zmanim, estudios diarios (Chumash, Tehilim, Tanya, etc.) y avisos personalizados en una interfaz elegante y dinámica.

## 🚀 Instalación y Uso

Para obtener una copia local del proyecto y ejecutarlo, sigue estos pasos:

### 1. Clonar el repositorio
```bash
git clone https://github.com/elis770/zman-study.git
```

### 2. Instalar dependencias
Entra en la carpeta del proyecto y ejecuta:
```bash
npm install
```

### 3. Ejecutar en modo desarrollo
```bash
npm run dev
```

### 4. Construir para producción
```bash
npm run build
```

---

## ⚙️ Configuración y Claves (State)

La aplicación utiliza un sistema de persistencia local (`localStorage`) para mantener tus preferencias. Aquí se detallan las claves principales gestionadas en el `SettingsContext`:

| Clave | Descripción | Valores por defecto |
|-------|-------------|---------------------|
| `userCity` | Ciudad seleccionada para los cálculos | `"Buenos Aires"` |
| `timezone` | Zona horaria de la ubicación | `"America/Argentina/Buenos_Aires"` |
| `timeFormat` | Formato de hora (12h o 24h) | `"24h"` |
| `carouselInterval` | Tiempo (en segundos) entre rotación de tarjetas | `5` |
| `scrollSpeed` | Velocidad del auto-scroll interno de las tarjetas | `2.6` |
| `visibleZmanim` | Objeto con visibilidad de horarios (Netz, Shema, etc.) | Ver `defaultZmanim` |
| `visibleEstudios` | Objeto con visibilidad de estudios (Jumash, Rambam, etc.) | Ver `defaultEstudios` |
| `visibleSections` | Secciones visibles en la interfaz principal | Ver `defaultSections` |
| `showMinian` | Alternar visualización de la sección de Minyanim | `true` |
| `showHayomYom` | Alternar visualización de la tarjeta Hayom Yom | `true` |
| `minianimList` | Lista de horarios de rezos personalizados | `[]` |
| `customAvisos` | Lista de eventos o avisos creados por el usuario | `[]` |

---

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Si tienes ideas para mejorar la aplicación, corregir errores o agregar nuevas funcionalidades:

1. Realiza un **Fork** del proyecto.
2. Crea una **Rama** para tu mejora (`git checkout -b feature/NuevaMejora`).
3. Haz un **Commit** de tus cambios (`git commit -m 'Añadir nueva funcionalidad'`).
4. Haz un **Push** a la rama (`git push origin feature/NuevaMejora`).
5. Abre un **Pull Request**.

Si encuentras algún problema o tienes alguna sugerencia, no dudes en abrir un **Issue**.

---

## 🛠️ Tecnologías utilizadas

- **React + Vite**: Para una interfaz rápida y moderna.
- **Material UI (MUI)**: Sistema de componentes y diseño.
- **Motion (Framer Motion)**: Animaciones fluidas y transiciones.
- **Hebcal API**: Cálculos precisos de Zmanim y fechas hebreas.
- **Sefaria API**: Integración de textos sagrados y estudios diarios.

---

Desarrollado con ❤️ para servir a la comunidad judia.