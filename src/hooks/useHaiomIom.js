import { useState, useEffect } from 'react';
import { HDate } from '@hebcal/core';

const monthMap = {
    1: 'nisan',
    2: 'iyar',
    3: 'sivan',
    4: 'tamuz',
    5: 'av',
    6: 'elul',
    7: 'tishrei',
    8: 'cheshvan',
    9: 'kislev',
    10: 'tevet',
    11: 'shevat',
    12: 'adar',
    13: 'adar_ii',
};

const useHaiomIom = () => {
    const [study, setStudy] = useState({ title: null, text: null });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHaiomIom = async () => {
            try {
                setLoading(true);
                setError(null);
                const hdate = new HDate();
                const day = hdate.getDate();
                const monthNum = hdate.getMonth();
                const monthName = hdate.isLeapYear() && monthNum === 12 ? 'adar_i' : monthMap[monthNum];

                const response = await fetch(`/json-haiom-iom/${monthName}.json`);
                if (!response.ok) throw new Error(`No se pudo cargar ${monthName}.json`);
                const monthData = await response.json();
                const dayData = monthData.find(d => d.day === day);

                if (dayData) setStudy({ title: dayData.title, text: dayData.text });
                else throw new Error(`No se encontró el estudio para el día ${day} de ${monthName}.`);
            } catch (e) { setError(e.message);
            } finally { setLoading(false); }
        };
        fetchHaiomIom();
    }, []);

    return { ...study, loading, error };
};

export default useHaiomIom;