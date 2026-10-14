import { useState, useEffect, useRef, useCallback } from 'react';
import { logDiagnostic } from '../utils/storageAndLogs';

// Type definitions for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: ((this: ISpeechRecognition, ev: Event) => void) | null;
  onresult: ((this: ISpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
  onerror: ((this: ISpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null;
  onend: ((this: ISpeechRecognition, ev: Event) => void) | null;
}

interface SpeechRecognitionConstructor {
  new (): ISpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

export interface VoiceSearchState {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  interimTranscript: string;
  errorMessage: string | null;
  readinessStatus: 'ready' | 'listening' | 'processing' | 'unsupported' | 'permission_denied';
}

export function useVoiceSearch(onResult?: (transcript: string) => void) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [readinessStatus, setReadinessStatus] = useState<VoiceSearchState['readinessStatus']>('ready');

  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  // Check support and setup on mount
  useEffect(() => {
    const SpeechConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechConstructor) {
      setIsSupported(true);
      setReadinessStatus('ready');
      logDiagnostic('info', 'VoiceSearch', 'Web Speech API is fully supported in this browser environment');
    } else {
      setIsSupported(false);
      setReadinessStatus('unsupported');
      logDiagnostic('warn', 'VoiceSearch', 'Web Speech API is not natively supported in this browser; fallback ready');
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const startListening = useCallback(() => {
    setErrorMessage(null);
    setTranscript('');
    setInterimTranscript('');

    const SpeechConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechConstructor) {
      setErrorMessage('متصفحك لا يدعم التعرف الصوتي المباشر. يمكنك استخدام الكلمات الصوتية المقترحة.');
      setReadinessStatus('unsupported');
      return;
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }

      const recognition = new SpeechConstructor();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      // Primary language: Syrian Arabic, with Arabic dialects supported
      recognition.lang = 'ar-SY';

      recognition.onstart = () => {
        setIsListening(true);
        setReadinessStatus('listening');
        logDiagnostic('info', 'VoiceSearch', 'Started voice listening session (ar-SY)');
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let currentInterim = '';
        let currentFinal = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item.isFinal) {
            currentFinal += item[0].transcript;
          } else {
            currentInterim += item[0].transcript;
          }
        }

        if (currentInterim) {
          setInterimTranscript(currentInterim);
        }

        if (currentFinal) {
          const cleanText = currentFinal.trim();
          setTranscript(cleanText);
          setIsListening(false);
          setReadinessStatus('ready');
          logDiagnostic('info', 'VoiceSearch', `Recognized speech: "${cleanText}"`);
          if (onResult) {
            onResult(cleanText);
          }
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        setIsListening(false);
        logDiagnostic('warn', 'VoiceSearch', `Speech recognition error: ${event.error}`);

        if (event.error === 'not-allowed') {
          setErrorMessage('تم رفض الإذن باستخدام الميكروفون. يرجى السماح للتطبيق بالوصول إلى الميكروفون.');
          setReadinessStatus('permission_denied');
        } else if (event.error === 'no-speech') {
          setErrorMessage('لم يتم التقاط أي صوت. يرجى التحدث بوضوح قرب الميكروفون.');
          setReadinessStatus('ready');
        } else if (event.error === 'network') {
          setErrorMessage('تعذر الاتصال بخدمة التعرف الصوتي. تأكد من اتصال الإنترنت.');
          setReadinessStatus('ready');
        } else {
          setErrorMessage(`خطأ في التعرف الصوتي (${event.error}). يرجى المحاولة ثانية.`);
          setReadinessStatus('ready');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        setReadinessStatus('ready');
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: unknown) {
      setIsListening(false);
      setReadinessStatus('ready');
      const msg = err instanceof Error ? err.message : 'تعذر بدء التسجيل الصوتي';
      setErrorMessage(msg);
      logDiagnostic('error', 'VoiceSearch', 'Failed to initialize speech recognition', err);
    }
  }, [onResult]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsListening(false);
    setReadinessStatus('ready');
  }, []);

  return {
    isListening,
    isSupported,
    transcript,
    interimTranscript,
    errorMessage,
    readinessStatus,
    startListening,
    stopListening,
    clearError: () => setErrorMessage(null),
  };
}
