import { useEffect, useState } from "react";
import { Box, Typography, IconButton, useTheme } from "@mui/material";
import { Star, User, Settings } from "lucide-react";
import { MapPin } from "lucide-react";
import { SettingsSheet } from "./SettingsSheet";
import { SettingsSheet2 } from "./SettingsSheet2";
import { AboutProjectDialog } from "./AboutProjectDialog";
import { AboutMeDialog } from "./AboutMeDialog";
import { motion, AnimatePresence } from "motion/react";

import { useAppData } from '@/shared/hooks/useAppData.js';

export function Header() {
  const theme = useTheme();
  const [showHebrewDate, setShowHebrewDate] = useState(false);
  const [aboutProjectOpen, setAboutProjectOpen] = useState(false);
  const [aboutMeOpen, setAboutMeOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { time: { formattedDate, time, tzid, city, hebrewDate, } = {} } = useAppData();

  useEffect(() => {
    const interval = setInterval(() => {
      setShowHebrewDate((prev) => !prev);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Box component="header" sx={{ width: '100%', height: { xs: '96px', sm: '120px' }, backgroundColor: theme.custom.colors.glass.background, backdropFilter: 'blur(12px)', borderBottom: `1px solid ${theme.custom.colors.border.main}`, position: 'sticky', top: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Main content container */}
        <Box sx={{ maxWidth: '1280px', width: '100%', px: { xs: 2, sm: 3, lg: 4 }, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
          {/* Empty space for balance (optional) */}
          <Box sx={{ flex: '0 0 auto', width: { xs: 0, md: '120px' } }} />

          {/* Center: Time and Date/Location side-by-side */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: { xs: 2, sm: 4 } }}>
            {/* Time display */}
            <Typography sx={{ color: theme.palette.text.primary, letterSpacing: '0.05em', fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' }, fontWeight: 700, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
              {time}
            </Typography>

            {/* Date and Location stacked Column */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
              {/* Date display with animation */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', minWidth: '200px', height: '32px' }}>
                <AnimatePresence mode="wait">
                  {showHebrewDate ? (
                    <motion.div key="hebrew" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.5 }} style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
                      <Typography className="hebrew-text" sx={{ color: theme.palette.text.primary, fontSize: '1.1rem', fontWeight: 600 }}>{hebrewDate}</Typography>
                    </motion.div>
                  ) : (
                    <motion.div key="gregorian" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.5 }} style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
                      <Typography sx={{ color: theme.palette.text.primary, fontSize: '1.1rem', textTransform: 'capitalize' }}>{formattedDate}</Typography>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Box>

              {/* Location info */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: theme.custom.colors.text.quaternary }}>
                <MapPin style={{ width: '14px', height: '14px' }} />
                <Typography sx={{ fontSize: '0.75rem' }}>
                  {city} • {tzid}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Right: Buttons horizontal */}
          <Box sx={{ flex: '0 0 auto', display: 'flex', flexDirection: 'row', gap: 0.5, alignItems: 'center' }}>
            <IconButton onClick={() => setAboutProjectOpen(true)} sx={{ color: theme.palette.text.primary, '&:hover': { backgroundColor: theme.custom.colors.border.light } }}>
              <Star style={{ width: '20px', height: '20px', fill: theme.palette.secondary.main }} />
            </IconButton>

            <IconButton onClick={() => setAboutMeOpen(true)} sx={{ color: theme.palette.text.primary, '&:hover': { backgroundColor: theme.custom.colors.border.light } }}>
              <User style={{ width: '20px', height: '20px' }} />
            </IconButton>

            <IconButton onClick={() => setSettingsOpen(true)} sx={{ color: theme.palette.text.primary, '&:hover': { backgroundColor: theme.custom.colors.border.light } }}>
              <Settings style={{ width: '20px', height: '20px' }} />
            </IconButton>

            <SettingsSheet isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
          </Box>
        </Box>
      </Box>

      {/* Dialogs */}
      <AboutProjectDialog open={aboutProjectOpen} onClose={() => setAboutProjectOpen(false)} />
      <AboutMeDialog open={aboutMeOpen} onClose={() => setAboutMeOpen(false)} />
    </>
  );
}