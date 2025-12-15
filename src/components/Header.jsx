import { useEffect, useState } from "react";
import { Box, Typography, IconButton, useTheme } from "@mui/material";
import { Star, User, Settings } from "lucide-react";
import { MapPin } from "lucide-react";
import { SettingsSheet } from "./SettingsSheet";
import { AboutProjectDialog } from "./AboutProjectDialog";
import { AboutMeDialog } from "./AboutMeDialog";
import { useSettings } from "./SettingsContext";
import { motion, AnimatePresence } from "motion/react";

import { useAppData } from '@/shared/hooks/useAppData.js';

export function Header() {
  const theme = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showHebrewDate, setShowHebrewDate] = useState(false);
  const [aboutProjectOpen, setAboutProjectOpen] = useState(false);
  const [aboutMeOpen, setAboutMeOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  //const { city, timezone } = useSettings();
  const {
    time: {
      formattedDate,
      time,
      tzid,
      city,
      country,
      hebrewDate,
      loading: loadingGeo,
      dayDifference,
    } = {}
  } = useAppData();

  // Update time every second
  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setCurrentTime(new Date());
  //   }, 1000);
  //   return () => clearInterval(timer);
  // }, []);

  // Switch between Spanish and Hebrew date every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setShowHebrewDate((prev) => !prev);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('es-CO', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: false 
    });
  };

  const formatGregorianDate = (date) => {
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Mock Hebrew date - in production, this would come from a Hebrew calendar library
  // const hebrewDate = "כ״ח אלול תשפ״ה";

  return (
    <>
      <Box 
        component="header" 
        sx={{ 
          width: '100%', 
          height: '33vh',
          minHeight: '250px',
          backgroundColor: theme.custom.colors.glass.background, 
          backdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${theme.custom.colors.border.main}`, 
          position: 'sticky', 
          top: 0, 
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* Main content container */}
        <Box 
          sx={{ 
            maxWidth: '1280px',
            width: '100%',
            px: { xs: 2, sm: 3, lg: 4 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 4
          }}
        >
          {/* Empty space for balance (optional) */}
          <Box sx={{ flex: '0 0 auto', width: { xs: 0, md: '120px' } }} />

          {/* Center: Time and Date */}
          <Box 
            sx={{ 
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {/* Time display */}
            <Typography 
              sx={{ 
                color: theme.palette.text.primary, 
                letterSpacing: '0.05em', 
                fontSize: { xs: '3rem', sm: '4rem', md: '5rem' }, 
                fontWeight: 700, 
                fontVariantNumeric: 'tabular-nums',
                lineHeight: 1,
                mb: 2
              }}
            >
              {time}
            </Typography>

            {/* Date display with animation */}
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                minWidth: { xs: '300px', sm: '400px' },
                height: '32px',
                mb: 1 
              }}
            >
              <AnimatePresence mode="wait">
                {showHebrewDate ? (
                  <motion.div
                    key="hebrew"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}
                  >
                    <Typography 
                      className="hebrew-text" 
                      sx={{ color: theme.palette.text.primary, fontSize: '1.25rem', fontWeight: 600 }}
                    >
                      {hebrewDate}
                    </Typography>
                  </motion.div>
                ) : (
                  <motion.div
                    key="gregorian"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}
                  >
                    <Typography 
                      sx={{ color: theme.palette.text.primary, fontSize: '1.25rem', textTransform: 'capitalize' }}
                    >
                      {formattedDate}
                    </Typography>
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

          {/* Right: Buttons stacked vertically */}
          <Box 
            sx={{ 
              flex: '0 0 auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              alignItems: 'flex-end'
            }}
          >
            <IconButton
              onClick={() => setAboutProjectOpen(true)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                color: theme.palette.text.primary,
                '&:hover': { backgroundColor: theme.custom.colors.border.light }
              }}
            >
              <Star style={{ width: '20px', height: '20px', fill: theme.palette.secondary.main }} />
              {/* <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, display: { xs: 'none', sm: 'inline' } }}>
                KosherClock
              </Typography> */}
            </IconButton>

            <IconButton
              onClick={() => setAboutMeOpen(true)}
              sx={{
                color: theme.palette.text.primary,
                '&:hover': { backgroundColor: theme.custom.colors.border.light }
              }}
            >
              <User style={{ width: '20px', height: '20px' }} />
            </IconButton>
            
            <IconButton
              onClick={() => setSettingsOpen(true)}
              sx={{
                color: theme.palette.text.primary,
                '&:hover': { backgroundColor: theme.custom.colors.border.light }
              }}
            >
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