import { useState, useEffect } from 'react';
import { HDate } from '@hebcal/core';

export function useHebrewDate() {
    const [hdate, setHdate] = useState(new HDate());

    useEffect(() => {
        const timer = setInterval(() => {
            setHdate(new HDate());
        }, 60000); // Update every minute

        return () => clearInterval(timer);
    }, []);

    return hdate;
}
