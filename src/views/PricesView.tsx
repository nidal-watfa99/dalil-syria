import React, { useState } from 'react';
import {
  DollarSign,
  Calculator,
  Search,
  Filter,
  Car,
  Bus,
  Plane,
  FileText,
  ShieldCheck,
  Clock,
  ExternalLink,
  Info,
  X,
} from 'lucide-react';
import { PRICES_DATA } from '../data/prices';
import { PriceItem } from '../types';
import { arabicMatchesAny } from '../utils/arabicSearch';

export const PricesView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchPrice, setSearchPrice] = useState('');

  // Interactive Official Taxi Meter Calculator State
  const [kmDistance, setKmDistance] = useState<number>(10);
  const [passengerCount, setPassengerCount] = useState<number>(1);
  const [waitingMinutes, setWaitingMinutes] = useState<number>(0);

  // Official 2026 Damascus/Syria Taxi formula:
  // Base flag-drop = 3,000 SYP
  // Rate per km = 3,500 SYP
  // Waiting rate = 250 SYP per minute (15,000 SYP / hour)
  const officialTaxiFare = 3000 + kmDistance * 3500 + waitingMinutes * 250;
  // Estimated street negotiation fare (usually 15-35% higher due to fuel market differences)
  const marketEstimatedFareMin = Math.round((officialTaxiFare * 1.15) / 1000) * 1000;
  const marketEstimatedFareMax = Math.round((officialTaxiFare * 1.35) / 1000) * 1000;

  const filteredPrices = PRICES_DATA.filter((p) => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      !searchPrice.trim() ||
      arabicMatchesAny([p.title, p.details, p.source, p.category], searchPrice);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fadeIn text-right">
      {/* Header with Google AI Studio Styling */}
      <div className="p-6 rounded-3xl bg-[#1e1f20] border border-[#333537] shadow-xl">
        <span className="inline-block px-3 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-2">
          سجل الأسعار والرسوم الموثقة لعام 2026
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          سجل الأسعار والرسوم الرسمية والتقديرية
        </h1>
        <p className="text-xs sm:text-sm text-[#c4c7c5] mt-1 max-w-2xl leading-relaxed">
          حصر دقيق للرسوم الحكومية، تعرفة عدادات التكاسي الرسمية لعام 2026، أجور البولمان، تذاكر الطيران، ورسوم التأشيرات مفصولة عن أتعاب المكاتب الوسيطة.
        </p>
      </div>

      {/* Interactive Official Taxi Fare Calculator */}
      <div className="rounded-3xl bg-[#1e1f20] border border-[#333537] p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#333537]">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                حاسبة تعرفة سيارات الأجرة العمومية (التاكسي) الرسمية لعام 2026
              </h3>
              <p className="text-xs text-[#c4c7c5]">
                حساب الأجرة بموجب قرار لجنة تحديد الأسعار ومحافظة دمشق
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-block px-2.5 py-1 rounded-xl bg-[#282a2c] text-[11px] text-[#a8c7fa] border border-[#3c4043] font-semibold">
            فتحة عداد: 3,000 ل.س + 3,500 ل.س / كم
          </span>
        </div>

        {/* Calculator inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#c4c7c5] mb-1.5">
              المسافة التقديرية بالسيارة (كم):
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={200}
                value={kmDistance}
                onChange={(e) => setKmDistance(Math.max(1, Number(e.target.value) || 1))}
                className="w-full rounded-xl bg-[#282a2c] border border-[#3c4043] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#1a73e8] font-bold"
              />
              <span className="text-xs text-[#8e918f] shrink-0">كم</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#c4c7c5] mb-1.5">
              زمن الانتظار أو التوقف بالازدحام (دقائق):
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                max={300}
                value={waitingMinutes}
                onChange={(e) => setWaitingMinutes(Math.max(0, Number(e.target.value) || 0))}
                className="w-full rounded-xl bg-[#282a2c] border border-[#3c4043] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#1a73e8] font-bold"
              />
              <span className="text-xs text-[#8e918f] shrink-0">دقيقة</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#c4c7c5] mb-1.5">عدد الركاب:</label>
            <select
              value={passengerCount}
              onChange={(e) => setPassengerCount(Number(e.target.value))}
              className="w-full rounded-xl bg-[#282a2c] border border-[#3c4043] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#1a73e8] font-bold"
            >
              <option value={1}>راكب واحد</option>
              <option value={2}>راكبان</option>
              <option value={3}>3 ركاب</option>
              <option value={4}>4 ركاب (حمولة كاملة)</option>
            </select>
          </div>
        </div>

        {/* Calculator Results Display */}
        <div className="mt-4 p-4 rounded-2xl bg-[#282a2c] border border-[#3c4043] grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <div>
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              التعرفة الرسمية الملزمة الصادرة بقرار المحافظة (العداد):
            </span>
            <div className="text-2xl font-black text-white mt-1">
              {officialTaxiFare.toLocaleString()} <span className="text-sm font-normal text-[#c4c7c5]">ليرة سورية</span>
            </div>
            <p className="text-[11px] text-[#8e918f] mt-1">
              المعادلة الرسمية: 3,000 + ({kmDistance} كم × 3,500 ل.س) + ({waitingMinutes} دقيقة × 250 ل.س).
            </p>
          </div>

          <div className="border-t sm:border-t-0 sm:border-r border-[#333537] sm:pr-4 pt-3 sm:pt-0">
            <span className="text-xs text-amber-400 font-bold flex items-center gap-1.5">
              <Info className="w-4 h-4" />
              المدى التقديري المتداول في السوق الواقعي:
            </span>
            <div className="text-lg font-bold text-amber-300 mt-1">
              {marketEstimatedFareMin.toLocaleString()} - {marketEstimatedFareMax.toLocaleString()} <span className="text-xs font-normal text-[#c4c7c5]">ل.س</span>
            </div>
            <p className="text-[11px] text-[#8e918f] mt-1">
              الفرق ناتج عن تفاوت تكاليف الصيانة والمحروقات. يُنصح بالاتفاق المسبق إذا كان العداد غير مشغل.
            </p>
          </div>
        </div>
      </div>

      {/* Category Filter and Search (Solid Background to prevent disappearing text) */}
      <div className="relative z-20 flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-[#1e1f20] border border-[#333537]">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {[
            { id: 'all', label: 'الكل' },
            { id: 'رسوم حكومية', label: 'الرسوم الحكومية' },
            { id: 'تكاسي وسيارات أجرة', label: 'التكاسي والأجرة' },
            { id: 'نقل بين المحافظات', label: 'النقل بين المحافظات' },
            { id: 'طيران داخلي ودولي', label: 'طيران داخلي ودولي' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedCategory === cat.id
                  ? 'bg-[#1a73e8] text-white shadow-sm'
                  : 'bg-[#282a2c] text-[#c4c7c5] hover:text-white border border-[#3c4043]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchPrice}
            onChange={(e) => setSearchPrice(e.target.value)}
            placeholder="ابحث في الأسعار والرسوم..."
            className="w-full rounded-xl bg-[#282a2c] border border-[#3c4043] pr-9 pl-8 py-2 text-xs text-white placeholder-[#8e918f] focus:outline-none focus:border-[#1a73e8]"
          />
          <Search className="absolute right-3 top-2.5 w-3.5 h-3.5 text-[#8e918f] pointer-events-none" />
          {searchPrice && (
            <button
              onClick={() => setSearchPrice('')}
              className="absolute left-2.5 top-2 p-0.5 rounded text-[#8e918f] hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Prices List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPrices.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl bg-[#1e1f20] hover:bg-[#282a2c] border border-[#333537] hover:border-[#1a73e8]/50 p-5 shadow-lg space-y-3 transition flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-[#a8c7fa] bg-[#282a2c] px-2 py-0.5 rounded-lg border border-[#3c4043]">
                  {item.category}
                </span>
                <span className="text-[10px] text-[#8e918f]">{item.effectiveDate}</span>
              </div>

              <h4 className="text-base font-bold text-white leading-snug">{item.title}</h4>
              <p className="text-xs text-[#c4c7c5] leading-relaxed">{item.details}</p>
            </div>

            <div className="pt-3 border-t border-[#333537] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#8e918f]">الرسم / الأجرة:</span>
                <span className="font-black text-amber-300 text-sm">
                  {item.price} {item.currency}
                </span>
              </div>
              <div className="text-[10px] text-[#8e918f] flex items-center justify-between">
                <span>المصدر: {item.source}</span>
                <span className="text-emerald-400 font-semibold">{item.rateType}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
