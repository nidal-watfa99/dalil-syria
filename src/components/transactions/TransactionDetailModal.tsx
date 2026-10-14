import React, { useState } from 'react';
import {
  X,
  Bookmark,
  Share2,
  MapPin,
  Clock,
  Coins,
  ShieldCheck,
  FileCheck2,
  CheckSquare,
  Square,
  AlertTriangle,
  ExternalLink,
  Building,
  Flag,
  FileText,
  UserCheck,
  CalendarCheck,
  Scale
} from 'lucide-react';
import { Transaction } from '../../types';
import {
  isFavorite,
  toggleFavorite,
  getCheckedDocuments,
  toggleDocumentCheck
} from '../../utils/storageAndLogs';

interface TransactionDetailModalProps {
  transaction: Transaction;
  onClose: () => void;
  onOpenMap?: (authorityId?: string) => void;
  onShare?: (tx: Transaction) => void;
  onRequestInaccuracyReport?: (tx: Transaction) => void;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  transaction,
  onClose,
  onOpenMap,
  onShare,
  onRequestInaccuracyReport,
}) => {
  const [favorite, setFavorite] = useState<boolean>(isFavorite(transaction.id));
  const [checkedDocs, setCheckedDocs] = useState<string[]>(getCheckedDocuments(transaction.id));
  const [activeTab, setActiveTab] = useState<'overview' | 'checklist' | 'steps' | 'fees'>('overview');

  const handleToggleDoc = (docId: string) => {
    toggleDocumentCheck(transaction.id, docId);
    setCheckedDocs(getCheckedDocuments(transaction.id));
  };

  const handleToggleFavorite = () => {
    const updated = toggleFavorite(transaction.id);
    setFavorite(updated);
  };

  const totalDocs = transaction.requiredDocuments.length;
  const readyDocsCount = checkedDocs.length;
  const progressPercent = totalDocs > 0 ? Math.round((readyDocsCount / totalDocs) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 md:p-6 overflow-y-auto">
      <div className="w-full max-w-3xl glass-panel rounded-2xl border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-slate-100 animate-fade-in">
        
        {/* Top Header */}
        <div className="p-5 md:p-6 border-b border-slate-800 bg-slate-900/60 flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-2">
              <span className="text-amber-400 font-semibold">{transaction.responsibleAuthority}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                {transaction.verificationStatus === 'verified' ? 'معاملة رسمية موثقة' : 'بانتظار التحقق'}
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>آخر تحقق: {transaction.lastVerifiedDate}</span>
            </div>
            <h2 className="text-lg md:text-xl font-bold text-white leading-snug">
              {transaction.titleAr}
            </h2>
            {transaction.commonNames.length > 0 && (
              <p className="text-xs text-slate-400 mt-1">
                المسميات الشائعة: {transaction.commonNames.join('، ')}
              </p>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleToggleFavorite}
              className={`p-2 rounded-lg border border-slate-700 hover:bg-slate-800 transition-colors ${
                favorite ? 'text-amber-400' : 'text-slate-400'
              }`}
              title={favorite ? 'إزالة من المفضلة' : 'حفظ في المفضلة'}
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>
            <button
              onClick={() => onShare && onShare(transaction)}
              className="p-2 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="مشاركة المعاملة"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center border-b border-slate-800 px-5 bg-slate-950/40 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            نظرة عامة والشروط
          </button>
          <button
            onClick={() => setActiveTab('checklist')}
            className={`py-3 px-4 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'checklist'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>قائمة الأوراق المطلوبة</span>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-full bg-slate-800 text-amber-300">
              {readyDocsCount}/{totalDocs}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('steps')}
            className={`py-3 px-4 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'steps'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            خطوات التنفيذ بالترتيب ({transaction.steps.length})
          </button>
          <button
            onClick={() => setActiveTab('fees')}
            className={`py-3 px-4 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'fees'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            جدول الرسوم والقوانين
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 md:p-6 overflow-y-auto space-y-6 flex-1 text-xs md:text-sm">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1.5">
                  الغرض من المعاملة
                </h4>
                <p className="text-slate-200 leading-relaxed bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                  {transaction.summaryAr}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1.5">
                  من يحق له التقديم والأهلية
                </h4>
                <p className="text-slate-300 leading-relaxed bg-slate-900/40 p-3.5 rounded-xl border border-slate-800">
                  {transaction.eligibility}
                </p>
              </div>

              {/* Legal & Attendance Rules Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800">
                  <span className="text-slate-400 text-xs block mb-1">الحضور الشخصي</span>
                  <span className="font-semibold text-white">
                    {transaction.personalAttendanceRequired ? 'مطلوب إلزامياً' : 'غير ملزم (يمكن بالوكالة)'}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800">
                  <span className="text-slate-400 text-xs block mb-1">الوكالة القانونية</span>
                  <span className="font-semibold text-white">
                    {transaction.powerOfAttorneyAllowed ? 'مقبولة بموجب وكالة خاصة' : 'غير مقبولة'}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800">
                  <span className="text-slate-400 text-xs block mb-1">حجز موعد مسبق</span>
                  <span className="font-semibold text-white">
                    {transaction.appointmentRequired ? 'إلزامي عبر المنصة الرسمية' : 'مراجعة مباشرة بالمركز'}
                  </span>
                </div>
              </div>

              {/* Submitting vs Issuing Entity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
                  <span className="text-xs text-slate-400 block mb-1">الجهة المستقبلة للطلب</span>
                  <strong className="text-slate-200">{transaction.submittingEntity}</strong>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
                  <span className="text-xs text-slate-400 block mb-1">الجهة المصدرة للنتيجة</span>
                  <strong className="text-slate-200">{transaction.issuingEntity}</strong>
                </div>
              </div>

              {/* Common Rejections */}
              {transaction.commonRejectionReasons.length > 0 && (
                <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-900/40">
                  <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5 mb-2">
                    <AlertTriangle className="w-4 h-4" />
                    أسباب الرفض أو النواقص الشائعة (مستندة للتعليمات الرسمية)
                  </h4>
                  <ul className="list-disc list-inside space-y-1.5 text-xs text-amber-200/90 leading-relaxed">
                    {transaction.commonRejectionReasons.map((reason, idx) => (
                      <li key={idx}>{reason}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: INTERACTIVE CHECKLIST */}
          {activeTab === 'checklist' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <div>
                  <h4 className="font-bold text-white text-sm">قائمة تجهيز الوثائق التفاعلية</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    حدد الوثائق التي قمت بتجهيزها لمعرفة ما ينقصك قبل التوجه للمركز
                  </p>
                </div>
                <div className="text-left font-mono">
                  <span className="text-amber-400 text-lg font-bold">{progressPercent}%</span>
                  <span className="text-xs text-slate-400 block">اكتمال التجهيز</span>
                </div>
              </div>

              <div className="space-y-2.5">
                {transaction.requiredDocuments.map((doc) => {
                  const isChecked = checkedDocs.includes(doc.id);
                  return (
                    <div
                      key={doc.id}
                      onClick={() => handleToggleDoc(doc.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                        isChecked
                          ? 'bg-emerald-950/20 border-emerald-800/50 text-emerald-100'
                          : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 text-slate-200'
                      }`}
                    >
                      <button className="mt-0.5 text-amber-400 shrink-0">
                        {isChecked ? (
                          <CheckSquare className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-500" />
                        )}
                      </button>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`font-semibold text-xs md:text-sm ${isChecked ? 'line-through text-slate-400' : 'text-white'}`}>
                            {doc.nameAr}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                            {doc.isOriginal ? 'أصل مطلوب' : 'صورة ضوئية'}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                            عدد النسخ: {doc.copiesCount}
                          </span>
                          {doc.needsAttestation && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800/40">
                              يلزم تصديق: {doc.attestationEntity}
                            </span>
                          )}
                        </div>

                        {doc.notes && (
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                            {doc.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: STEP-BY-STEP PROCEDURE */}
          {activeTab === 'steps' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400 leading-relaxed">
                خطوات تنفيذ المعاملة بالتسلسل الزمني الدقيق من بدء التحضير حتى استلام الوثيقة:
              </p>

              <div className="space-y-3 relative before:absolute before:inset-y-0 before:right-4 before:w-0.5 before:bg-slate-800">
                {transaction.steps.map((st) => (
                  <div key={st.stepNumber} className="relative flex items-start gap-4 pr-1">
                    <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center font-bold font-mono text-xs shrink-0 shadow-sm z-10 bg-[#0B0F17]">
                      {st.stepNumber}
                    </div>

                    <div className="flex-1 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                      <h5 className="font-bold text-white text-xs md:text-sm">{st.title}</h5>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">{st.description}</p>
                      {st.locationName && (
                        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-amber-400/90 font-medium">
                          <Building className="w-3.5 h-3.5" />
                          <span>الموقع: {st.locationName}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: OFFICIAL FEES & LEGAL DECREES */}
          {activeTab === 'fees' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                الرسوم القانونية المعتمدة رسمياً الصادرة بالقوانين والمراسيم والقرارات الوزارية النافذة:
              </p>

              <div className="rounded-xl overflow-hidden border border-slate-800">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-3">بند الرسم</th>
                      <th className="p-3">المبلغ الرسمي</th>
                      <th className="p-3">طريقة الدفع</th>
                      <th className="p-3">السند والقرار القانوني</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 bg-slate-900/40">
                    {transaction.officialFees.map((fee, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/80">
                        <td className="p-3 font-medium text-slate-200">{fee.item}</td>
                        <td className="p-3 font-mono font-bold text-amber-400 whitespace-nowrap">
                          {fee.amount.toLocaleString('ar-SY')} {fee.currency === 'SYP' ? 'ل.س' : '$'}
                        </td>
                        <td className="p-3 text-slate-300">{fee.paymentMethod}</td>
                        <td className="p-3 text-slate-400 text-[11px]">{fee.legalReference}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Legal Reference Card */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-amber-400 font-semibold">
                  <Scale className="w-4 h-4" />
                  <span>المرجعية القانونية والجريدة الرسمية</span>
                </div>
                <p className="text-slate-300">
                  رقم القانون / المرسوم: <strong className="text-white">{transaction.legalBasisNumber}</strong>
                </p>
                <p className="text-slate-400">
                  المصدر المعتمد: {transaction.sourceName}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Action Bar */}
        <div className="p-4 md:p-5 border-t border-slate-800 bg-slate-900/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {transaction.relatedAuthorityIds.length > 0 && onOpenMap && (
              <button
                onClick={() => {
                  onClose();
                  onOpenMap(transaction.relatedAuthorityIds[0]);
                }}
                className="flex items-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-sm"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>افتح المركز على الخريطة</span>
              </button>
            )}

            {transaction.officialPortalUrl && (
              <a
                href={transaction.officialPortalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                <span>البوابة الحكومية</span>
              </a>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onRequestInaccuracyReport && (
              <button
                onClick={() => onRequestInaccuracyReport(transaction)}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-amber-400 p-2 rounded hover:bg-slate-800 transition-colors"
                title="الإبلاغ عن تغير في الرسوم أو الشروط"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>إبلاغ عن معلومة غير دقيقة</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="py-2 px-4 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
            >
              إغلاق
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
