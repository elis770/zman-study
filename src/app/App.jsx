import { Header } from "../modules/header/Header";
import MainCardCarousel from "../modules/mainCard/MainCardCarousel";
import { Box, useTheme } from "@mui/material";

export default function App() {
  const theme = useTheme();
  const gradient = theme.custom?.colors?.background?.gradient;
  const backgroundStyle = gradient
    ? { background: `linear-gradient(to bottom, ${gradient[0]}, ${gradient[1]})` }
    : { backgroundColor: theme.palette.background.default };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      ...backgroundStyle,
      overflow: 'hidden'
    }}>
      <Header />
      <Box
        component="main"
        sx={{
          flex: 1,
          maxWidth: '1600px',
          mx: 'auto',
          px: { xs: 2, sm: 3, lg: 4 },
          py: 2,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'center',
          alignItems: { xs: 'stretch', md: 'center' },
          width: '100%',
          gap: 3,
          overflowY: { xs: 'auto', md: 'hidden' },
          overflowX: 'hidden'
        }}
      >
        <Box sx={{ width: { xs: '100%', md: '90%' }, maxWidth: '1300px', display: 'flex', justifyContent: 'center' }}>
          {/* Unified MainCardCarousel handles two boxes internally (responsive). */}
          <MainCardCarousel />
        </Box>
      </Box>
    </Box>
  );
}