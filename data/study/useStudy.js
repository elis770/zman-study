import { useMemo } from 'react';
import { useHebrewDate } from '../hooks/useHebrewDate';
import { getTehilimForDate } from './tehilim';

export function useStudy() {
    const hdate = useHebrewDate();

    const tehilim = useMemo(() => {
        if (!hdate) return null;
        return getTehilimForDate(hdate);
    }, [hdate]);

    return {
        tehilim
    };
}
