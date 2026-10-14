import React from 'react';
import {
  Bookmark,
  Share2,
  MapPin,
  Clock,
  Coins,
  ShieldCheck,
  FileCheck2,
  AlertTriangle,
  ChevronLeft,
  Calendar
} from 'lucide-react';
import { Transaction } from '../../types';
import { isFavorite, toggleFavorite, getCheckedDocuments } from '../../utils/storageAndLogs';

interface TransactionCardProps {
  transaction: Transaction;
  onOpenDetails: (tx: Transaction) => void;
  onOpenMap?: (authorityId?: string) => void;
  onShare?: (tx: Transaction) => void;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  onOpenDetails,
  onOpenMap,
  onShare,
}) => {
  const [favorite, setFavorite] = React.useState<boolean>(isFavorite(transaction.id));
  const checkedDocs = getCheckedDocuments(transaction.id);
  const totalDocs = transaction.requiredDocuments.length;
  const progressPercent = totalDocs > 0 ? Math.round((checkedDocs.length / totalDocs) * 100) : 0;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = toggleFavorite(transaction.id);
    setFavorite(updated);
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onShare) onShare(transaction);
  };

  const handleMapClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onOpenMap && transaction.relatedAuthorityIds.length > 0) {
      onOpenMap(transaction.relatedAuthorityIds[0]);
    }
  };

  return (
    <div
      onClick={() => onOpenDetails(transaction)}
      className="glass-card rounded-xl p-5 hover:border-slate-600 transition-all cursor-pointer group flex flex-col justify-between"
    >
      <div>
        {/* Header Metadata */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-amber-400/90 font-medium">{transaction.responsibleAuthority}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              {transaction.verificationStatus === 'verified' ? 'موثق رسمياً' : 'قيد المراجعة'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleFavoriteClick}
              className={`p-1.5 rounded-lg hover:bg-slate-800 transition-colors ${
                favorite ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
              }`}
              title={favorite ? 'إزالة من المحفوظات' : 'حفظ في المفضلة'}
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>
            <button
              onClick={handleShareClick}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              title="مشاركة المعاملة"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors leading-snug">
          {transaction.titleAr}
        </h3>

        {/* Summary */}
        <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
          {transaction.summaryAr}
        </p>

        {/* Document Checklist Pill / Progress */}
        {totalDocs > 0 && (
          <div className="mt-3.5 pt-3 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
              <span className="flex items-center gap-1">
                <FileCheck2 className="w-3.5 h-3.5 text-amber-400" />
                الأوراق المطلوبة: {totalDocs} وثائق
              </span>
              <span className="font-mono text-slate-300">
                {checkedDocs.length} من {totalDocs} جاهزة
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer Metrics */}
      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{transaction.processingTimeOfficial}</span>
          </span>
          {transaction.officialFees.length > 0 && (
            <span className="flex items-center gap-1 font-mono text-slate-300">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {transaction.officialFees[0].amount.toLocaleString('ar-SY')} {transaction.officialFees[0].currency === 'SYP' ? 'ل.س' : '$'}
              </span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {transaction.relatedAuthorityIds.length > 0 && onOpenMap && (
            <button
              onClick={handleMapClick}
              className="p-1 rounded text-slate-400 hover:text-amber-400 transition-colors"
              title="عرض المركز على الخريطة"
            >
              <MapPin className="w-4 h-4" />
            </button>
          )}
          <span className="text-amber-400 group-hover:-translate-x-1 transition-transform flex items-center text-xs font-semibold">
            التفاصيل
            <ChevronLeft className="w-4 h-4 mr-0.5" />
          </span>
        </div>
      </div>
    </div>
  );
};
