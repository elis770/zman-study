import { useEffect, useState } from "react";
import { Card, CardContent, Box, Typography, IconButton } from "@mui/material";
import { MapPin, Clock, Sunrise, Sunset, BookOpen, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useSettings } from "./SettingsContext";

export function MainCardCarousel() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const { city, timezone, carouselInterval, registerCard, visibleCards } = useSettings();

  // Zmanim data array
  const zmanimData = [
    {
      icon: Sunrise,
      title: 'Netz Hajama',
      hebrewTitle: 'נץ החמה',
      value: '05:45'
    },
    {
      icon: Clock,
      title: 'Sof Zman Shema',
      hebrewTitle: 'סוף זמן קריאת שמע',
      value: '09:15'
    },
    {
      icon: Sunset,
      title: 'Shkiá',
      hebrewTitle: 'שקיעת החמה',
      value: '18:20'
    }
  ];

  // Study data array
  const studyData = [
    {
      icon: BookOpen,
      title: 'Jumash',
      hebrewTitle: 'חומש',
      value: 'Bereshit: Primer Aliyá'
    },
    {
      icon: BookOpen,
      title: 'Tanya',
      hebrewTitle: 'תניא',
      value: 'Likutei Amarim, Cap. 3'
    },
    {
      icon: BookOpen,
      title: 'Tehilim',
      hebrewTitle: 'תהלים',
      value: 'Capítulos 1-9'
    }
  ];

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

  // Reusable function to create a card with title, icon, and data
  const createCard = (title, icon, data) => {
    const IconComponent = icon;
    return (
      <Box sx={{ p: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
            <IconComponent style={{ width: '28px', height: '28px', color: '#bca886' }} />
          </Box>
          <Typography sx={{ color: '#8b7355', fontSize: '1.5rem', fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {renderCardItems(data)}
        </Box>
      </Box>
    );
  };

  // Card configurations
  const cardConfigs = [
    { id: 'zmanim', title: 'Próximos Zmanim', icon: Clock, component: createCard('Próximos Zmanim', Clock, zmanimData) },
    { id: 'study', title: 'Estudio de Hoy', icon: BookOpen, component: createCard('Estudio de Hoy', BookOpen, studyData) }
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