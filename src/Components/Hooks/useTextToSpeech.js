import { useState, useCallback } from 'react';

export function useTextToSpeech() {
  const [isTTSEnabled, setIsTTSEnabled] = useState(false);
  const [error, setError] = useState(null);

  const speakText = useCallback((text) => {
    if (!('speechSynthesis' in window)) {
      setError('Text-to-speech is not supported in this browser');
      return;
    }

    if (!isTTSEnabled || !text) return;

    try {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.lang.includes('en') && voice.name.includes('Female')
      ) || voices[0];
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('TTS error:', error);
      setError('Failed to speak text');
    }
  }, [isTTSEnabled]);

  const toggleTTS = useCallback(() => {
    setIsTTSEnabled(prev => !prev);
  }, []);

  return {
    isTTSEnabled,
    error,
    speakText,
    toggleTTS,
    setError
  };
}