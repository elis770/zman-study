import { createRoot } from "react-dom/client";
import AppContent from "@/app/App.jsx";
import AppProviders from "@/app/providers/AppProviders.jsx";
import "@/shared/styles/globals.css";

createRoot(document.getElementById("root")).render(
  <AppProviders>
    <AppContent />
  </AppProviders>
);