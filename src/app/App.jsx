import { Header } from "../components/Header";
import { MainCardCarousel } from "../components/MainCardCarousel";
import { Box } from "@mui/material";

export default function App() {
  return (
    <Box sx={{ minHeight: '100vh', pb: 12, background: 'linear-gradient(to bottom, #f5efe3, #e8dcc3)' }}>
      <Header />
      <Box component="main" sx={{ maxWidth: '1280px', mx: 'auto', px: { xs: 2, sm: 3, lg: 4 }, py: 4 }}>
        {/* Main Clock Card Carousel */}
        <Box sx={{ maxWidth: '672px', mx: 'auto', mb: 4 }}>
          {/* <MainCardCarousel /> */} <div> hola </div>
        </Box>
      </Box>
    </Box>
  );
}