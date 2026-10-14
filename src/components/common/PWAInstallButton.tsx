import React, { useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export const PWAInstallButton: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-all shadow-sm ${className}`}
        title="تثبيت التطبيق على الشاشة الرئيسية (PWA)"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="whitespace-nowrap">تثبيت التطبيق</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 transition-all ${className}`}
          title="تثبيت التطبيق على نظام iOS"
        >
          <Smartphone className="w-3.5 h-3.5 text-amber-400" />
          <span className="whitespace-nowrap">تثبيت على آيفون</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-xl glass-panel p-6 shadow-2xl border border-slate-700 text-slate-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-amber-400">تثبيت التطبيق على iPhone / iPad</h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-3 text-xs leading-relaxed text-slate-300">
                <p className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold">1</span>
                  <span>اضغط على زر <strong>المشاركة (Share)</strong> في شريط متصفح سفاري بالأسفل.</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold">2</span>
                  <span>مرر القائمة للأسفل واختر <strong>«إضافة إلى الشاشة الرئيسية» (Add to Home Screen)</strong>.</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold">3</span>
                  <span>اضغط على <strong>«إضافة» (Add)</strong> في الزاوية العلوية ليظهر التطبيق في شاشتك بدون شريط المتصفح.</span>
                </p>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              >
                فهمت ذلك
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
