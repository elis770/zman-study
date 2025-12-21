import { useEffect, useState } from "react";
import { Box, Typography, IconButton, useTheme } from "@mui/material";
import { Star, User, Settings } from "lucide-react";
import { MapPin } from "lucide-react";
import { SettingsSheet } from "./SettingsSheet";
import { AboutProjectDialog } from "../modules/AboutProyect/AboutProjectDialog";
import { AboutMeDialog } from "../modules/AboutMe/AboutMeDialog";
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
      <Box component="header" sx={{
        width: '100%',
        height: { xs: 'auto', sm: '120px' },
        minHeight: { xs: '180px', sm: '120px' },
        backgroundColor: theme.custom.colors.glass.background,
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${theme.custom.colors.border.main}`,
        position: 'sticky',
        top: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: { xs: 2, sm: 0 }
      }}>
        {/* Main content container */}
        <Box sx={{
          maxWidth: '1280px',
          width: '100%',
          px: { xs: 1.5, sm: 2, md: 4 },
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: { xs: 0.5, sm: 1.5, md: 4 }
        }}>

          {/* Mobile: Icons Row (Top) / Desktop: Empty space or part of flex layout */}
          <Box sx={{
            order: { xs: 1, sm: 3 },
            display: 'flex',
            flexDirection: 'row',
            gap: 0.5,
            alignItems: 'center',
            width: { xs: '100%', sm: 'auto' },
            justifyContent: { xs: 'center', sm: 'flex-end' }
          }}>
            <IconButton onClick={() => setAboutProjectOpen(true)} sx={{ color: theme.palette.text.primary, '&:hover': { backgroundColor: theme.custom.colors.border.light }, p: { xs: 1, sm: 1.5 } }}>
              <Star style={{ width: '22px', height: '22px', fill: theme.palette.secondary.main }} />
            </IconButton>

            <IconButton onClick={() => setAboutMeOpen(true)} sx={{ color: theme.palette.text.primary, '&:hover': { backgroundColor: theme.custom.colors.border.light }, p: { xs: 1, sm: 1.5 } }}>
              <User style={{ width: '22px', height: '22px' }} />
            </IconButton>

            <IconButton onClick={() => setSettingsOpen(true)} sx={{ color: theme.palette.text.primary, '&:hover': { backgroundColor: theme.custom.colors.border.light }, p: { xs: 1, sm: 1.5 } }}>
              <Settings style={{ width: '22px', height: '22px' }} />
            </IconButton>

            <SettingsSheet isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
          </Box>

          {/* Time Display - Mobile: Middle, Desktop: Center */}
          <Box sx={{
            order: { xs: 2, sm: 2 },
            flex: 1,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'center',
            gap: { xs: 0, sm: 1.5, md: 4 },
            textAlign: 'center'
          }}>
            <Typography sx={{
              color: theme.palette.text.primary,
              letterSpacing: '0.05em',
              fontSize: { xs: '8vh', sm: '3rem', md: '4.5rem' },
              fontWeight: 700,
              fontVariantNumeric: 'tabular-nums',
              lineHeight: 1
            }}>
              {time}
            </Typography>

            {/* Date and Location - Mobile: Bottom, Desktop: Side of time */}
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: { xs: 'center', sm: 'flex-start' },
              justifyContent: 'center',
              mt: { xs: 0.5, sm: 0 }
            }}>
              {/* Date display with animation */}
              <Box sx={{ display: 'flex', justifyContent: { xs: 'center', sm: 'flex-start' }, alignItems: 'center', minWidth: { xs: '100%', sm: '180px', md: '200px' }, height: '32px' }}>
                <AnimatePresence mode="wait">
                  {showHebrewDate ? (
                    <motion.div key="hebrew" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.5 }} style={{ display: 'flex', justifyContent: 'inherit', alignItems: 'center', width: '100%' }}>
                      <Typography className="hebrew-text" sx={{ color: theme.palette.text.primary, fontSize: { xs: '1rem', sm: '1.1rem' }, fontWeight: 600 }}>{hebrewDate}</Typography>
                    </motion.div>
                  ) : (
                    <motion.div key="gregorian" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.5 }} style={{ display: 'flex', justifyContent: 'inherit', alignItems: 'center', width: '100%' }}>
                      <Typography sx={{ color: theme.palette.text.primary, fontSize: { xs: '1rem', sm: '1.1rem' }, textTransform: 'capitalize' }}>{formattedDate}</Typography>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Box>

              {/* Location info */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: theme.custom.colors.text.quaternary }}>
                <MapPin style={{ width: '12px', height: '12px' }} />
                <Typography sx={{ fontSize: '0.7rem' }}>
                  {city} • {tzid}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Desktop Left Spacer */}
          <Box sx={{
            order: 0,
            flex: '0 0 auto',
            width: { xs: 0, sm: 0, md: '120px' },
            display: { xs: 'none', md: 'block' }
          }} />
        </Box>
      </Box>

      {/* Dialogs */}
      <AboutProjectDialog open={aboutProjectOpen} onClose={() => setAboutProjectOpen(false)} />
      <AboutMeDialog open={aboutMeOpen} onClose={() => setAboutMeOpen(false)} />
    </>
  );
}