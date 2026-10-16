import React from 'react';
import { Bookmark, FileText, ArrowLeft, Trash2 } from 'lucide-react';
import { TRANSACTIONS_DATA } from '../data/transactions';
import { Transaction } from '../types';

interface FavoritesViewProps {
  favoriteIds: string[];
  onOpenTransaction: (txId: string) => void;
  onRemoveFavorite: (id: string) => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  favoriteIds,
  onOpenTransaction,
  onRemoveFavorite,
}) => {
  const favoriteTransactions = TRANSACTIONS_DATA.filter((tx) =>
    favoriteIds.includes(tx.id)
  );

  return (
    <div className="space-y-6 animate-fadeIn text-right">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-l from-[#0f172a] via-[#10182c] to-[#0a0f1d] border border-cyan-500/20 shadow-xl">
        <span className="inline-block px-3 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-2">
          المفضلة والعناصر المحفوظة
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          المعاملات والقوائم المحفوظة للمتابعة
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
          جميع المعاملات التي قمت بحفظها لسهولة الرجوع إلى شروطها ووثائقها ورسومها دون الحاجة لإعادة البحث.
        </p>
      </div>

      {favoriteTransactions.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[#0c1220] border border-slate-800 space-y-3">
          <Bookmark className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">لا توجد معاملات محفوظة في المفضلة حالياً</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            يمكنك الضغط على أيقونة الإشارة المرجعية (المفضلة) في بطاقة أي معاملة أو داخل تفاصيلها لحفظها هنا.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favoriteTransactions.map((tx) => (
            <div
              key={tx.id}
              className="rounded-2xl bg-gradient-to-b from-[#0f172a] to-[#0a0f1d] border border-white/[0.08] p-5 shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    {tx.ministryName}
                  </span>
                  <button
                    onClick={() => onRemoveFavorite(tx.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition"
                    title="إزالة من المفضلة"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h3
                  onClick={() => onOpenTransaction(tx.id)}
                  className="text-base font-bold text-white hover:text-cyan-300 cursor-pointer transition mb-1 leading-snug"
                >
                  {tx.name}
                </h3>
                <p className="text-xs text-slate-400 mb-3">{tx.responsibleEntity}</p>
              </div>

              <div className="pt-3 border-t border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">الرسم الرسمي:</span>
                  <span className="font-bold text-amber-300">{tx.fee.formattedFee}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">المدة المتوقعة:</span>
                  <span className="font-medium text-cyan-300">{tx.expectedDuration}</span>
                </div>

                <button
                  onClick={() => onOpenTransaction(tx.id)}
                  className="w-full mt-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 py-1.5 text-xs font-bold text-white hover:from-cyan-500 hover:to-blue-500 transition"
                >
                  فتح المعاملة وقائمة التحقق
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
