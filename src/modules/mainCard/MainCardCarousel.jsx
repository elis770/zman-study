import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, Box, Typography, IconButton, useTheme, useMediaQuery } from "@mui/material";
import { Clock, BookOpen, Scroll, CloudSun } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useSettings } from "../settings/context/SettingsContext";
import { useLanguage } from '@/shared/traslantions/useLanguage.js';

import { useListCards } from "./cards/hooks/useListCards";
import { useTextCards } from "./cards/hooks/useTextCards";
import { useTimeCards } from "./cards/hooks/useTimeCards";
import { useAvisosCards } from "./cards/hooks/useAvisosCards";
import { GenericCard, CardItemList } from "./cards/ui/CardComponents";
import { WeatherApp } from "./cards/ui/WeatherApp.jsx";

// InnerCarousel renders a carousel for a given ordered list of card ids
function InnerCarousel({ ids, carouselInterval, registerCard, visibleCards, scrollSpeed, t, dataSources }) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const theme = useTheme();
  const { showDots, showArrows } = useSettings();

  // Build card configs from dataSources using a definition map to avoid repetition
  const cardConfigs = useMemo(() => {
    const { zmanimCards, studyCards, hayomYomData, minianimCards, avisosCards, seiderCards } = dataSources;

    const defs = [
      {
        id: 'zmanim',
        titleKey: 'NEXT_ZMANIM',
        icon: Clock,
        hasData: () => zmanimCards?.length > 0,
        renderContent: () => <CardItemList data={zmanimCards} />
      },
      {
        id: 'study',
        titleKey: 'STUDY_TITLE',
        icon: BookOpen,
        hasData: () => studyCards?.length > 0,
        renderContent: () => <CardItemList data={studyCards} />
      },
      {
        id: 'hayom-yom',
        titleKey: 'HAIOM_IOM_TITLE',
        icon: Scroll,
        hasData: () => !!hayomYomData,
        renderContent: () => (
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            pb: 2,
            backgroundColor: theme.custom?.colors?.glass?.backgroundAlt || 'action.hover',
            borderRadius: '8px',
            p: 2
          }}>
            <Typography
              className="hebrew-text"
              sx={{
                color: theme.palette.text.primary,
                fontSize: '1.2rem',
                whiteSpace: 'pre-wrap',
                textAlign: 'right',
                lineHeight: 1.6
              }}
            >
              {hayomYomData?.text}
            </Typography>
          </Box>
        )
      },
      {
        id: 'minian',
        titleKey: 'MINIAN_TITLE',
        icon: Clock,
        hasData: () => minianimCards?.length > 0,
        renderContent: () => <CardItemList data={minianimCards} />
      },
      {
        id: 'seider',
        titleKey: 'SEIDER_TITLE',
        icon: Clock,
        hasData: () => seiderCards?.length > 0,
        renderContent: () => <CardItemList data={seiderCards} />
      },
      {
        id: 'avisos',
        titleKey: 'AVISOS_TITLE',
        icon: Scroll,
        hasData: () => avisosCards?.length > 0,
        renderContent: () => <CardItemList data={avisosCards} />
      },
      {
        id: 'weather',
        titleKey: 'WEATHER_TITLE',
        icon: CloudSun,
        hasData: () => true,
        renderContent: () => <WeatherApp isCard={true} />
      }
    ];

    return defs
      .filter(def => ids.includes(def.id) && def.hasData())
      .map(def => ({
        id: def.id,
        title: t(def.titleKey),
        icon: def.icon,
        component: (
          <GenericCard
            id={def.id}
            title={t(def.titleKey)}
            icon={def.icon}
            interval={carouselInterval}
            speedFactor={scrollSpeed}
            content={<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pb: 2 }}>{def.renderContent()}</Box>}
          />
        )
      }));
  }, [ids, dataSources, carouselInterval, scrollSpeed, t]);

  /* // Register cards whenever configs change to ensure all discovered cards are known by settings
  useEffect(() => {
    if (cardConfigs.length > 0) {
      cardConfigs.forEach(config => registerCard(config.id, config.title, config.icon));
    }
  }, [cardConfigs, registerCard]); */

  // Register on mount
  useEffect(() => {
    cardConfigs.forEach(config => registerCard(config.id, config.title, config.icon));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const visibleCardConfigs = cardConfigs.filter(config => visibleCards[config.id] !== false);
  const cards = visibleCardConfigs.map(config => ({ id: config.id, component: config.component }));

  /* useEffect(() => {
    if (currentCardIndex >= cards.length) setCurrentCardIndex(0);
    if (cards.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentCardIndex((prev) => (prev + 1) % cards.length);
    }, carouselInterval * 1000);

    return () => clearInterval(interval);
  }, [carouselInterval, cards.length]); */

  useEffect(() => {
    if (currentCardIndex >= cards.length) setCurrentCardIndex(0);
    if (cards.length <= 1) return;
    const interval = setInterval(() => setCurrentCardIndex((prev) => (prev + 1) % cards.length), carouselInterval * 1000);
    return () => clearInterval(interval);
  }, [carouselInterval, cards.length]); // Removed currentCardIndex to prevent timer reset on every slide

  const handleDotClick = (index) => setCurrentCardIndex(index);
  const handleNext = () => setCurrentCardIndex((prev) => (prev + 1) % cards.length);
  const handlePrev = () => setCurrentCardIndex((prev) => (prev - 1 + cards.length) % cards.length);

  const activeCard = cards.length > 0
    ? (cards[currentCardIndex] || cards[0])
    : {
      id: 'empty', component: (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography sx={{ color: theme.palette.text.secondary || 'inherit', fontSize: '1.1rem' }}>
            No hay tarjetas visibles. Activa al menos una en Configuración.
          </Typography>
        </Box>
      )
    };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {showDots && cards.length > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
          {cards.map((card, index) => (
            <IconButton
              key={card.id}
              onClick={() => handleDotClick(index)}
              sx={{
                width: index === currentCardIndex ? '32px' : '8px',
                height: '8px',
                borderRadius: '9999px',
                backgroundColor: index === currentCardIndex ? theme.palette.primary.main : theme.custom?.colors?.border?.main,
                transition: 'all 0.3s',
                padding: 0,
                minWidth: 0
              }}
              aria-label={`Ir a tarjeta ${index + 1}`}
            />
          ))}
        </Box>
      )}

      <Card sx={{
        background: theme.custom?.colors?.glass?.cardGradient || theme.palette.background.paper,
        backdropFilter: 'blur(8px)',
        border: `1px solid ${theme.custom?.colors?.border?.main || theme.palette.divider}`,
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
        borderRadius: '16px',
        overflow: 'hidden',
        mt: 1,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}>

        {/* Arrow Buttons */}
        {showArrows && cards.length > 1 && (
          <>
            <IconButton
              onClick={handlePrev}
              sx={{
                position: 'absolute',
                left: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.9)',
                color: 'text.primary',
                '&:hover': { backgroundColor: 'primary.main', color: 'white' },
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}
            >
              ←
            </IconButton>
            <IconButton
              onClick={handleNext}
              sx={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.9)',
                color: 'text.primary',
                '&:hover': { backgroundColor: 'primary.main', color: 'white' },
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}
            >
              →
            </IconButton>
          </>
        )}

        <CardContent sx={{ padding: 0, flex: 1, display: 'grid', overflow: 'hidden' }}>
          <AnimatePresence initial={false}>
            <motion.div
              key={activeCard ? activeCard.id : 'empty'}
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0, zIndex: 1 }}
              exit={{ opacity: 0, x: -300, zIndex: 0 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              style={{
                gridArea: '1 / 1', // Stack on top of each other
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {activeCard ? activeCard.component : null}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </Box>
  );
}

export default function MainCardCarouselUnified() {
  const settings = useSettings();
  const { carouselInterval, registerCard, visibleCards, scrollSpeed, carouselLayout } = settings;
  const { t } = useLanguage();

  // Responsive hooks
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));

  // data sources
  const { zmanimCards, studyCards } = useListCards();
  const { hayomYomData } = useTextCards();
  const { minianimCards, seiderCards } = useTimeCards();
  const { avisosCards } = useAvisosCards();

  const dataSources = { zmanimCards, studyCards, hayomYomData, minianimCards, seiderCards, avisosCards };

  // Normalize layout to array (handle legacy object format from localStorage)
  const columns = useMemo(() => {
    let baseColumns = [];
    if (Array.isArray(carouselLayout)) {
      baseColumns = carouselLayout;
    } else {
      // Fallback / Legacy
      baseColumns = [
        { id: 'left', cards: carouselLayout?.left || ['zmanim', 'study'], width: 40 },
        { id: 'right', cards: carouselLayout?.right || ['minian', 'avisos'], width: 40 }
      ];
    }

    // Create effective columns based on screen size by merging content
    if (isMobile) {
      // Merge ALL columns into one
      const allCards = baseColumns.flatMap(col => col.cards);
      return [{ ...baseColumns[0] || { id: 'merged', width: 100 }, cards: allCards }];
    } else if (isTablet) {
      // Keep first column, merge rest into second
      if (baseColumns.length <= 1) return baseColumns;
      const firstCol = baseColumns[0];
      const restCards = baseColumns.slice(1).flatMap(col => col.cards);
      return [firstCol, { ...(baseColumns[1] || { id: 'merged-right', width: 50 }), cards: restCards }];
    }

    return baseColumns;
  }, [carouselLayout, isMobile, isTablet]);

  // Calculate if we need reduced height (>3 columns)
  const shouldReduceHeight = columns.length > 3;

  return (
    <Box sx={{
      width: { xs: '80%', sm: '90%' },
      maxWidth: '1800px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' },
      flexWrap: { xs: 'nowrap', md: shouldReduceHeight ? 'wrap' : 'nowrap' },
      gap: 2,
      alignItems: 'stretch',
      justifyContent: 'center'
    }}>
      {columns.map((col, index) => {
        return (
          <Box
            key={col.id}
            sx={{
              // Relative width based on col.width percentage
              width: {
                xs: '100%',
                md: shouldReduceHeight ? `calc(${col.width}% - 8px)` : `${col.width}%`
              },
              height: {
                xs: 'auto',
                md: shouldReduceHeight ? '50vh' : 'auto'
              },
              minWidth: 0,
              display: 'block' // Always block because `columns` is already filtered/merged
            }}
          >
            <InnerCarousel
              ids={col.cards}
              carouselInterval={carouselInterval}
              registerCard={registerCard}
              visibleCards={visibleCards}
              scrollSpeed={scrollSpeed}
              t={t}
              dataSources={dataSources}
            />
          </Box>
        );
      })}
    </Box>
  );
}