import { useMemo } from 'react';
import { useTheme, useMediaQuery } from "@mui/material";

export const useCarouselColumns = (carouselLayout) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));

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

    return {
        columns,
        isMobile,
        isTablet,
        shouldReduceHeight: columns.length > 3
    };
};
