import { useState, useRef, useEffect, useCallback } from 'react';

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);
  const retryTimeoutRef = useRef(null);

  const initializeRecognition = useCallback(() => {
    if (!('webkitSpeechRecognition' in window)) {
      setError('Speech recognition is not supported in this browser');
      return null;
    }

    const SpeechRecognition = window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const last = event.results.length - 1;
      const result = event.results[last];
      const transcript = result[0].transcript;
      
      if (result.isFinal) {
        setTranscript(prev => prev + ' ' + transcript);
      } else {
        const interimTranscript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setTranscript(interimTranscript);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      
      if (event.error === 'network') {
        setError('Network error. Retrying...');
        // Attempt to reconnect after 2 seconds
        retryTimeoutRef.current = setTimeout(() => {
          if (isListening) {
            try {
              recognition.start();
            } catch (e) {
              setError('Failed to reconnect. Please try again.');
              setIsListening(false);
            }
          }
        }, 2000);
      } else {
        setError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      }
    };

    recognition.onend = () => {
      if (isListening) {
        try {
          recognition.start();
        } catch (e) {
          setError('Recognition ended unexpectedly');
          setIsListening(false);
        }
      }
    };

    return recognition;
  }, [isListening]);

  useEffect(() => {
    recognitionRef.current = initializeRecognition();

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [initializeRecognition]);

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) {
      setError('Speech recognition is not supported');
      return;
    }

    try {
      if (isListening) {
        recognitionRef.current.stop();
      } else {
        setError(null);
        recognitionRef.current.start();
      }
      setIsListening(!isListening);
    } catch (error) {
      console.error('Toggle listening error:', error);
      setError('Failed to toggle speech recognition');
      setIsListening(false);
    }
  }, [isListening]);

  const clearTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return {
    isListening,
    transcript,
    error,
    toggleListening,
    clearTranscript,
    setError
  };
}