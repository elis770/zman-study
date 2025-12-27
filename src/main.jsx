import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";
import AppContent from "@/app/App.jsx";
import AppProviders from "@/app/providers/AppProviders.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppProviders>
      <AppContent />
    </AppProviders>
  </StrictMode>
);