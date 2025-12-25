const translations = [
  { fonetica: "Sha'ar HaSefer", hebreo: "שער הספר" },
  { fonetica: "Hakdamah", hebreo: "הקדמה" },
  { fonetica: "Chinuch Katan", hebreo: "חינוך קטן" },
  { fonetica: "Sefer Shel Beinonim", hebreo: "ספר של בינונים" },
  { fonetica: "Sha'ar HaYichud VeHaEmunah", hebreo: "שער היחוד והאמונה" },
  { fonetica: "Igueret HaTeshuvah", hebreo: "אגרת התשובה" },
  { fonetica: "Igueret HaKodesh", hebreo: "אגרת הקודש" },
  { fonetica: "Kuntres Acharon", hebreo: "קונטרס אחרון" },
];

export const cleanText = (text) => {
  if (typeof text !== "string") return text;
  let result = text;
  translations.forEach(({ fonetica, hebreo }) => {
    result = result.replace(new RegExp(fonetica, "gi"), hebreo);
  });
  return result
    .replace(/\bTanya\b|\bPart\s+[IVXLCDM]+\b|[,;]/gi, "")
    .trim();
};