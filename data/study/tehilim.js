import { HDate } from '@hebcal/core';

const monthlyDivision = [
    { day: 1, chapters: '1-9' },
    { day: 2, chapters: '10-17' },
    { day: 3, chapters: '18-22' },
    { day: 4, chapters: '23-28' },
    { day: 5, chapters: '29-34' },
    { day: 6, chapters: '35-38' },
    { day: 7, chapters: '39-43' },
    { day: 8, chapters: '44-48' },
    { day: 9, chapters: '49-54' },
    { day: 10, chapters: '55-59' },
    { day: 11, chapters: '60-65' },
    { day: 12, chapters: '66-68' },
    { day: 13, chapters: '69-71' },
    { day: 14, chapters: '72-76' },
    { day: 15, chapters: '77-78' },
    { day: 16, chapters: '79-82' },
    { day: 17, chapters: '83-87' },
    { day: 18, chapters: '88-89' },
    { day: 19, chapters: '90-96' },
    { day: 20, chapters: '97-103' },
    { day: 21, chapters: '104-105' },
    { day: 22, chapters: '106-107' },
    { day: 23, chapters: '108-112' },
    { day: 24, chapters: '113-118' },
    { day: 25, chapters: '119:1-96' },
    { day: 26, chapters: '119:97-176' },
    { day: 27, chapters: '120-134' },
    { day: 28, chapters: '135-139' },
    { day: 29, chapters: '140-144' },
    { day: 30, chapters: '145-150' },
];


/**
 * Gets the daily Tehillim portions
 * @param {HDate} hdate The Hebrew date
 * @returns {{ monthly: string, elul: string|null }}
 */
export function getTehilimForDate(hdate) {
    const dayOfMonth = hdate.getDate();
    const month = hdate.getMonth();
    const daysInMonth = hdate.daysInMonth();

    // Monthly portion
    let monthly;
    if (dayOfMonth === 29 && daysInMonth === 29) {
        monthly = `${monthlyDivision[28].chapters}, ${monthlyDivision[29].chapters}`;
    } else {
        monthly = monthlyDivision[dayOfMonth - 1].chapters;
    }

    // Elul and Tishrei portion
    let elul = null;
    if ((month === 6) || (month === 7 && dayOfMonth <= 10)) { // Elul or Tishrei up to Yom Kippur
        let dayOfElul;
        if (month === 6) { // Elul
            dayOfElul = dayOfMonth;
        } else { // Tishrei
            const elulDate = new HDate(hdate.getFullYear(), 6, 1);
            dayOfElul = elulDate.daysInMonth() + dayOfMonth;
        }

        const startChapter = (dayOfElul - 1) * 3 + 1;
        const endChapter = startChapter + 2;
        elul = `${startChapter}-${endChapter}`;
    }

    return { monthly, elul };
}
