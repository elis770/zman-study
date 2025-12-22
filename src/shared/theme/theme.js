import { createTheme } from '@mui/material/styles';

// Color palette for KosherClock
const colors = {
  // Primary colors
  primary: {
    main: '#8b7355',      // Main brown color
    light: '#bca886',     // Light gold/tan
    dark: '#6b5845',      // Darker brown
  },
  
  // Secondary/accent colors
  secondary: {
    main: '#bca886',      // Gold/tan
    light: '#e8dcc3',     // Very light beige
    dark: '#a89876',      // Darker gold
  },
  
  // Background colors
  background: {
    default: '#f5efe3',   // Light cream
    paper: '#ffffff',     // White
    gradient: {
      start: '#f5efe3',
      end: '#e8dcc3',
    },
  },
  
  // Text colors
  text: {
    primary: '#8b7355',                    // Main text color
    secondary: 'rgba(139, 115, 85, 0.8)',  // Secondary text
    tertiary: 'rgba(139, 115, 85, 0.7)',   // Tertiary text
    quaternary: 'rgba(139, 115, 85, 0.6)', // Quaternary text
    disabled: 'rgba(139, 115, 85, 0.4)',   // Disabled text
  },
  
  // Border colors
  border: {
    main: 'rgba(188, 168, 134, 0.3)',
    light: 'rgba(188, 168, 134, 0.2)',
  },
  
  // Glass/backdrop effects
  glass: {
    background: 'rgba(255, 255, 255, 0.4)',
    backgroundAlt: 'rgba(255, 255, 255, 0.5)',
    backgroundDark: 'rgba(255, 255, 255, 0.8)',
    backgroundLight: 'rgba(255, 255, 255, 0.95)',
  },
};

// Create Material-UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: colors.primary.main,
      light: colors.primary.light,
      dark: colors.primary.dark,
    },
    secondary: {
      main: colors.secondary.main,
      light: colors.secondary.light,
      dark: colors.secondary.dark,
    },
    background: {
      default: colors.background.default,
      paper: colors.background.paper,
    },
    text: {
      primary: colors.text.primary,
      secondary: colors.text.secondary,
    },
  },
  
  // Custom theme extensions
  custom: {
    colors: colors,
  },
  
  // Typography customization
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  
  // Component overrides
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

export default theme;
export { colors };