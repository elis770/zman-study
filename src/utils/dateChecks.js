const shouldShowChatzot = (hebrewDate) => {
    if (!hebrewDate) return false;

    // Ejemplo hebrewDate: "14 Nisan 5784"
    const [dayStr, month] = hebrewDate.split(' ');
    const day = parseInt(dayStr, 10);

    // Días especiales
    const specialDates = [
      { day: 14, month: 'Nisan' },
      { day: 15, month: 'Nisan' },
      { day: 9, month: 'Av' },
      { day: 10, month: 'Av' },
      { day: 21, month: 'Tishrei' },
    ];

    return specialDates.some((d) => d.day === day && d.month === month);
  };
  const shouldShowNetz = (hebrewDate) => {
    if (!hebrewDate) return false;

    // Ejemplo hebrewDate: "14 Nisan 5784"
    const [dayStr, month] = hebrewDate.split(' ');
    const day = parseInt(dayStr, 10);

    // Días especiales
    const specialDates = [
      { day: 10, month: 'Tevet' },
      { day: 5, month: 'Sivan' },
      { day: 6, month: 'Sivan' },
      { day: 17, month: 'Tamuz' },
      { day: 21, month: 'Nisan' },
      { day: 22, month: 'Nisan' },
      { day: 21, month: 'Tishrei' },
    ];

    return specialDates.some((d) => d.day === day && d.month === month);
  };

  const isFriday = (date) => {
    if (!date) return false;
    return date.getDay() === 5;
  };

  const isShabbat = (date) => {
    if (!date) return false;
    return date.getDay() === 6; // sábado
  };

  const isElul = (hdate) => {
    if (!hdate) return false;
    const month = hdate.getMonth();
    const day = hdate.getDate();
    return (month === 6 && day >= 1) || (month === 7 && day <= 10);
  };

  const isOmer = (hebrewDate) => {
    if (!hebrewDate) return false;
  
    const [dayStr, month] = hebrewDate.split(' ');
    const day = parseInt(dayStr, 10);
  
    // Check for the period of Sefirat HaOmer
    if (month === 'Nisan' && day >= 16) {
      return true;
    }
    if (month === 'Iyar') {
      return true;
    }
    if (month === 'Sivan' && day <= 5) {
      return true;
    }
  
    return false;
  };

  export { shouldShowChatzot, shouldShowNetz, isFriday, isShabbat, isElul, isOmer };