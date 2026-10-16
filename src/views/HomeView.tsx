import React from 'react';
import {
  FileText,
  Building2,
  MapPin,
  Bot,
  DollarSign,
  Bus,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  Clock,
  CheckCircle2,
  ExternalLink,
  Volume2,
  TrendingUp,
} from 'lucide-react';
import { TabId } from '../components/Sidebar';
import { TRANSACTIONS_DATA } from '../data/transactions';
import { MINISTRIES_DATA } from '../data/ministries';
import { PRICES_DATA } from '../data/prices';
import { FREE_AI_MODELS_DATA } from '../data/aiModels';

interface HomeViewProps {
  onNavigate: (tab: TabId) => void;
  onOpenTransaction: (txId: string) => void;
  onSpeak: (text: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onOpenTransaction,
  onSpeak,
}) => {
  return (
    <div className="space-y-8 animate-fadeIn text-right">
      {/* Hero Banner: Google AI Studio Inspired Luxury Dark */}
      <div className="relative overflow-hidden rounded-3xl bg-[#1e1f20] border border-[#333537] p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3.5 text-right flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#282a2c] border border-[#3c4043] text-[#a8c7fa] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>المنظومة الرقمية الشاملة للمعاملات السورية — إصدار 2026</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-snug">
              DALIL SYRIA | دليل سوريا
            </h1>

            <p className="text-sm sm:text-base text-[#c4c7c5] max-w-2xl leading-relaxed">
              الدليل الحكومي المتكامل لكافة الوزارات، المحافظات الأربع عشرة، مراكز خدمة المواطن، الأسعار والرسوم الرسمية، والنقل، ونماذج الذكاء الاصطناعي المجانية الرسمية، مدعوماً بمحرك بحث متطور ومساعد ذكي.
            </p>

            {/* Quick action buttons */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <button
                onClick={() => onNavigate('transactions')}
                className="flex items-center gap-2 rounded-2xl bg-[#1a73e8] hover:bg-[#1b66c9] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md transition active:scale-95"
              >
                <FileText className="w-4 h-4" />
                <span>معاملاتي الشامل (الهدف الأول)</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onNavigate('ai-models')}
                className="flex items-center gap-2 rounded-2xl bg-[#282a2c] hover:bg-[#333537] border border-[#3c4043] px-4 py-2.5 text-xs sm:text-sm font-bold text-[#a8c7fa] transition active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>نماذج الذكاء المجانية الرسمية</span>
              </button>

              <button
                onClick={() => onNavigate('map')}
                className="flex items-center gap-2 rounded-2xl bg-[#282a2c] hover:bg-[#333537] border border-[#3c4043] px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#e3e3e3] transition"
              >
                <MapPin className="w-4 h-4 text-[#a8c7fa]" />
                <span>الخريطة التفاعلية</span>
              </button>

            </div>
          </div>

          {/* Luxury Badge Emblem */}
          <div className="relative shrink-0 flex items-center justify-center p-6 rounded-3xl bg-[#282a2c] border border-[#3c4043] shadow-xl">
            <div className="text-center space-y-2">
              <div className="w-24 h-24 mx-auto rounded-2xl bg-[#1e1f20] p-2 border border-[#3c4043] shadow-inner flex items-center justify-center">
                <img src={`${import.meta.env.BASE_URL}icon.svg`} alt="DALIL SYRIA" className="w-full h-full object-contain" />
              </div>
              <span className="block text-xs font-extrabold text-white tracking-wider">
                جمهورية سوريا
              </span>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                بيانات مؤكدة ومحدثة 2026
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Highlights Grid in Google AI Studio Theme */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigate('transactions')}
          className="p-5 rounded-2xl bg-[#1e1f20] hover:bg-[#282a2c] border border-[#333537] hover:border-[#1a73e8] cursor-pointer transition shadow-lg space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#1a73e8]/20 text-[#a8c7fa]">
              الأولوية رقم 1
            </span>
            <FileText className="w-5 h-5 text-[#a8c7fa] group-hover:scale-110 transition-transform" />
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-[#a8c7fa]">
            معاملاتي الشامل
          </h3>
          <p className="text-xs text-[#c4c7c5] leading-relaxed">
            حصر الإرث، جوازات السفر، السجل المدني، رخص القيادة، القيد العقاري وساعات الكهرباء.
          </p>
        </div>

        <div
          onClick={() => onNavigate('map')}
          className="p-5 rounded-2xl bg-[#1e1f20] hover:bg-[#282a2c] border border-[#333537] hover:border-[#1a73e8] cursor-pointer transition shadow-lg space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300">
              تلقائية ومباشرة
            </span>
            <MapPin className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-blue-300">
            الخريطة التفاعلية الشاملة
          </h3>
          <p className="text-xs text-[#c4c7c5] leading-relaxed">
            مواقع الوزارات ومراكز خدمة المواطن والهجرة ومحطات السفر مع خيارات الأقمار الصناعية والشوارع.
          </p>
        </div>

        <div
          onClick={() => onNavigate('ai-models')}
          className="p-5 rounded-2xl bg-[#1e1f20] hover:bg-[#282a2c] border border-[#333537] hover:border-[#1a73e8] cursor-pointer transition shadow-lg space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
              روابط رسمية 100%
            </span>
            <Sparkles className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-emerald-300">
            نماذج الذكاء المجانية
          </h3>
          <p className="text-xs text-[#c4c7c5] leading-relaxed">
            Google AI Studio، DeepSeek، ChatGPT، Claude، Perplexity، وغيرها بروابطها المباشرة.
          </p>
        </div>

        <div
          onClick={() => onNavigate('prices')}
          className="p-5 rounded-2xl bg-[#1e1f20] hover:bg-[#282a2c] border border-[#333537] hover:border-[#1a73e8] cursor-pointer transition shadow-lg space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
              تحديث 2026
            </span>
            <DollarSign className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-amber-300">
            الأسعار والرسوم وحاسبة التاكسي
          </h3>
          <p className="text-xs text-[#c4c7c5] leading-relaxed">
            الرسوم الرسمية بالمقارنة مع التقديرات الواقعية وحاسبة تعرفة عداد الأجرة المعتمدة.
          </p>
        </div>
      </div>

      {/* Featured Transactions Quick Pick */}
      <div className="p-6 rounded-3xl bg-[#1e1f20] border border-[#333537] shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#333537] pb-3">
          <div>
            <h3 className="text-lg font-bold text-white">المعاملات الأكثر طلباً واستعلاماً</h3>
            <p className="text-xs text-[#c4c7c5]">انقر على أي معاملة للاطلاع على شروطها وأوراقها ورسومها فوراً</p>
          </div>
          <button
            onClick={() => onNavigate('transactions')}
            className="text-xs text-[#a8c7fa] hover:underline font-bold"
          >
            عرض كافة المعاملات ({TRANSACTIONS_DATA.length})
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {TRANSACTIONS_DATA.slice(0, 6).map((tx) => (
            <div
              key={tx.id}
              onClick={() => onOpenTransaction(tx.id)}
              className="p-3.5 rounded-xl bg-[#282a2c] hover:bg-[#333537] border border-[#3c4043] cursor-pointer transition space-y-1.5"
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-[#a8c7fa]">{tx.ministryName}</span>
                <span className="text-amber-300 font-extrabold">{tx.fee.formattedFee}</span>
              </div>
              <h4 className="text-sm font-bold text-white truncate">{tx.name}</h4>
              <p className="text-[11px] text-[#c4c7c5] truncate">{tx.responsibleEntity}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
