import { Box } from "@mui/material";
import { useSettings } from "../settings/context/SettingsContext";
import { useLanguage } from '@/shared/traslantions/useLanguage.js';

import { useCarouselData } from "./cards/hooks/useCarouselData";
import { useCarouselColumns } from "./cards/hooks/useCarouselColumns";
import { InnerCarousel } from "./cards/ui/InnerCarousel";

export default function MainCardCarousel() {
  const settings = useSettings();
  const { carouselInterval, registerCard, visibleCards, scrollSpeed, carouselLayout } = settings;
  const { t } = useLanguage();

  const dataSources = useCarouselData();
  const { columns, shouldReduceHeight } = useCarouselColumns(carouselLayout);

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
      justifyContent: 'center',
      height: '100%'
    }}>
      {columns.map((col) => {
        return (
          <Box
            key={col.id}
            sx={{
              width: {
                xs: '100%',
                md: shouldReduceHeight ? `calc(${col.width}% - 8px)` : `${col.width}%`
              },
              height: '100%',
              minWidth: 0,
              display: 'block'
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