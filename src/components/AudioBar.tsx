import React from 'react';
import { Volume2, VolumeX, Pause, Play, Square, FastForward } from 'lucide-react';

interface AudioBarProps {
  isPlaying: boolean;
  isPaused: boolean;
  currentText: string;
  speechRate: number;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onRateChange: (rate: number) => void;
}

export const AudioBar: React.FC<AudioBarProps> = ({
  isPlaying,
  isPaused,
  currentText,
  speechRate,
  onPause,
  onResume,
  onStop,
  onRateChange,
}) => {
  if (!isPlaying && !isPaused) return null;

  const cycleRate = () => {
    if (speechRate === 1) onRateChange(1.25);
    else if (speechRate === 1.25) onRateChange(0.8);
    else onRateChange(1);
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:w-96 z-40 animate-slideUp">
      <div className="rounded-2xl bg-[#0f172a]/95 backdrop-blur-md border border-cyan-500/30 p-3 shadow-2xl shadow-cyan-950/60 flex items-center justify-between gap-3 text-right">
        {/* Play/Pause & Stop Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={isPaused ? onResume : onPause}
            className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition active:scale-95"
            title={isPaused ? 'استئناف القراءة' : 'إيقاف مؤقت'}
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button>
          <button
            onClick={onStop}
            className="p-2 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition active:scale-95"
            title="إيقاف القراءة"
          >
            <Square className="w-4 h-4" />
          </button>
          <button
            onClick={cycleRate}
            className="px-2 py-1 rounded-xl bg-slate-800 text-[11px] font-bold text-cyan-300 hover:bg-slate-700 transition"
            title="تغيير سرعة القراءة"
          >
            {speechRate}x
          </button>
        </div>

        {/* Text preview */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-semibold mb-0.5">
            <Volume2 className="w-3.5 h-3.5 animate-pulse" />
            <span>قراءة صوتية باللغة العربية</span>
            {isPaused && <span className="text-amber-400 text-[10px]">(متوقف مؤقتاً)</span>}
          </div>
          <p className="text-xs text-slate-300 truncate font-normal">
            {currentText || 'جاري القراءة...'}
          </p>
        </div>
      </div>
    </div>
  );
};
