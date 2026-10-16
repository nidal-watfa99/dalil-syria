import React, { useState } from 'react';
import {
  X,
  FileText,
  Clock,
  DollarSign,
  MapPin,
  Building,
  CheckCircle2,
  ExternalLink,
  Volume2,
  Bookmark,
  Share2,
  Printer,
  ShieldCheck,
  AlertTriangle,
  Phone,
  HelpCircle,
} from 'lucide-react';
import { Transaction } from '../types';

interface TransactionModalProps {
  transaction: Transaction | null;
  onClose: () => void;
  onSpeak: (text: string) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onShare: (item: Transaction) => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  transaction,
  onClose,
  onSpeak,
  isFavorite,
  onToggleFavorite,
  onShare,
}) => {
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});

  if (!transaction) return null;

  const toggleDoc = (docName: string) => {
    setCheckedDocs((prev) => ({
      ...prev,
      [docName]: !prev[docName],
    }));
  };

  const handleReadAloud = () => {
    const textToRead = `معاملة: ${transaction.name}. 
الجهة المسؤولة: ${transaction.ministryName}، ${transaction.responsibleEntity}. 
الرسوم الرسمية: ${transaction.fee.formattedFee}. 
المدة المتوقعة: ${transaction.expectedDuration}. 
مكان تقديم الطلب: ${transaction.submissionPlace}. 
الشروط الأساسية: ${transaction.conditions.join('، ثم ')}. 
الوثائق المطلوبة: ${transaction.requiredDocuments.map((d) => d.name + (d.isOriginal ? ' أصل' : ' صورة مصدقة')).join('، و')}. 
خطوات المعاملة: ${transaction.steps.join('، ثم ')}. 
تاريخ آخر تحقق: ${transaction.lastVerifiedDate}.`;
    onSpeak(textToRead);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-5 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-3xl bg-[#0d1424] border border-cyan-500/20 shadow-2xl shadow-cyan-950/60 text-right overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="relative p-5 sm:p-6 bg-gradient-to-l from-slate-900 via-[#10182c] to-[#0d1424] border-b border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  {transaction.ministryName}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                    transaction.status === 'متاحة'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : transaction.status === 'متوقفة'
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}
                >
                  {transaction.status}
                </span>
                <span className="text-[11px] text-slate-400">
                  تحقق: {transaction.lastVerifiedDate}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white leading-snug">
                {transaction.name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>{transaction.responsibleEntity}</span>
              </p>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handleReadAloud}
                className="p-2 rounded-xl bg-slate-800/80 text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300 transition"
                title="استمع لتفاصيل المعاملة صوتياً"
              >
                <Volume2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onToggleFavorite(transaction.id)}
                className={`p-2 rounded-xl transition ${
                  isFavorite
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white'
                }`}
                title="إضافة للمفضلة"
              >
                <Bookmark className="w-4 h-4" />
              </button>
              <button
                onClick={() => onShare(transaction)}
                className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white transition"
                title="مشاركة تفاصيل المعاملة"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition"
                title="إغلاق النافذة"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 pt-4 border-t border-slate-800/60">
            <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-2.5">
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-amber-400" />
                الرسم الرسمي (2026)
              </span>
              <p className="text-sm font-bold text-amber-300 mt-0.5 truncate">
                {transaction.fee.formattedFee}
              </p>
            </div>
            <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-2.5">
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-cyan-400" />
                المدة المتوقعة
              </span>
              <p className="text-sm font-bold text-cyan-300 mt-0.5 truncate">
                {transaction.expectedDuration}
              </p>
            </div>
            <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-2.5">
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-400" />
                مكان التقديم
              </span>
              <p className="text-xs font-semibold text-slate-200 mt-0.5 truncate">
                {transaction.submissionPlace}
              </p>
            </div>
            <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-2.5">
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-purple-400" />
                نطاق التغطية
              </span>
              <p className="text-xs font-semibold text-slate-200 mt-0.5 truncate">
                {transaction.governorateScope}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Section 1: Conditions & Eligibility */}
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              الشروط والأهلية المطلوبة
            </h3>
            <ul className="space-y-2">
              {transaction.conditions.map((cond, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/60"
                >
                  <span className="h-2 w-2 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <span>{cond}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 2: Required Documents with interactive checklist */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                الوثائق والمستندات المطلوبة (قائمة التحقق الشخصية)
              </h3>
              <span className="text-[11px] text-slate-400">
                حدد ما جهزته: {Object.values(checkedDocs).filter(Boolean).length} من {transaction.requiredDocuments.length}
              </span>
            </div>
            <div className="space-y-2">
              {transaction.requiredDocuments.map((doc, idx) => {
                const isChecked = !!checkedDocs[doc.name];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleDoc(doc.name)}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition select-none ${
                      isChecked
                        ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-200'
                        : 'bg-slate-900/50 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="mt-1 h-4 w-4 rounded accent-cyan-500 shrink-0 cursor-pointer"
                    />
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-xs sm:text-sm font-medium ${isChecked ? 'line-through text-slate-400' : 'text-white'}`}>
                          {doc.name}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            doc.isOriginal
                              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                              : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                          }`}
                        >
                          {doc.isOriginal ? 'مطلوب الأصل' : 'صورة مصدقة'}
                        </span>
                      </div>
                      {doc.notes && (
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          ملاحظة: {doc.notes}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Steps procedure */}
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2.5">
              <Clock className="w-4 h-4 text-blue-400" />
              خطوات ومراحل التقديم
            </h3>
            <div className="space-y-2.5">
              {transaction.steps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 bg-slate-900/40 p-3 rounded-xl border border-slate-800"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-300 font-bold text-xs mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Fees Details & Legal Source */}
          <div className="rounded-2xl bg-amber-950/15 border border-amber-500/25 p-4">
            <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5 mb-1.5">
              <DollarSign className="w-4 h-4 text-amber-400" />
              تفاصيل الرسوم ومصدرها الرسمي لعام 2026:
            </h4>
            <p className="text-sm font-bold text-white mb-1">
              القيمة المقررة: {transaction.fee.formattedFee} ({transaction.fee.feeType})
            </p>
            <p className="text-xs text-amber-200/80 leading-relaxed">
              المصدر القانوني للرسم: {transaction.fee.source} (ساري المفعول: {transaction.fee.effectiveDate})
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              المرجع القانوني العام: {transaction.legalReferences}
            </p>
          </div>

          {/* Section 5: Specialized Branches & Contacts */}
          {transaction.branches && transaction.branches.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2.5">
                <MapPin className="w-4 h-4 text-emerald-400" />
                الفروع والمراكز المتخصصة لتقديم هذه المعاملة
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {transaction.branches.map((b, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl bg-slate-900/60 border border-slate-800 p-3"
                  >
                    <h5 className="text-xs font-bold text-white">{b.name}</h5>
                    <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                      <span>{b.address}</span>
                    </p>
                    {b.phone && (
                      <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span dir="ltr">{b.phone}</span>
                      </p>
                    )}
                    {b.workingHours && (
                      <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-400 shrink-0" />
                        <span>{b.workingHours}</span>
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 6: Official Links */}
          {transaction.officialLinks && transaction.officialLinks.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-400 mb-2">الروابط الحكومية الرسمية:</h4>
              <div className="flex flex-wrap gap-2">
                {transaction.officialLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-xs text-cyan-300 border border-slate-700 transition"
                  >
                    <span>{link.title}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="text-[11px] text-slate-400">
            بيانات مسجلة ومتحقق منها لعام 2026
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800/80 text-xs text-slate-300 hover:text-white transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة المستندات</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-xs font-bold text-white hover:from-cyan-500 hover:to-blue-500 transition"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
