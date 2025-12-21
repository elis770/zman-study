import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, Box, Typography, IconButton } from "@mui/material";
import { Clock, BookOpen, Scroll } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useSettings } from "./SettingsContext";
import { useLanguage } from '@/shared/hooks/useLanguage.js';

import { useListCards } from "./cards/hooks/useListCards";
import { useTextCards } from "./cards/hooks/useTextCards";
import { useTimeCards } from "./cards/hooks/useTimeCards";
import { useAvisosCards } from "./cards/hooks/useAvisosCards";
import { GenericCard, CardItemList } from "./cards/ui/CardComponents";

// InnerCarousel renders a carousel for a given ordered list of card ids
function InnerCarousel({ ids, carouselInterval, registerCard, visibleCards, scrollSpeed, t, dataSources }) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

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
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pb: 2, backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: '8px', p: 2 }}>
            <Typography className="hebrew-text" sx={{ color: '#5d4037', fontSize: '1rem', whiteSpace: 'pre-wrap', textAlign: 'right', lineHeight: 1.6 }}>{hayomYomData?.text}</Typography>
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
        id: 'Seider',
        titleKey: 'SEIDER_TITLE',
        icon: Clock,
        hasData: () => SeiderCards?.length > 0,
        renderContent: () => <CardItemList data={SeiderCards} />
      },
      {
        id: 'avisos',
        titleKey: 'AVISOS_TITLE',
        icon: Scroll,
        hasData: () => avisosCards?.length > 0,
        renderContent: () => <CardItemList data={avisosCards} />
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

  // Register on mount
  useEffect(() => {
    cardConfigs.forEach(config => registerCard(config.id, config.title, config.icon));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const visibleCardConfigs = cardConfigs.filter(config => visibleCards[config.id] !== false);
  const cards = visibleCardConfigs.map(config => ({ id: config.id, component: config.component }));

  useEffect(() => {
    if (currentCardIndex >= cards.length) setCurrentCardIndex(0);
    if (cards.length <= 1) return;
    const interval = setInterval(() => setCurrentCardIndex((prev) => (prev + 1) % cards.length), carouselInterval * 1000);
    return () => clearInterval(interval);
  }, [carouselInterval, cards.length, currentCardIndex]);

  const handleDotClick = (index) => setCurrentCardIndex(index);

  if (cards.length === 0) {
    return (
      <Card sx={{ background: 'linear-gradient(to bottom right, rgba(255,255,255,0.8), rgba(232,220,195,0.5))', backdropFilter: 'blur(8px)', border: '1px solid rgba(188,168,134,0.3)', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', borderRadius: '16px', p:4, textAlign:'center' }}>
        <Typography sx={{ color: '#8b7355', fontSize: '1.25rem' }}>No hay tarjetas visibles. Activa al menos una en Configuración.</Typography>
      </Card>
    );
  }

  const activeCard = cards[currentCardIndex] || cards[0];

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {cards.length > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
          {cards.map((card, index) => (
            <IconButton key={card.id} onClick={() => handleDotClick(index)} sx={{ width: index === currentCardIndex ? '32px' : '8px', height: '8px', borderRadius: '9999px', backgroundColor: index === currentCardIndex ? '#bca886' : 'rgba(188,168,134,0.3)', transition: 'all 0.3s', padding:0, minWidth:0 }} aria-label={`Ir a tarjeta ${index+1}`} />
          ))}
        </Box>
      )}

      <Card sx={{ background: 'linear-gradient(to bottom right, rgba(255,255,255,0.8), rgba(232,220,195,0.5))', backdropFilter: 'blur(8px)', border: '1px solid rgba(188,168,134,0.3)', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', borderRadius: '16px', overflow: 'hidden', mt:1, flex:1, display:'flex', flexDirection:'column' }}>
        <CardContent sx={{ padding:0, flex:1, display:'flex', flexDirection:'column' }}>
          <AnimatePresence mode="wait">
            <motion.div key={activeCard ? activeCard.id : 'empty'} initial={{ opacity:0, x:300 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-300 }} transition={{ duration:0.5, ease:'easeInOut' }} style={{ flex:1, display:'flex', flexDirection:'column' }}>
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

  // data sources
  const { zmanimCards, studyCards } = useListCards();
  const { hayomYomData } = useTextCards();
  const { minianimCards, seiderCards } = useTimeCards();
  const { avisosCards } = useAvisosCards();

  const dataSources = { zmanimCards, studyCards, hayomYomData, minianimCards, seiderCards, avisosCards };

  // layout from settings: default to two columns if missing
  const layout = carouselLayout || { left: ['zmanim','study'], right: ['minian','avisos'] };

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, alignItems: 'stretch', justifyContent: 'center' }}>
      {[
        { key: 'left', mdWidth: '40%', showOnXs: true },
        { key: 'right', mdWidth: '40%', showOnXs: false }
      ].map(col => (
        <Box
          key={col.key}
          sx={{
            width: { xs: '95%', md: col.mdWidth },
            minWidth: 0,
            display: { xs: col.showOnXs ? 'block' : 'none', md: 'block' }
          }}
        >
          <InnerCarousel
            ids={layout[col.key] || []}
            carouselInterval={carouselInterval}
            registerCard={registerCard}
            visibleCards={visibleCards}
            scrollSpeed={scrollSpeed}
            t={t}
            dataSources={dataSources}
          />
        </Box>
      ))}
    </Box>
  );
}