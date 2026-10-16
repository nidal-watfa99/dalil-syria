import React from 'react';
import {
  Settings,
  Type,
  Sun,
  Moon,
  Volume2,
  Trash2,
  Shield,
  Eye,
  Check,
  RotateCcw,
} from 'lucide-react';

interface SettingsViewProps {
  fontSize: 'normal' | 'large' | 'xlarge';
  onFontSizeChange: (size: 'normal' | 'large' | 'xlarge') => void;
  highContrast: boolean;
  onHighContrastChange: (enabled: boolean) => void;
  reduceMotion: boolean;
  onReduceMotionChange: (enabled: boolean) => void;
  speechRate: number;
  onSpeechRateChange: (rate: number) => void;
  onClearStorage: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  fontSize,
  onFontSizeChange,
  highContrast,
  onHighContrastChange,
  reduceMotion,
  onReduceMotionChange,
  speechRate,
  onSpeechRateChange,
  onClearStorage,
}) => {
  return (
    <div className="space-y-6 animate-fadeIn text-right max-w-4xl mx-auto">
      {/* Header with Google AI Studio Styling */}
      <div className="p-6 rounded-3xl bg-[#1e1f20] border border-[#333537] shadow-xl">
        <span className="inline-block px-3 py-0.5 rounded-full text-xs font-bold bg-[#1a73e8]/20 text-[#8ab4f8] border border-[#1a73e8]/30 mb-2">
          التخصيص والوصول والملفات المصدرية
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          الإعدادات وخيارات إمكانية الوصول
        </h1>
        <p className="text-xs sm:text-sm text-[#c4c7c5] mt-1 max-w-xl leading-relaxed">
          تعديل حجم الخطوط، التباين العالي، سرعة القراءة الصوتية، وإدارة الذاكرة والتخزين المحلي.
        </p>
      </div>

      {/* Font Scaling Setting */}
      <div className="p-5 rounded-3xl bg-[#1e1f20] border border-[#333537] space-y-3">
        <div className="flex items-center gap-2.5">
          <Type className="w-5 h-5 text-[#8ab4f8]" />
          <div>
            <h3 className="text-sm font-bold text-white">تكبير وتعديل حجم الخط العربي</h3>
            <p className="text-xs text-[#8e918f]">تحكم بحجم النصوص لضمان قراءة مريحة وواضحة</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2.5 pt-1">
          {[
            { id: 'normal', label: 'قياسي (100%)' },
            { id: 'large', label: 'كبير (115%)' },
            { id: 'xlarge', label: 'كبير جداً (130%)' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onFontSizeChange(item.id as any)}
              className={`p-3 rounded-2xl text-xs font-bold transition border ${
                fontSize === item.id
                  ? 'bg-[#1a73e8] text-white border-[#8ab4f8] shadow-md'
                  : 'bg-[#282a2c] text-[#c4c7c5] border-[#333537] hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Accessibility: High Contrast & Reduce Motion */}
      <div className="p-5 rounded-3xl bg-[#1e1f20] border border-[#333537] space-y-4">
        <div className="flex items-center gap-2.5">
          <Eye className="w-5 h-5 text-amber-400" />
          <div>
            <h3 className="text-sm font-bold text-white">إمكانية الوصول البصري والتباين المريح</h3>
            <p className="text-xs text-[#8e918f]">خيارات راحة العين وذوي الاحتياجات البصرية</p>
          </div>
        </div>

        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#131314] border border-[#333537]">
            <div>
              <strong className="block text-xs font-bold text-white">وضع التباين العالي (High Contrast)</strong>
              <span className="text-[11px] text-[#8e918f]">حدود بارزة وأسود نقي لتسهيل القراءة</span>
            </div>
            <button
              onClick={() => onHighContrastChange(!highContrast)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                highContrast ? 'bg-[#1a73e8]' : 'bg-[#282a2c] border border-[#333537]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform absolute top-0.5 ${
                  highContrast ? 'right-6' : 'right-0.5'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#131314] border border-[#333537]">
            <div>
              <strong className="block text-xs font-bold text-white">تقليل الحركة والانتقالات (Reduce Motion)</strong>
              <span className="text-[11px] text-[#8e918f]">تعطيل الرسوم المتحركة لمن يعانون من دوار الحركة</span>
            </div>
            <button
              onClick={() => onReduceMotionChange(!reduceMotion)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                reduceMotion ? 'bg-[#1a73e8]' : 'bg-[#282a2c] border border-[#333537]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform absolute top-0.5 ${
                  reduceMotion ? 'right-6' : 'right-0.5'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Audio Speed */}
      <div className="p-5 rounded-3xl bg-[#1e1f20] border border-[#333537] space-y-3">
        <div className="flex items-center gap-2.5">
          <Volume2 className="w-5 h-5 text-emerald-400" />
          <div>
            <h3 className="text-sm font-bold text-white">سرعة القراءة الصوتية (Text-to-Speech)</h3>
            <p className="text-xs text-[#8e918f]">تحديد سرعة النطق عند قراءة تفاصيل المعاملات والأسعار</p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2.5 pt-1">
          {[
            { rate: 0.8, label: '0.8x (هادئ)' },
            { rate: 1.0, label: '1.0x (طبيعي)' },
            { rate: 1.2, label: '1.2x (سريع)' },
            { rate: 1.4, label: '1.4x (أسرع)' },
          ].map((item) => (
            <button
              key={item.rate}
              onClick={() => onSpeechRateChange(item.rate)}
              className={`p-3 rounded-2xl text-xs font-bold transition border ${
                speechRate === item.rate
                  ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                  : 'bg-[#282a2c] text-[#c4c7c5] border-[#333537] hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Storage and Reset */}
      <div className="p-5 rounded-3xl bg-[#1e1f20] border border-[#333537] space-y-3">
        <div className="flex items-center gap-2.5">
          <Trash2 className="w-5 h-5 text-rose-400" />
          <div>
            <h3 className="text-sm font-bold text-white">إدارة الذاكرة المؤقتة والبيانات المخزنة</h3>
            <p className="text-xs text-[#8e918f]">إعادة ضبط المفضلة وقوائم التحقق والإعدادات</p>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={() => {
              if (window.confirm('هل أنت متأكد من رغبتك في مسح الذاكرة المؤقتة والمفضلة المحفوظة؟')) {
                onClearStorage();
              }
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-rose-500/40 bg-rose-950/20 text-rose-300 text-xs font-bold hover:bg-rose-950/40 transition active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>مسح الذاكرة المحلية والبدء من جديد</span>
          </button>
        </div>
      </div>
    </div>
  );
};
