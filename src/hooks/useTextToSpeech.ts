import { useState, useEffect, useCallback, useRef } from 'react';

export function useTextToSpeech() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [speechRate, setSpeechRate] = useState(1);
  const [isSupported, setIsSupported] = useState(true);
  const [hasArabicVoice, setHasArabicVoice] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsSupported(false);
      return;
    }

    const checkVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const arabic = voices.some((v) => v.lang.startsWith('ar'));
      setHasArabicVoice(arabic);
    };

    checkVoices();
    window.speechSynthesis.onvoiceschanged = checkVoices;

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = useCallback(
    (text: string, rate: number = speechRate) => {
      if (!isSupported || typeof window === 'undefined') return;

      window.speechSynthesis.cancel(); // Stop any ongoing speech

      // Clean markdown or excess punctuation for smoother voice
      const cleanText = text
        .replace(/[*#_`~[\]()]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (!cleanText) return;

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'ar-SA';
      utterance.rate = rate;
      utterance.pitch = 1;

      // Match Arabic voice if available
      const voices = window.speechSynthesis.getVoices();
      const arabicVoice = voices.find((v) => v.lang.startsWith('ar') || v.lang.includes('Arabic'));
      if (arabicVoice) {
        utterance.voice = arabicVoice;
      }

      utterance.onstart = () => {
        setIsPlaying(true);
        setIsPaused(false);
        setCurrentText(cleanText);
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentText('');
      };

      utterance.onerror = (e) => {
        console.warn('TTS error:', e);
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentText('');
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [isSupported, speechRate]
  );

  const pause = useCallback(() => {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  }, []);

  const resume = useCallback(() => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  }, []);

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentText('');
  }, []);

  return {
    isPlaying,
    isPaused,
    currentText,
    speechRate,
    setSpeechRate,
    isSupported,
    hasArabicVoice,
    speak,
    pause,
    resume,
    stop,
  };
}
