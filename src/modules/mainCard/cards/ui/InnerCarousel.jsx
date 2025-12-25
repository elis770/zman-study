import { useEffect, useState } from "react";
import { Card, CardContent, Box, Typography, IconButton } from "@mui/material";
import { AnimatePresence, motion } from "motion/react";
import { useSettings } from "../../../settings/context/SettingsContext";
import { useCarouselConfigs } from "../hooks/useCarouselConfigs.jsx";

export function InnerCarousel({ ids, carouselInterval, registerCard, visibleCards, scrollSpeed, t, dataSources }) {
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [tick, setTick] = useState(0);
    const { showDots, showArrows } = useSettings();

    const cardConfigs = useCarouselConfigs(ids, dataSources, carouselInterval, scrollSpeed, t, tick);

    // Register cards whenever configs change to ensure all discovered cards are known by settings
    useEffect(() => {
        if (cardConfigs.length > 0) {
            cardConfigs.forEach(config => registerCard(config.id, config.title, config.icon));
        }
    }, [cardConfigs, registerCard]);

    const visibleCardConfigs = cardConfigs.filter(config => visibleCards[config.id] !== false);
    const cards = visibleCardConfigs.map(config => ({ id: config.id, component: config.component }));

    useEffect(() => {
        if (currentCardIndex >= cards.length) setCurrentCardIndex(0);

        // Always run the interval, even for 1 card, to trigger periodic resets
        const intervalId = setInterval(() => {
            setTick(prev => prev + 1);
            if (cards.length > 1) {
                setCurrentCardIndex((prev) => (prev + 1) % cards.length);
            }
        }, carouselInterval * 1000);

        return () => clearInterval(intervalId);
    }, [carouselInterval, cards.length, currentCardIndex]); // Depend on currentCardIndex to reset timer on manual navigation

    const handleDotClick = (index) => setCurrentCardIndex(index);
    const handleNext = () => setCurrentCardIndex((prev) => (prev + 1) % cards.length);
    const handlePrev = () => setCurrentCardIndex((prev) => (prev - 1 + cards.length) % cards.length);

    if (cards.length === 0) {
        return (
            <Card sx={{ background: 'linear-gradient(to bottom right, rgba(255,255,255,0.8), rgba(232,220,195,0.5))', backdropFilter: 'blur(8px)', border: '1px solid rgba(188,168,134,0.3)', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', borderRadius: '16px', p: 4, textAlign: 'center' }}>
                <Typography sx={{ color: '#8b7355', fontSize: '1.25rem' }}>No hay tarjetas visibles. Activa al menos una en Configuración.</Typography>
            </Card>
        );
    }

    const activeCard = cards[currentCardIndex] || cards[0];

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {showDots && cards.length > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                    {cards.map((card, index) => (
                        <IconButton key={card.id} onClick={() => handleDotClick(index)} sx={{ width: index === currentCardIndex ? '32px' : '8px', height: '8px', borderRadius: '9999px', backgroundColor: index === currentCardIndex ? '#bca886' : 'rgba(188,168,134,0.3)', transition: 'all 0.3s', padding: 0, minWidth: 0 }} aria-label={`Ir a tarjeta ${index + 1}`} />
                    ))}
                </Box>
            )}

            <Card sx={{ background: 'linear-gradient(to bottom right, rgba(255,255,255,0.8), rgba(232,220,195,0.5))', backdropFilter: 'blur(8px)', border: '1px solid rgba(188,168,134,0.3)', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', borderRadius: '16px', overflow: 'hidden', mt: 1, flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>

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
                                backgroundColor: 'rgba(255,255,255,0.9)',
                                '&:hover': { backgroundColor: '#bca886', color: 'white' },
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
                                backgroundColor: 'rgba(255,255,255,0.9)',
                                '&:hover': { backgroundColor: '#bca886', color: 'white' },
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
