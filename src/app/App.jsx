import { Header } from "../components/Header";
import MainCardCarousel from "../components/MainCardCarousel";
import { Box } from "@mui/material";

export default function App() {
  return (
    <Box sx={{
      minHeight: '100vh', // Dynamic viewport height for mobile
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(to bottom, #f5efe3, #e8dcc3)',
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