// trasladeText.js
import axios from "axios";

export async function trasladeText(text, sourceLang, targetLangs) {
  if (!text) {
    return { translations: null, error: "No text provided" };
  }
  if (!sourceLang || !targetLangs || targetLangs.length === 0) {
    return { translations: null, error: "Source or target languages not specified correctly." };
  }

  try {
    // Creamos una promesa de traducción para cada idioma de destino
    const translationPromises = targetLangs.map(targetLang =>
      axios.post("https://api.mymemory.translated.net/get", null, {
        params: {
          q: text,
          langpair: `${sourceLang}|${targetLang}`,
        },
      })
    );

    // Esperamos a que todas las traducciones se completen
    const responses = await Promise.all(translationPromises);

    // Creamos un objeto con los resultados
    const translations = responses.reduce((acc, response, index) => {
      const lang = targetLangs[index];
      acc[lang] = response.data.responseData.translatedText;
      return acc;
    }, {});

    return { translations, error: null };
  } catch (err) {
    console.error("Error translating text:", err);
    return { translations: null, error: "Failed to translate text." };
  }
}

// Ejemplo de uso:
async function testTranslation() {
  const sampleText = "אמר רבי יהודה: כל המקיים נפש אחת, כאילו קיים עולם מלא"; // Texto en hebreo
  const sourceLanguage = "he";
  const targetLanguages = ["en", "es", "fr"]; // Traducir a inglés, español y francés

  const { translations, error } = await trasladeText(sampleText, sourceLanguage, targetLanguages);
    if (error) {
      console.error("Translation Error:", error);
    } else {
      console.log("Original Text:", sampleText);
      console.log("Translations:", translations);
    }
}

testTranslation();