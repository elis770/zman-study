import { useMemo } from 'react';
import { Box, Typography, Slider, Button, IconButton, Paper, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Plus, Trash2, CloudSun } from 'lucide-react';
import { useLanguage } from '../../../shared/traslantions/useLanguage.js';
import { useSettings } from "../context/SettingsContext.jsx";
import { Divider } from '@mui/material';

// Compact box style for drop zones - horizontal layout
const boxStyle = {
    p: 1,
    borderRadius: '8px',
    border: '1px dashed rgba(139, 115, 85, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    minHeight: '40px',
    display: 'flex',
    flexWrap: 'wrap',
    gap: 0.5,
    alignItems: 'center'
};

// Compact inline chip style - small boxes
const itemStyle = {
    px: 1,
    py: 0.3,
    borderRadius: '4px',
    backgroundColor: '#fff',
    border: '1px solid rgba(139, 115, 85, 0.2)',
    cursor: 'grab',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    display: 'inline-block',
    fontSize: '0.7rem',
    lineHeight: 1.4,
    '&:hover': {
        backgroundColor: 'rgba(188, 168, 134, 0.15)',
        borderColor: '#bca886'
    }
};

const LayoutSettings = () => {
    const { t } = useLanguage();
    const { carouselLayout, setCarouselLayout } = useSettings();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md')); // xs, sm
    const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg')); // md

    // Determine max columns based on screen size
    const maxColumns = isMobile ? 1 : isTablet ? 2 : 3;

    // Defines cards with translations
    const availableCardsDefs = [
        { id: 'zmanim', label: t('NEXT_ZMANIM') || 'Zmanim' },
        { id: 'study', label: t('STUDY_TITLE') || 'Estudios' },
        { id: 'hayom-yom', label: t('HAIOM_IOM_TITLE') || 'Hayom Yom' },
        { id: 'minian', label: t('MINIAN_TITLE') || 'Minianim' },
        { id: 'seider', label: t('SEIDER_TITLE') || 'Shiurim/Seider' },
        { id: 'avisos', label: t('AVISOS_TITLE') || 'Avisos' },
        { id: 'weather', label: t('WEATHER_TITLE') || 'Clima' }
    ];

    // Normalize layout
    const safeLayout = Array.isArray(carouselLayout) ? carouselLayout : [
        { id: 'col1', cards: carouselLayout?.left || ['zmanim', 'study'], width: 50 },
        { id: 'col2', cards: carouselLayout?.right || ['minian', 'avisos'], width: 50 }
    ];

    // Compute Effective Layout for DISPLAY (merging content)
    const effectiveLayout = useMemo(() => {
        if (isMobile) {
            // Merge ALL columns into First Column
            const allCards = safeLayout.flatMap(col => col.cards);
            return [{ ...(safeLayout[0] || { id: 'merged', width: 100 }), width: 100, cards: allCards }];
        } else if (isTablet) {
            // Keep Col 1, Merge everything else into Col 2
            if (safeLayout.length <= 1) return safeLayout;
            const firstCol = safeLayout[0];
            const restCards = safeLayout.slice(1).flatMap(col => col.cards);
            const secondCol = safeLayout[1] || { id: 'merged-right', width: 50 };

            // Re-normalize widths for 2 columns display if not valid
            return [
                firstCol,
                { ...secondCol, cards: restCards }
            ];
        }
        return safeLayout;
    }, [safeLayout, isMobile, isTablet]);

    const handlesetCarouselLayout = (newLayout) => {
        setCarouselLayout(newLayout);
    };

    // Calculate available (unused) cards
    const usedCardIds = effectiveLayout.flatMap(col => col.cards);
    const availableCards = availableCardsDefs.filter(c => !usedCardIds.includes(c.id));

    // DnD Handlers
    const onDragStart = (e, cardId) => {
        e.dataTransfer.setData('cardId', cardId);
        e.dataTransfer.effectAllowed = 'move';
    };

    const onDrop = (e, targetColId) => {
        e.preventDefault();
        const cardId = e.dataTransfer.getData('cardId');
        if (!cardId) return;

        // We act on Effective Layout for editing
        // IMPORTANT: If we are in merge mode, this 'newLayout' will become the PERMANENT layout
        let newLayout = effectiveLayout.map(col => ({
            ...col,
            cards: col.cards.filter(c => c !== cardId)
        }));

        if (targetColId !== 'available') {
            newLayout = newLayout.map(col => {
                if (col.id === targetColId) {
                    return { ...col, cards: [...col.cards, cardId] };
                }
                return col;
            });
        }
        handlesetCarouselLayout(newLayout);
    };

    // Layout Management with relative width normalization
    const addColumn = () => {
        if (effectiveLayout.length >= maxColumns) return;
        const newId = `col-${Date.now()}`;
        // Distribute width evenly
        const newWidth = 100 / (effectiveLayout.length + 1);
        const normalizedLayout = effectiveLayout.map(col => ({ ...col, width: newWidth }));
        handlesetCarouselLayout([...normalizedLayout, { id: newId, cards: [], width: newWidth }]);
    };

    const removeColumn = (colId) => {
        const newLayout = effectiveLayout.filter(c => c.id !== colId);
        // Redistribute width evenly
        const newWidth = 100 / newLayout.length;
        handlesetCarouselLayout(newLayout.map(col => ({ ...col, width: newWidth })));
    };

    const updateWidth = (colId, val) => {
        // Calculate total of other columns
        const otherColumns = effectiveLayout.filter(col => col.id !== colId);
        const remainingWidth = 100 - val;

        // Distribute remaining width proportionally among other columns
        const totalOtherWidth = otherColumns.reduce((sum, col) => sum + col.width, 0);

        const newLayout = effectiveLayout.map(col => {
            if (col.id === colId) {
                return { ...col, width: val };
            } else {
                // Proportional redistribution
                const proportion = totalOtherWidth > 0 ? col.width / totalOtherWidth : 1 / otherColumns.length;
                return { ...col, width: Math.round(remainingWidth * proportion) };
            }
        });

        handlesetCarouselLayout(newLayout);
    };

    return (
        <Box>
            <Typography variant="body2" sx={{ color: 'rgba(139, 115, 85, 0.7)', mb: 1.5, fontSize: '0.85rem' }}>
                {t('LAYOUT_DESC') || 'Arrastra las tarjetas para organizar la pantalla principal. Los anchos son relativos entre sí.'}
            </Typography>

            {/* Info message about merging if in mobile/tablet mode and original layout had more columns */}
            {safeLayout.length > maxColumns && (
                <Box sx={{
                    mb: 2,
                    p: 1.5,
                    backgroundColor: 'rgba(139, 115, 85, 0.08)',
                    border: '1px dashed rgba(139, 115, 85, 0.3)',
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}>
                    <Typography variant="caption" sx={{ color: '#8b7355', fontSize: '0.75rem', fontStyle: 'italic' }}>
                        * Vista simplificada para {isMobile ? 'Móvil' : 'Tablet'}.
                        Las tarjetas se han agrupado automáticamente.
                    </Typography>
                </Box>
            )}

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {effectiveLayout.map((col, index) => (
                    <Paper key={col.id} elevation={0} sx={{ p: 1.5, border: '1px solid rgba(139, 115, 85, 0.15)', borderRadius: 1.5, backgroundColor: 'rgba(255, 255, 255, 0.4)' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="caption" sx={{ color: '#8b7355', fontWeight: 600, fontSize: '0.8rem' }}>
                                    {t('COLUMN') || 'Columna'} {index + 1}
                                </Typography>
                            </Box>
                            {effectiveLayout.length > 1 && (
                                <IconButton size="small" onClick={() => removeColumn(col.id)} sx={{ color: '#d32f2f', p: 0.5 }}>
                                    <Trash2 size={14} />
                                </IconButton>
                            )}
                        </Box>

                        <Box sx={{ mb: 1, px: 0.5 }}>
                            <Typography variant="caption" sx={{ color: 'rgba(139, 115, 85, 0.7)', fontSize: '0.75rem' }}>
                                {t('WIDTH') || 'Ancho'}: {Math.round(col.width)}%
                            </Typography>
                            <Slider
                                value={col.width}
                                min={10} max={90} step={5}
                                onChange={(_, val) => updateWidth(col.id, val)}
                                sx={{ color: '#bca886', height: 4 }}
                                size="small"
                            />
                        </Box>

                        <Box
                            onDragOver={e => e.preventDefault()}
                            onDrop={e => onDrop(e, col.id)}
                            sx={boxStyle}
                        >
                            {col.cards.map(cardId => {
                                const cardLabel = availableCardsDefs.find(c => c.id === cardId)?.label || cardId;
                                return (
                                    <Box key={cardId} draggable onDragStart={e => onDragStart(e, cardId)} sx={itemStyle}>
                                        {cardLabel}
                                    </Box>
                                );
                            })}
                            {col.cards.length === 0 && (
                                <Typography variant="caption" sx={{ color: 'rgba(0,0,0,0.3)', fontSize: '0.7rem', width: '100%', textAlign: 'center' }}>
                                    Arrastra aquí
                                </Typography>
                            )}
                        </Box>
                    </Paper>
                ))}

                {effectiveLayout.length < maxColumns && (
                    <Button
                        startIcon={<Plus size={14} />}
                        onClick={addColumn}
                        variant="outlined"
                        size="small"
                        sx={{ color: '#8b7355', borderColor: '#8b7355', borderStyle: 'dashed', fontSize: '0.75rem', py: 0.5 }}
                    >
                        {t('ADD_COLUMN') || 'Agregar Columna'}
                    </Button>
                )}

                <Box>
                    <Typography variant="caption" sx={{ color: '#8b7355', fontWeight: 600, mb: 0.5, display: 'block', fontSize: '0.8rem' }}>
                        {t('AVAILABLE') || 'Disponibles'}
                    </Typography>
                    <Box
                        onDragOver={e => e.preventDefault()}
                        onDrop={e => onDrop(e, 'available')}
                        sx={{ ...boxStyle, borderStyle: 'dotted' }}
                    >
                        {availableCards.map(card => (
                            <Box key={card.id} draggable onDragStart={e => onDragStart(e, card.id)} sx={{ ...itemStyle, opacity: 0.7 }}>
                                {card.label}
                            </Box>
                        ))}
                        {availableCards.length === 0 && (
                            <Typography variant="caption" sx={{ color: 'rgba(0,0,0,0.3)', fontSize: '0.7rem', width: '100%', textAlign: 'center' }}>
                                Todo asignado
                            </Typography>
                        )}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default LayoutSettings;