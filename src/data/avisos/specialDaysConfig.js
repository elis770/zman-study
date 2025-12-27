// Días especiales de Jabad (sin los festivos tradicionales que maneja Hebcal)
const specialDaysConfig = [
  // {
  //   dayCondition: ['2 Tevet'],
  //   avisos: [
  //     {
  //       id: 'jabad-foundation',
  //       title: 'Fundación de Jabad',
  //       content: 'Aniversario del retorno de los libros de la fundación de Jabad (5 Tevet).',
  //       icon: '🏠',
  //     },
  //   ],
  // },
  {
    dayCondition: ['6 Tishrei'],
    avisos: [
      {
        id: 'rebetzin-chana',
        title: 'Yahrzeit de la Rebetzin Chana',
        content: 'Aniversario de fallecimiento de la Rebetzin Chana (6 Tishrei).',
        icon: '🌟',
      },
    ],
  },
  {
    dayCondition: ['13 Tishrei'],
    avisos: [
      {
        id: 'cumple-rebe-maharash',
        title: 'Cumpleaños del Rebe Maharash',
        content: 'Cumpleaños del Rebe Maharash (13 Tishrei).',
        icon: '🌟',
      },
    ],
  },
  {
    dayCondition: ['20 Cheshvan'],
    avisos: [
      {
        id: 'cumple-rebe-rashab',
        title: 'Cumpleaños del Rebe Rashab',
        content: 'Cumpleaños del Rebe Rashab (20 Cheshvan).',
        icon: '🌟',
      },
    ],
  },
  {
    dayCondition: ['9 Kislev'],
    avisos: [
      {
        id: 'cumple-yahrzeit-mittler',
        title: 'Cumpleaños y Yahrzeit del Mittler Rebbe',
        content: 'Cumpleaños y Yahrzeit del Mittler Rebbe (9 Kislev).',
        icon: '🔥',
      },
    ],
  },
  {
    dayCondition: ['10 Kislev'],
    avisos: [
      {
        id: 'liberacion-mittler',
        title: 'Liberación del Mittler Rebbe',
        content: 'Aniversario de la liberación del Mittler Rebbe de prisión (10 Kislev).',
        icon: '🔥',
      },
    ],
  },
  {
    dayCondition: ['14 Kislev'],
    avisos: [
      {
        id: 'casamiento-rebe',
        title: 'Casamiento del Rebe y la Rebetzin',
        content: 'Hoy es 14 de Kislev, ¡Casamiento del Rebe y la Rebetzin!',
        icon: '🔥',
      },
    ],
  },
  {
    dayCondition: ['19 Kislev', '20 Kislev'],
    avisos: [
      {
        id: 'rosh-hashana-chassidut',
        title: 'Rosh Hashaná de Jassidut',
        content: 'Aniversario de Rosh Hashaná de Jassidut (19 Kislev).',
        icon: '🕎',
      },
    ],
  },
  {
    dayCondition: ['5 Tevet'],
    avisos: [
      {
        id: 'jabad-foundation',
        title: 'Fundación de Jabad',
        content: 'Aniversario del retorno de los libros de la fundación de Jabad (5 Tevet).',
        icon: '🏠',
      },
    ],
  },
  {
    dayCondition: ['20 Tevet'],
    avisos: [
      {
        id: 'yahrzeit-rambam',
        title: 'Yahrzeit del Rambam',
        content: 'Aniversario de fallecimiento del Rambam (20 Tevet).',
        icon: '🏠',
      },
    ],
  },
  {
    dayCondition: ['24 Tevet'],
    avisos: [
      {
        id: 'yahrzeit-alter-rebbe',
        title: 'Yahrzeit del Alter Rebbe',
        content: 'Aniversario de fallecimiento del Alter Rebbe (24 Tevet).',
        icon: '🏠',
      },
    ],
  },
  {
    dayCondition: ['10 Shvat'],
    avisos: [
      {
        id: 'yahrzeit-fideker-rebbe',
        title: 'Yahrzeit del Fideker Rebbe',
        content: 'Aniversario de fallecimiento del Fideker Rebbe (10 Shvat).',
        icon: '🕯️',
      },
    ],
  },
  {
    dayCondition: ['11 Shvat'],
    avisos: [
      {
        id: 'ascension-rebbe',
        title: 'Ascensión del Rebe',
        content: 'Aniversario de la ascensión del Rebe (11 Shvat).',
        icon: '🏠',
      },
    ],
  },
  {
    dayCondition: ['22 Shvat'],
    avisos: [
      {
        id: 'yahrzeit-rebetzin',
        title: 'Yahrzeit de la Rebetzin',
        content: 'Aniversario de fallecimiento de la Rebetzin (22 Shvat).',
        icon: '🕯️',
      },
    ],
  },
  {
    dayCondition: ['25 Adar'],
    avisos: [
      {
        id: 'cumple-rebetzin',
        title: 'Cumpleaños de la Rebetzin',
        content: 'Cumpleaños de la Rebetzin (25 Adar).',
        icon: '🎉',
      },
    ],
  },
  {
    dayCondition: ['2 Nisan'],
    avisos: [
      {
        id: 'yahrzeit-rebe-rashab',
        title: 'Yahrzeit del Rebe Rashab',
        content: 'Aniversario de fallecimiento del Rebe Rashab (2 Nisan).',
        icon: '🕯️',
      },
    ],
  },
  {
    dayCondition: ['11 Nisan'],
    avisos: [
      {
        id: 'cumple-rebe',
        title: 'Cumpleaños del Rebe',
        content: 'Hoy es el cumpleaños del Rebe (11 Nisan).',
        icon: '🎉',
      },
    ],
  },
  {
    dayCondition: ['13 Nisan'],
    avisos: [
      {
        id: 'tzemaj-tzedek-birthday',
        title: 'Cumpleaños del Tzemaj Tzedek',
        content: 'Hoy es el cumpleaños del Tzemaj Tzedek (13 Nisan).',
        icon: '🎉',
      },
    ],
  },
  {
    dayCondition: ['28 Nisan'],
    avisos: [
      {
        id: 'tuz-alzt-vos-ir-kent',
        title: 'Tuz Alzt Vos Ir Kent',
        content: 'Hoy es Tuz Alzt Vos Ir Kent (28 Nisan).',
        icon: '📜',
      },
    ],
  },
  {
    dayCondition: ['3 Tammuz'],
    avisos: [
      {
        id: 'rebbe-yahrzeit',
        title: 'Yahrzeit del Rebe',
        content: 'Hoy es el aniversario de fallecimiento del Rebe (3 Tammuz).',
        icon: '🕯️',
      },
    ],
  },
  {
    dayCondition: ['12 Tammuz'],
    avisos: [
      {
        id: 'cumple-fideker-rebbe',
        title: 'Cumpleaños del Fideker Rebbe',
        content: 'Hoy es el cumpleaños del Fideker Rebbe (12 Tammuz).',
        icon: '🎉',
      },
    ],
  },
  {
    dayCondition: ['13 Tammuz'],
    avisos: [
      {
        id: 'liberacion-fideker-rebbe',
        title: 'Liberación del Fideker Rebbe',
        content: 'Aniversario de la liberación del Fideker Rebbe de prisión (13 Tammuz).',
        icon: '🎉',
      },
    ],
  },
  {
    dayCondition: ['20 Av'],
    avisos: [
      {
        id: 'yahtzeit-reb-leivik',
        title: 'Yahrzeit del Reb Leivik',
        content: 'Aniversario de fallecimiento del Reb Leivik (20 Av).',
        icon: '🕯️',
      },
    ],
  },
  {
    dayCondition: ['13 Elul'],
    avisos: [
      {
        id: 'casamiento-fideker-rebbe',
        title: 'Casamiento del Fideker Rebbe',
        content: 'Aniversario del casamiento del Fideker Rebbe (13 Elul).',
        icon: '💍',
      },
    ],
  },
  {
    dayCondition: ['15 Elul'],
    avisos: [
      {
        id: 'fundacion-yeshiva-jabad',
        title: 'Fundación de la Yeshivá Jabad',
        content: 'Aniversario de la fundación de la Yeshivá Jabad (15 Elul).',
        icon: '🏫',
      },
    ],
  },
  {
    dayCondition: ['18 Elul'],
    avisos: [
      {
        id: 'cumple-baal-shem-tov-alter-rebe',
        title: 'Cumpleaños del Baal Shem Tov y el Alter Rebbe',
        content: 'Cumpleaños del Baal Shem Tov y el Alter Rebbe (18 Elul).',
        icon: '✨',
      },
    ],
  },
  {
    dayCondition: ['29 Elul'],
    avisos: [
      {
        id: 'cumple-tzemaj-tzedek',
        title: 'Cumpleaños del Tzemaj Tzedek',
        content: 'Cumpleaños del Tzemaj Tzedek (29 Elul).',
        icon: '✨',
      },
    ],
  },
];

export default specialDaysConfig;