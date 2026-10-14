import React from 'react';
import { ShieldCheck, Mail, Terminal, Flag, Compass, Heart } from 'lucide-react';

interface FooterProps {
  onOpenFeedback: () => void;
  onOpenConsole: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenFeedback,
  onOpenConsole,
  onOpenAdmin,
}) => {
  return (
    <footer className="mt-20 border-t border-slate-800 bg-[#070A10] text-slate-400 text-xs py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Top 3-Column Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Identity */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-slate-900 border border-amber-500/30 p-1 flex items-center justify-center">
                <img src="/icon.svg" alt="دليل سوريا" className="w-full h-full object-contain" />
              </div>
              <span className="text-sm font-extrabold text-white">
                دليل سوريا | DALIL SYRIA
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs max-w-md">
              المنظومة الوطنية الموحدة للمعاملات الحكومية والمواقع الجغرافية وأجور النقل البري في الجمهورية العربية السورية. صُمم وفق معايير برمجية صارمة ترفض اختلاق أو تخمين أي معلومة دون سند قانوني رسمي.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 text-[11px] font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>ميثاق الشفافية: نربط كل معلومة بمصدرها، تاريخ سريانها، ورقم مرسومها القانوني.</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs">أدوات الوصول السريع</h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>
                <button onClick={onOpenFeedback} className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <Flag className="w-3.5 h-3.5" />
                  <span>الإبلاغ عن معلومة غير دقيقة</span>
                </button>
              </li>
              <li>
                <button onClick={onOpenConsole} className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>سجل تشخيص النظام (Console)</span>
                </button>
              </li>
              <li>
                <button onClick={onOpenAdmin} className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>لوحة إدارة وتحقق المصادر</span>
                </button>
              </li>
              <li>
                <a
                  href="/dalil-syria-complete-source.zip"
                  download="dalil-syria-complete-source.zip"
                  className="text-amber-400 hover:text-amber-300 font-bold transition-colors flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>تحميل الكود المصدري الكامل (ZIP)</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Legal */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs">التواصل والمسؤولية</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              تطوير وإشراف هندسي مستقل لخدمة المواطنين السوريين. للتواصل والملاحظات المباشرة:
            </p>
            <a
              href="mailto:nidalwatfa99@gmail.com"
              className="inline-flex items-center gap-1.5 text-amber-400 hover:underline font-mono text-xs pt-1"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>nidalwatfa99@gmail.com</span>
            </a>
          </div>
        </div>

        {/* Bottom Baseline Bar */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>
            جميع الحقوق محفوظة © {new Date().getFullYear()} الجمهورية العربية السورية — دليل سوريا الرقمي
          </div>
          <div className="flex items-center gap-4">
            <span>إصدار التطبيق: v1.0.0-PROD</span>
            <span aria-hidden="true">·</span>
            <span>آخر تدقيق للبيانات: أيلول 2024</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
