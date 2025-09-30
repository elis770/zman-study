import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const useTrasladeText = (textToTranslate) => {
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const translateText = useCallback(async (text) => {
    if (!text) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post('https://api.mymemory.translated.net/get', null, {
        params: {
          q: text,
          langpair: 'he|en',
        },
      });
      setTranslatedText(response.data.responseData.translatedText);
    } catch (err) {
      console.error('Error translating text:', err);
      setError('Failed to translate text.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    translateText(textToTranslate);
  }, [textToTranslate, translateText]);
  return { translatedText, isLoading, error };
};