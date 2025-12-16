import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { Card, CardContent, Box, Typography, IconButton } from "@mui/material";
import { MapPin, Clock, Sunrise, Sunset, BookOpen, Calendar, Moon, Star, Sun, Scroll, Scale, Gavel, Music, Heart } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useSettings } from "./SettingsContext";

import { useAppData } from '@/shared/hooks/useAppData.js';
import { useLanguage } from '@/shared/hooks/useLanguage.js';

export function MainCardCarousel() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const { carouselInterval, registerCard, visibleCards, scrollSpeed } = useSettings();

  const { study, zmanim } = useAppData();
  //console.log(zmanim)
  const { t } = useLanguage();

  // Configurations for Zmanim
  const zmanimConfig = {
    alotHaShachar: { titleKey: 'ALOT_HASHACHAR', icon: Sunrise },
    misheyakir: { titleKey: 'MISHEYAKIR', icon: Sun },
    sunrise: { titleKey: 'NETZ_HAJAMA', icon: Sunrise },
    sofZmanShma: { titleKey: 'SOF_SHEMA', icon: Clock },
    sofZmanShmaMGA: { titleKey: 'SOF_SHEMA_MGA', icon: Clock },
    sofZmanShmaGra: { titleKey: 'SOF_SHEMA', icon: Clock }, // Fallback to same key if specific Gra key missing, or add SOF_SHEMA_GRA if exists
    sofZmanTfilla: { titleKey: 'SOF_TFILA', icon: Clock },
    chatzot: { titleKey: 'CHATZOT', icon: Sun },
    minchaGedola: { titleKey: 'MINCHA_GEDOLA', icon: Sun },
    minchaKetana: { titleKey: 'MINCHA_KETANA', icon: Sun },
    plagHaMincha: { titleKey: 'PLAG_HAMINCHA', icon: Sunset },
    sunset: { titleKey: 'SHKIA', icon: Sunset },
    tzeit: { titleKey: 'TZEIT', icon: Moon },
  };

  const zmanimCards = Object.entries(zmanim || {})
    .filter(([key]) => key !== 'loading' && key !== 'seventhHour' && zmanimConfig[key])
    .map(([key, value]) => {
      const config = zmanimConfig[key];
      if (!config) return null;

      return {
        icon: config.icon,
        title: t ? t(config.titleKey) : config.titleKey,
        hebrewTitle: null, // Removed hardcoded hebrewTitle, relying on translations if needed or removing completely if UI adapts
        value: value,
      };
    })
    .filter(Boolean); // Remove nulls if any

  // Configuration for Study
  const studyIcons = {
    JUMASH: Scroll,
    TANYA: BookOpen,
    TEHILIM: Music, // or Heart
    RAMBAM_1: Gavel,
    RAMBAM_3: Gavel,
    DAF_YOMI: Calendar,
    YERUSHALMI_YOMI: Calendar,
    MISHNA_YOMI: Scale,
    NACH_YOMI: BookOpen,
    TANACH_YOMI: BookOpen,
    SEFER_HAMITZVOT: Scale
  };

  const studyCards = (study?.studyCards || []).map(item => {
    const Icon = studyIcons[item.key] || BookOpen;
    return {
      icon: Icon,
      title: t ? t(item.labelKey) : item.key, // Use translation or fallback to key
      hebrewTitle: null, // DataContext doesn't provide separate hebrew title yet
      value: item.value,
    };
  });

  // Reusable function to render card items
  const renderCardItems = (data) => {
    return data.map((item, index) => {
      const IconComponent = item.icon;
      return (
        <Box
          key={index}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            borderRadius: '8px'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <IconComponent style={{ width: '20px', height: '20px', color: '#bca886' }} />
            <Box>
              <Typography sx={{ color: '#8b7355', fontSize: '0.875rem', fontWeight: 600 }}>
                {item.title}
              </Typography>
              <Typography className="hebrew-text" sx={{ color: 'rgba(139, 115, 85, 0.6)', fontSize: '0.75rem' }}>
                {item.hebrewTitle}
              </Typography>
            </Box>
          </Box>
          <Typography sx={{ color: '#8b7355', fontSize: '1.25rem', fontWeight: 600 }}>
            {item.value}
          </Typography>
        </Box>
      );
    });
  };


  const ScrollingContent = ({ children, interval, scrollKey, speedFactor }) => {
    const containerRef = useRef(null);
    const innerRef = useRef(null);
    const rafRef = useRef(null);
    const scrollPos = useRef(0);

    useEffect(() => {
      const container = containerRef.current;
      const inner = innerRef.current;
      if (!container || !inner) return;

      let loopHeight = 0;
      let speed = 0;

      // Function to update measurements
      const updateMeasurements = () => {
        if (!inner) return;

        // The total height is the height of the inner container (which has 2 copies)
        const totalHeight = inner.offsetHeight;
        // The loop height is half of that (height of one copy)
        loopHeight = totalHeight / 2;

        // Calculate speed (px per ms)
        // We want to traverse 1 loopHeight in (interval) seconds * speedFactor
        if (loopHeight > 0 && interval > 0 && speedFactor > 0) {
          speed = loopHeight / (interval * 1000 * speedFactor);
        }
      };

      // Initial measurement
      updateMeasurements();

      const resizeObserver = new ResizeObserver(() => {
        updateMeasurements();
      });

      // Observe the inner content for size changes
      resizeObserver.observe(inner);

      let lastTime = performance.now();

      const loop = (now) => {
        const delta = now - lastTime;
        lastTime = now;

        if (loopHeight > 0 && speed > 0) {
          scrollPos.current += speed * delta;

          // 🔁 Loop logic
          if (scrollPos.current >= loopHeight) {
            scrollPos.current -= loopHeight;
          }

          // Apply transform
          inner.style.transform = `translateY(-${scrollPos.current}px)`;
        }

        rafRef.current = requestAnimationFrame(loop);
      };

      rafRef.current = requestAnimationFrame(loop);

      return () => {
        cancelAnimationFrame(rafRef.current);
        resizeObserver.disconnect();
      };
    }, [interval, scrollKey, speedFactor, children]);

    return (
      <Box
        ref={containerRef}
        sx={{
          maxHeight: '60vh',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <Box
          ref={innerRef}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            willChange: 'transform' // Hardware acceleration hint
          }}
        >
          {/* Blocks wrapped with keys to avoid React warnings */}
          <Box key="block-1">{children}</Box>
          <Box key="block-2">{children}</Box>
        </Box>
      </Box>
    );
  };


  const createCard = (id, title, icon, data) => {
    const IconComponent = icon;

    return (
      <Box sx={{ p: 4, height: '100%' }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
            <IconComponent style={{ width: '28px', height: '28px', color: '#bca886' }} />
          </Box>
          <Typography sx={{ color: '#8b7355', fontSize: '1.5rem', fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>

        <ScrollingContent
          interval={carouselInterval}
          scrollKey={id}
          speedFactor={scrollSpeed}
        >
          {/* We remove padding bottom here and rely on the item gaps. 
              The last item will have no gap after it, so we need to ensure spacing between blocks.
              But children is a Box with gap: 2. 
              So: [Box gap=2] [Box gap=2]. 
              The visual distance is 0 between boxes. 
              Only the last item inside Box 1 has no margin-bottom. 
              So we need to add a spacer or margin to this wrapper box. 
          */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pb: 2 }}>
            {renderCardItems(data)}
          </Box>
        </ScrollingContent>
      </Box>
    );
  };

  const cardConfigs = [
    {
      id: 'zmanim',
      title: 'Próximos Zmanim',
      icon: Clock,
      component: createCard('zmanim', 'Próximos Zmanim', Clock, zmanimCards),
    },
    {
      id: 'study',
      title: 'Estudio de Hoy',
      icon: BookOpen,
      component: createCard('study', 'Estudio de Hoy', BookOpen, studyCards),
    },
  ];

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
    if (cards.length <= 1) return; // Don't auto-advance if only one card

    const interval = setInterval(() => {
      setCurrentCardIndex((prev) => (prev + 1) % cards.length);
    }, carouselInterval * 1000);

    return () => clearInterval(interval);
  }, [carouselInterval, cards.length]);

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
              aria-label={`Ir a tarjeta ${index + 1}`}
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
              key={currentCardIndex}
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {cards[currentCardIndex].component}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </Box>
  );
}