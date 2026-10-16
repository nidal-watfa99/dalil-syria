import { useState, useEffect, useCallback, useRef } from 'react';

// Speech recognition interface for browsers
interface SpeechRecognitionEventLike extends Event {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
      isFinal: boolean;
    };
    length: number;
  };
}

export function useVoiceSearch(onResult?: (transcript: string) => void) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'ar-SA'; // Arabic speech recognition

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event: SpeechRecognitionEventLike) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
        if (onResult && currentTranscript.trim()) {
          onResult(currentTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setError('لم يتم منح إذن استخدام الميكروفون في المتصفح. يرجى تفعيل الإذن من إعدادات الموقع.');
        } else if (event.error === 'no-speech') {
          setError('لم يتم التقاط أي صوت. يرجى التحدث بوضوح قرب الميكروفون.');
        } else {
          setError(`تعذر التعرف الصوتي: ${event.error || 'خطأ غير معروف'}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (e) {
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // ignore
        }
      }
    };
  }, [onResult]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      setError('التعرف الصوتي غير مدعوم في هذا المتصفح. يمكنك استخدام الكتابة اليدوية بدلاً من ذلك.');
      return;
    }
    setTranscript('');
    setError(null);
    try {
      recognitionRef.current.start();
    } catch (err: any) {
      // If already started, stop then start
      try {
        recognitionRef.current.stop();
        setTimeout(() => recognitionRef.current?.start(), 150);
      } catch (e) {
        setError('تعذر تشغيل الميكروفون حالياً. تحقق من أذونات المتصفح.');
      }
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
    }
    setIsListening(false);
  }, []);

  return {
    isListening,
    transcript,
    error,
    isSupported,
    startListening,
    stopListening,
    setTranscript,
  };
}
