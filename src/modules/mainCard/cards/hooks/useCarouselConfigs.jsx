import { useMemo } from 'react';
import { Box, Typography } from "@mui/material";
import { Clock, BookOpen, Scroll, CloudSun } from "lucide-react";
import { WeatherApp } from "../ui/WeatherApp";
import { GenericCard, CardItemList } from "../ui/CardComponents";

export const useCarouselConfigs = (ids, dataSources, carouselInterval, scrollSpeed, t, tick) => {
    return useMemo(() => {
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
                        id={`${def.id}-${tick}`}
                        title={t(def.titleKey)}
                        icon={def.icon}
                        interval={carouselInterval}
                        speedFactor={scrollSpeed}
                        content={<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pb: 2 }}>{def.renderContent()}</Box>}
                    />
                )
            }));
    }, [ids, dataSources, carouselInterval, scrollSpeed, t, tick]);
};
