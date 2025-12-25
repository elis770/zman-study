import { useMemo } from 'react';
import { useListCards } from "./useListCards";
import { useTextCards } from "./useTextCards";
import { useTimeCards } from "./useTimeCards";
import { useAvisosCards } from "./useAvisosCards";

export const useCarouselData = () => {
    const { zmanimCards, studyCards } = useListCards();
    const { hayomYomData } = useTextCards();
    const { minianimCards, seiderCards } = useTimeCards();
    const { avisosCards } = useAvisosCards();

    const dataSources = useMemo(() => ({
        zmanimCards,
        studyCards,
        hayomYomData,
        minianimCards,
        seiderCards,
        avisosCards
    }), [zmanimCards, studyCards, hayomYomData, minianimCards, seiderCards, avisosCards]);

    return dataSources;
};
