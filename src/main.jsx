import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";
import AppContent from "@/app/App.jsx";
import AppProviders from "@/app/providers/AppProviders.jsx";
import { ThemeProvider } from '@mui/material'
import theme from './shared/theme/theme.js'

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <AppProviders>
        <AppContent />
      </AppProviders>
    </ThemeProvider>
  </StrictMode>,
);