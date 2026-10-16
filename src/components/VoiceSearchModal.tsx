import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Search, X, AlertCircle, Volume2, Sparkles } from 'lucide-react';
import { useVoiceSearch } from '../hooks/useVoiceSearch';

interface VoiceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
}

export const VoiceSearchModal: React.FC<VoiceSearchModalProps> = ({
  isOpen,
  onClose,
  onSearch,
}) => {
  const [editedTranscript, setEditedTranscript] = useState('');

  const {
    isListening,
    transcript,
    error,
    isSupported,
    startListening,
    stopListening,
  } = useVoiceSearch((text) => {
    setEditedTranscript(text);
  });

  useEffect(() => {
    if (isOpen) {
      setEditedTranscript('');
      startListening();
    } else {
      stopListening();
    }
  }, [isOpen, startListening, stopListening]);

  useEffect(() => {
    if (transcript) {
      setEditedTranscript(transcript);
    }
  }, [transcript]);

  if (!isOpen) return null;

  const handleExecuteSearch = () => {
    if (editedTranscript.trim()) {
      onSearch(editedTranscript.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#0e1424] border border-cyan-500/20 p-6 shadow-2xl shadow-cyan-950/50 text-right">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Mic className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              البحث الصوتي الذكي باللغة العربية
              <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
            <p className="text-xs text-slate-400">
              تحدث باسم المعاملة أو الوزارة أو المحافظة أو وسيلة النقل
            </p>
          </div>
        </div>

        {/* Listening Animation Circle */}
        <div className="flex flex-col items-center justify-center py-6">
          <div className="relative flex items-center justify-center">
            {isListening && (
              <>
                <div className="absolute w-28 h-28 rounded-full bg-cyan-500/20 animate-ping" />
                <div className="absolute w-20 h-20 rounded-full bg-cyan-500/30 animate-pulse" />
              </>
            )}
            <button
              onClick={isListening ? stopListening : startListening}
              className={`relative z-10 flex h-20 w-20 items-center justify-center rounded-full text-white shadow-xl transition-all ${
                isListening
                  ? 'bg-gradient-to-tr from-rose-600 to-amber-500 ring-4 ring-rose-500/30'
                  : 'bg-gradient-to-tr from-cyan-600 to-blue-600 hover:scale-105'
              }`}
            >
              {isListening ? <Mic className="w-9 h-9 animate-bounce" /> : <MicOff className="w-8 h-8" />}
            </button>
          </div>

          <div className="mt-4 text-center">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                isListening
                  ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {isListening ? 'جاري الاستماع... تحدث الآن' : 'اضغط على الميكروفون لبدء التسجيل'}
            </span>
          </div>

          {/* Sound wave bars simulation when listening */}
          {isListening && (
            <div className="flex items-center gap-1.5 mt-3 h-6">
              {[0.4, 0.9, 0.6, 1.2, 0.8, 1.5, 0.7, 1.1, 0.5].map((scale, i) => (
                <span
                  key={i}
                  style={{
                    height: `${Math.max(6, Math.min(24, scale * 16))}px`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                  className="w-1 bg-gradient-to-t from-cyan-500 to-blue-400 rounded-full animate-pulse"
                />
              ))}
            </div>
          )}
        </div>

        {/* Real-time recognized text preview & edit box */}
        <div className="mt-4">
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            النص الملتقط (يمكنك تعديله قبل البحث):
          </label>
          <div className="relative">
            <textarea
              rows={2}
              value={editedTranscript}
              onChange={(e) => setEditedTranscript(e.target.value)}
              placeholder="مثال: جواز السفر الفوري المستعجل، أو تكلفة بولمان حلب، أو وثيقة غير محكوم..."
              className="w-full rounded-xl bg-slate-900/90 border border-slate-700/80 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 resize-none"
            />
            {editedTranscript && (
              <button
                onClick={() => setEditedTranscript('')}
                className="absolute left-2.5 top-2.5 text-slate-500 hover:text-slate-300"
                title="مسح النص"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mt-3 flex items-start gap-2 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {!isSupported && (
          <div className="mt-3 rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-xs text-amber-300">
            متصفحك الحالي لا يدعم التعرف الصوتي المباشر. يرجى استخدام متصفح Chrome أو Edge أو كتابة نص البحث في الحقل أعلاه.
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={handleExecuteSearch}
            disabled={!editedTranscript.trim()}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 py-2.5 text-sm font-bold text-white shadow-lg shadow-cyan-950/40 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition active:scale-98"
          >
            <Search className="w-4 h-4" />
            <span>تنفيذ البحث الآن</span>
          </button>
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-700 transition"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
};
