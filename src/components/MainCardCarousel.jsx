import { useEffect, useState } from "react";
import { Card, CardContent, Box, Typography, IconButton } from "@mui/material";
import { Clock, BookOpen, Scroll } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useSettings } from "./SettingsContext";
import { useLanguage } from '@/shared/hooks/useLanguage.js';

import { useListCards } from "./cards/hooks/useListCards";
import { useTextCards } from "./cards/hooks/useTextCards";
import { GenericCard, CardItemList } from "./cards/ui/CardComponents";

export function MainCardCarousel() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const { carouselInterval, registerCard, visibleCards, scrollSpeed } = useSettings();
  const { t } = useLanguage();

  const { zmanimCards, studyCards } = useListCards();
  const { hayomYomData } = useTextCards();

  const cardConfigs = [];

  if (zmanimCards.length > 0) {
    cardConfigs.push({
      id: 'zmanim',
      title: t('NEXT_ZMANIM'),
      icon: Clock,
      component: (
        <GenericCard
          id="zmanim"
          title={t('NEXT_ZMANIM')}
          icon={Clock}
          interval={carouselInterval}
          speedFactor={scrollSpeed}
          content={
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pb: 2 }}>
              <CardItemList data={zmanimCards} />
            </Box>
          }
        />
      ),
    });
  }

  if (studyCards.length > 0) {
    cardConfigs.push({
      id: 'study',
      title: t('STUDY_TITLE'),
      icon: BookOpen,
      component: (
        <GenericCard
          id="study"
          title={t('STUDY_TITLE')}
          icon={BookOpen}
          interval={carouselInterval}
          speedFactor={scrollSpeed}
          content={
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pb: 2 }}>
              <CardItemList data={studyCards} />
            </Box>
          }
        />
      ),
    });
  }

  if (hayomYomData) {
    const hayomYomContent = (
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        pb: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: '8px',
        p: 2
      }}>
        <Typography
          className="hebrew-text"
          sx={{
            color: '#5d4037',
            fontSize: '1rem',
            whiteSpace: 'pre-wrap',
            textAlign: 'right',
            lineHeight: 1.6
          }}
        >
          {hayomYomData.text}
        </Typography>
      </Box>
    );

    cardConfigs.push({
      id: 'hayom-yom',
      title: t('HAIOM_IOM_TITLE') || 'Hayom Yom',
      icon: Scroll,
      component: (
        <GenericCard
          id="hayom-yom"
          title={t('HAIOM_IOM_TITLE') || 'Hayom Yom'}
          icon={Scroll}
          interval={carouselInterval}
          speedFactor={scrollSpeed}
          content={hayomYomContent}
        />
      ),
    });
  }

  // Register cards on mount
  useEffect(() => {
    cardConfigs.forEach(config => {
      registerCard(config.id, config.title, config.icon);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Filter cards based on visibility settings
  const visibleCardConfigs = cardConfigs.filter(config => visibleCards[config.id] !== false);

  // Generate cards array from visible configs
  const cards = visibleCardConfigs.map(config => ({
    id: config.id,
    component: config.component
  }));

  // Update carousel interval effect to use cards length
  useEffect(() => {
    // Reset index if out of bounds (e.g. cards removed via settings)
    if (currentCardIndex >= cards.length) {
      setCurrentCardIndex(0);
    }

    if (cards.length <= 1) return; // Don't auto-advance if only one card

    const interval = setInterval(() => {
      setCurrentCardIndex((prev) => (prev + 1) % cards.length);
    }, carouselInterval * 1000);

    return () => clearInterval(interval);
  }, [carouselInterval, cards.length, currentCardIndex]);

  const handleDotClick = (index) => {
    setCurrentCardIndex(index);
  };

  // Show message if no cards are visible
  if (cards.length === 0) {
    return (
      <Card
        sx={{
          background: 'linear-gradient(to bottom right, rgba(255, 255, 255, 0.8), rgba(232, 220, 195, 0.5))',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(188, 168, 134, 0.3)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          borderRadius: '16px',
          p: 4,
          textAlign: 'center'
        }}
      >
        <Typography sx={{ color: '#8b7355', fontSize: '1.25rem' }}>
          No hay tarjetas visibles. Activa al menos una en Configuración.
        </Typography>
      </Card>
    );
  }

  // Safe access for rendering
  const activeCard = cards[currentCardIndex] || cards[0];

  return (
    <Box>
      {/* Indicadores de página - solo mostrar si hay más de una card */}
      {cards.length > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
          {cards.map((card, index) => (
            <IconButton
              key={card.id}
              onClick={() => handleDotClick(index)}
              sx={{
                width: index === currentCardIndex ? '32px' : '8px',
                height: '8px',
                borderRadius: '9999px',
                backgroundColor: index === currentCardIndex ? '#bca886' : 'rgba(188, 168, 134, 0.3)',
                transition: 'all 0.3s',
                padding: 0,
                minWidth: 0,
                '&:hover': {
                  backgroundColor: index === currentCardIndex ? '#bca886' : 'rgba(188, 168, 134, 0.5)'
                }
              }}
              aria-label={`Ir a tarjeta ${index + 1} `}
            />
          ))}
        </Box>
      )}

      <Card
        sx={{
          background: 'linear-gradient(to bottom right, rgba(255, 255, 255, 0.8), rgba(232, 220, 195, 0.5))',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(188, 168, 134, 0.3)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          borderRadius: '16px',
          overflow: 'hidden',
          mt: 1
        }}
      >
        <CardContent sx={{ padding: 0 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCard ? activeCard.id : 'empty'}
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {activeCard ? activeCard.component : null}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </Box>
  );
}