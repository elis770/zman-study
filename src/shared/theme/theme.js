import { createTheme, alpha } from '@mui/material/styles';

const baseTypography = {
  fontFamily: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
  ].join(','),
};

const baseComponents = {
  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: 'none',
        borderRadius: '8px',
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: '16px',
      }
    }
  }
};

const themeConfigs = {
  beige: {
    primary: '#8b7355',
    secondary: '#bca886',
    background: '#f5efe3',
    paper: '#ffffff',
    gradientEnd: '#e8dcc3',
  },
  violet: {
    primary: '#6b4fbb',
    secondary: '#9c27b0',
    background: '#f8f4ff',
    paper: '#ffffff',
    gradientEnd: '#ebd9ff',
  },
  blue: {
    primary: '#1976d2',
    secondary: '#64b5f6',
    background: '#f2f7fd',
    paper: '#ffffff',
    gradientEnd: '#dbeafe',
  },
  red: {
    primary: '#d32f2f',
    secondary: '#ef5350',
    background: '#fff5f5',
    paper: '#ffffff',
    gradientEnd: '#fde2e2',
  },
  green: {
    primary: '#2e7d32',
    secondary: '#66bb6a',
    background: '#f4fbf6',
    paper: '#ffffff',
    gradientEnd: '#dcf5e3',
  },
  orange: {
    primary: '#f57c00',
    secondary: '#ff9800',
    background: '#fff8f2',
    paper: '#ffffff',
    gradientEnd: '#ffe8d9',
  },
};

export const getTheme = (key, mode = 'light') => {
  const isDark = mode === 'dark';
  const config = themeConfigs[key] || themeConfigs.beige;

  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: config.primary,
      },
      secondary: {
        main: config.secondary,
      },
      background: {
        default: isDark ? '#000000' : config.background,
        paper: isDark ? '#121212' : '#ffffff',
      },
      text: {
        primary: isDark ? '#ffffff' : config.primary,
        secondary: isDark ? alpha('#ffffff', 0.7) : alpha(config.primary, 0.8),
      },
    },
    typography: baseTypography,
    components: baseComponents,
  });

  // Extensiones dinámicas para asegurar que TODO el tema cambie
  theme.custom = {
    colors: {
      background: {
        gradient: isDark 
          ? ['#000000', '#1a1a1a'] 
          : [config.background, config.gradientEnd],
      },
      glass: {
        background: isDark ? alpha('#1e1e1e', 0.9) : alpha('#ffffff', 0.95),
        backgroundAlt: isDark ? alpha('#1e1e1e', 0.95) : alpha('#ffffff', 0.8),
        cardGradient: isDark 
          ? `linear-gradient(to bottom right, ${alpha('#1e1e1e', 0.95)}, ${alpha('#000000', 0.9)})`
          : `linear-gradient(to bottom right, ${alpha('#ffffff', 0.95)}, ${alpha(config.background, 0.9)})`,
      },
      border: {
        main: isDark ? alpha('#ffffff', 0.1) : alpha(config.primary, 0.2),
        light: isDark ? alpha('#ffffff', 0.05) : alpha(config.primary, 0.1),
      },
      text: {
        primary: theme.palette.text.primary,
        secondary: theme.palette.text.secondary,
        tertiary: isDark ? alpha('#ffffff', 0.5) : alpha(config.primary, 0.7),
        quaternary: isDark ? alpha('#ffffff', 0.4) : alpha(config.primary, 0.5),
      }
    }
  };

  return theme;
};

export const themes = {
  beige: getTheme('beige', 'light'),
  violet: getTheme('violet', 'light'),
  blue: getTheme('blue', 'light'),
  red: getTheme('red', 'light'),
  green: getTheme('green', 'light'),
  orange: getTheme('orange', 'light'),
};

export default themes.beige;