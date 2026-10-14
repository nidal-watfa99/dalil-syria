import React, { useState } from 'react';
import { Mic, MicOff, Volume2, CheckCircle2, AlertCircle, X, Sparkles } from 'lucide-react';
import { useVoiceSearch } from '../../hooks/useVoiceSearch';

interface VoiceSearchButtonProps {
  onTranscript: (text: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const VoiceSearchButton: React.FC<VoiceSearchButtonProps> = ({
  onTranscript,
  className = '',
  size = 'md',
  showLabel = false,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const {
    isListening,
    isSupported,
    transcript,
    interimTranscript,
    errorMessage,
    readinessStatus,
    startListening,
    stopListening,
    clearError,
  } = useVoiceSearch((finalText) => {
    onTranscript(finalText);
    setTimeout(() => {
      setModalOpen(false);
    }, 900);
  });

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setModalOpen(true);
    startListening();
  };

  const handleSampleQuery = (sampleText: string) => {
    onTranscript(sampleText);
    setModalOpen(false);
  };

  const sampleVoiceQueries = [
    'أريد استخراج جواز سفر في طرطوس',
    'ما هي أوراق ورسوم غير محكوم؟',
    'أجور البولمان من دمشق إلى حلب',
    'إجراءات ورسوم فراغ عقار سكني',
    'شروط بدل الخدمة العسكرية للمغتربين',
    'تجديد رخصة القيادة الخاصة بدمشق',
  ];

  const sizeClasses = {
    sm: 'p-1.5 text-xs',
    md: 'p-2.5 text-xs md:text-sm',
    lg: 'py-3 px-4 text-sm font-semibold',
  };

  return (
    <>
      <button
        type="button"
        onClick={handleButtonClick}
        title="البحث الصوتي الذكي (تحدث بصوتك بالعربية)"
        className={`relative inline-flex items-center justify-center gap-1.5 rounded-xl transition-all ${sizeClasses[size]} ${
          isListening
            ? 'bg-red-500 text-white animate-pulse ring-4 ring-red-500/30'
            : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:border-amber-400/60 shadow-sm'
        } ${className}`}
      >
        <Mic className={`${size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} ${isListening ? 'animate-bounce text-white' : ''}`} />
        {showLabel && (
          <span className="font-semibold text-xs whitespace-nowrap">
            {isListening ? 'جارٍ الاستماع...' : 'بحث صوتي'}
          </span>
        )}
      </button>

      {/* Voice Search Modal / Listening Dialog */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in"
          onClick={() => {
            stopListening();
            setModalOpen(false);
          }}
        >
          <div
            className="w-full max-w-lg glass-panel p-6 rounded-2xl border border-amber-500/40 text-slate-100 shadow-2xl space-y-5 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center">
                  <Volume2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm md:text-base text-white">
                    البحث الصوتي الذكي · دليل سوريا
                  </h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>ميزة البحث الصوتي جاهزة ومفعلة (اللهجة السورية والعربية)</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  stopListening();
                  setModalOpen(false);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Central Animated Mic Sphere */}
            <div className="flex flex-col items-center justify-center py-6 space-y-4">
              <div className="relative">
                {isListening && (
                  <>
                    <span className="absolute -inset-4 rounded-full bg-amber-500/20 animate-ping" />
                    <span className="absolute -inset-8 rounded-full bg-amber-500/10 animate-pulse" />
                  </>
                )}
                <button
                  type="button"
                  onClick={isListening ? stopListening : startListening}
                  className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-transform ${
                    isListening
                      ? 'bg-red-500 text-white scale-110 shadow-red-500/40 ring-4 ring-red-400/50'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950 hover:scale-105 shadow-amber-500/30'
                  }`}
                >
                  {isListening ? (
                    <Mic className="w-9 h-9 animate-bounce" />
                  ) : (
                    <Mic className="w-9 h-9" />
                  )}
                </button>
              </div>

              <div className="text-center space-y-1">
                <p className="font-bold text-sm text-white">
                  {isListening ? 'نحن نستمع إليك الآن... تفضل بالسؤال' : 'انقر على الميكروفون لبدء التحدث'}
                </p>
                <p className="text-xs text-slate-400">
                  مثال: «أريد استخراج جواز سفر في طرطوس» أو «أجور البولمان إلى حلب»
                </p>
              </div>

              {/* Live Spoken Transcript Display */}
              {(interimTranscript || transcript) && (
                <div className="w-full p-4 rounded-xl bg-slate-950/80 border border-amber-500/50 text-center animate-fade-in">
                  <span className="text-[10px] text-amber-400 font-mono block mb-1">
                    النص الملتقط صوتياً:
                  </span>
                  <p className="text-sm md:text-base font-bold text-white">
                    {transcript || interimTranscript}
                  </p>
                </div>
              )}

              {/* Error message if mic denied */}
              {errorMessage && (
                <div className="w-full p-3 rounded-xl bg-red-950/80 border border-red-700/60 text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>

            {/* Quick Test Voice Presets */}
            <div className="border-t border-slate-800 pt-3 space-y-2">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>أو جرب استعلاماً صوتياً سريعاً بنقرة واحدة:</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {sampleVoiceQueries.map((query, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSampleQuery(query)}
                    className="p-2.5 text-right rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-xs text-slate-200 hover:text-amber-300 hover:border-amber-500/30 transition-all flex items-center justify-between"
                  >
                    <span className="line-clamp-1">{query}</span>
                    <Volume2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mr-2" />
                  </button>
                ))}
              </div>
            </div>

            {/* Status Footer */}
            <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
              <span>محرك التعرف الصوتي: Web Speech API (ar-SY)</span>
              <button
                type="button"
                onClick={() => {
                  stopListening();
                  setModalOpen(false);
                }}
                className="text-xs font-semibold text-amber-400 hover:underline"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
