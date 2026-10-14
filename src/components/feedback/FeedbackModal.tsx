import React, { useState } from 'react';
import {
  X,
  Mail,
  Send,
  Flag,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { InaccuracyReport } from '../../types';
import { saveInaccuracyReport, logDiagnostic, getSystemDiagnosticsInfo } from '../../utils/storageAndLogs';

interface FeedbackModalProps {
  initialTarget?: {
    type: 'transaction' | 'authority' | 'transport' | 'visa' | 'general';
    id: string;
    name: string;
  };
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ initialTarget, onClose }) => {
  const [targetType, setTargetType] = useState<InaccuracyReport['targetType']>(
    initialTarget?.type || 'general'
  );
  const [targetName, setTargetName] = useState<string>(initialTarget?.name || '');
  const [category, setCategory] = useState<InaccuracyReport['issueCategory']>('fees');
  const [description, setDescription] = useState<string>('');
  const [proposedCorrection, setProposedCorrection] = useState<string>('');
  const [reporterName, setReporterName] = useState<string>('');
  const [reporterContact, setReporterContact] = useState<string>('');
  const [includeDiagnostics, setIncludeDiagnostics] = useState<boolean>(true);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const report: InaccuracyReport = {
      id: `rep-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      targetType,
      targetId: initialTarget?.id || 'manual',
      targetName: targetName.trim() || 'بلاغ عام',
      reporterName: reporterName.trim() || undefined,
      reporterContact: reporterContact.trim() || undefined,
      issueCategory: category,
      description: description.trim(),
      proposedCorrection: proposedCorrection.trim() || undefined,
      status: 'pending',
      createdAt: new Date().toLocaleString('ar-SY'),
    };

    saveInaccuracyReport(report);
    logDiagnostic('info', 'Feedback', `User submitted inaccuracy report for ${report.targetName}`);
    setSubmitted(true);
  };

  const handleSendDirectEmail = () => {
    const sys = getSystemDiagnosticsInfo();
    const subject = encodeURIComponent(`[دليل سوريا - بلاغ تصحيح] ${targetName || 'ملاحظة عامة'}`);
    const body = encodeURIComponent(
      `نوع البلاغ: ${category}\n` +
      `الجهة أو المعاملة: ${targetName}\n` +
      `الوصف:\n${description}\n\n` +
      `التصحيح المقترح:\n${proposedCorrection || 'لا يوجد'}\n\n` +
      `مقدم البلاغ: ${reporterName || 'فاعل خير'} (${reporterContact || 'غير محدد'})\n\n` +
      (includeDiagnostics ? `معلومات النظام:\n- المتصفح: ${sys.userAgent}\n- النمط: ${sys.displayMode}\n- التوقيت: ${sys.localTime}` : '')
    );
    window.location.href = `mailto:nidalwatfa99@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 md:p-6 overflow-hidden">
      <div className="w-full max-w-lg glass-panel rounded-2xl border border-slate-700/80 shadow-2xl flex flex-col overflow-hidden text-slate-100 animate-fade-in text-xs md:text-sm">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
              <Flag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">الإبلاغ عن معلومة غير دقيقة أو اقتراح</h3>
              <p className="text-[11px] text-slate-400">نلتزم بالتدقيق والتحقق من كل بلاغ قبل الاعتماد</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/40">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">تم استلام بلاغك بنجاح</h4>
              <p className="text-xs text-slate-300 mt-1.5 max-w-sm mx-auto leading-relaxed">
                سيعمل فريق التدقيق على مراجعة السند القانوني ومقاطعته مع الجريدة الرسمية أو الاتصال بالجهة الحكومية قبل تحديث المحتوى.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
              <button
                onClick={handleSendDirectEmail}
                className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>إرسال نسخة عبر البريد للمطور</span>
              </button>
              <button
                onClick={onClose}
                className="py-2.5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                إغلاق
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto max-h-[75vh]">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                اسم المعاملة أو الجهة المعنية
              </label>
              <input
                type="text"
                value={targetName}
                onChange={(e) => setTargetName(e.target.value)}
                placeholder="مثلاً: رسوم تجديد جواز السفر العادي"
                required
                className="w-full py-2 px-3 rounded-lg recessed-field text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">نوع الملاحظة</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as InaccuracyReport['issueCategory'])}
                  className="w-full py-2 px-2.5 rounded-lg recessed-field text-white focus:outline-none cursor-pointer"
                >
                  <option value="fees">تغير في الرسوم المقررة</option>
                  <option value="documents">نقص أو خطأ في الأوراق المطلوبة</option>
                  <option value="address_hours">خطأ في العنوان أو ساعات العمل</option>
                  <option value="broken_link">رابط معطل أو منصة متوقفة</option>
                  <option value="status_changed">تعديل تشريعي أو قانوني جديد</option>
                  <option value="other">ملاحظة عامة أخرى</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  اسمك أو وسيلة اتصال (اختياري)
                </label>
                <input
                  type="text"
                  value={reporterContact}
                  onChange={(e) => setReporterContact(e.target.value)}
                  placeholder="رقم الهاتف أو البريد الإلكتروني"
                  className="w-full py-2 px-3 rounded-lg recessed-field text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                وصف الخطأ أو الملاحظة بالتفصيل
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="يرجى توضيح المعلومة الخاطئة بدقة..."
                required
                className="w-full py-2 px-3 rounded-lg recessed-field text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                التصحيح المقترح ورقم القرار أو المصدر إن وجد
              </label>
              <input
                type="text"
                value={proposedCorrection}
                onChange={(e) => setProposedCorrection(e.target.value)}
                placeholder="مثال: صدر القرار رقم 112 وأصبح الرسم 312,000 ل.س"
                className="w-full py-2 px-3 rounded-lg recessed-field text-white focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-1 text-slate-400">
              <input
                type="checkbox"
                id="includeDiag"
                checked={includeDiagnostics}
                onChange={(e) => setIncludeDiagnostics(e.target.checked)}
                className="rounded accent-amber-500"
              />
              <label htmlFor="includeDiag" className="text-xs cursor-pointer">
                إرفاق معلومات التشخيص التقنية للمساعدة في فحص المشكلة
              </label>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
              <span className="text-[11px] text-slate-500">
                بريد المطور المعتمد: nidalwatfa99@gmail.com
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="py-2 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 py-2 px-5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>إرسال البلاغ</span>
                </button>
              </div>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
