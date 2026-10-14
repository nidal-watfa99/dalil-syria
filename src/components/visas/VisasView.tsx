import React, { useState } from 'react';
import {
  Globe,
  ShieldAlert,
  ExternalLink,
  CheckCircle2,
  FileText,
  AlertTriangle,
  Building2,
  Coins,
  ChevronDown,
  Search
} from 'lucide-react';
import { VISAS_DATA } from '../../data/visasData';
import { VisaGuide } from '../../types';

export const VisasView: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedVisa, setSelectedVisa] = useState<VisaGuide | null>(VISAS_DATA[0]);

  const filtered = VISAS_DATA.filter((v) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase().trim();
    return (
      v.countryNameAr.toLowerCase().includes(q) ||
      v.countryNameEn.toLowerCase().includes(q) ||
      v.visaType.toLowerCase().includes(q) ||
      v.purposeAr.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-700/80 shadow-xl space-y-3">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <Globe className="w-4 h-4" />
          <span>قسم التأشيرات والسفر الدولي لحاملي الجواز السوري</span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-white">
          دليل التأشيرات والمتطلبات الرسمية للسفر الخارجي
        </h2>
        <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-3xl">
          متطلبات التأشيرات الرسمية وفق أحدث اللوائح القنصلية، مع تحديد أماكن معالجة الطلبات للسوريين، والرسوم الدقيقة، والتحذير من السماسرة والمكاتب الوهمية.
        </p>

        {/* Anti-fraud banner */}
        <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-600/40 text-xs text-amber-200 flex items-start gap-2.5">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>تحذير وطني:</strong> لا توجد أي جهة خاصة تملك صلاحية ضمان منح أي تأشيرة سفر دولية. القرار سيادي للدولة المانحة حصراً، وتجنب دفع أي مبالغ لسماسرة يزعمون بيع التأشيرات أو ضمان المقابلات.
          </p>
        </div>
      </div>

      {/* Main Content: Split Master-Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left / Master: Visa List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن دولة أو وجهة..."
              className="w-full py-2.5 pr-9 pl-3 text-xs rounded-xl recessed-field text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
          </div>

          <div className="space-y-2">
            {filtered.map((visa) => {
              const isSelected = selectedVisa?.id === visa.id;
              return (
                <div
                  key={visa.id}
                  onClick={() => setSelectedVisa(visa)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500/60 text-white shadow-md'
                      : 'glass-card border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div>
                    <h4 className="font-bold text-sm text-white">{visa.countryNameAr}</h4>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{visa.visaType}</p>
                    <span className="inline-block mt-2 text-[10px] text-emerald-400 font-mono">
                      {visa.doesProcessSyrianCitizensCurrently ? 'المعالجة متاحة للسوريين' : 'قيود معالجة'}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-500 -rotate-90" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right / Detail: Active Visa Guide */}
        <div className="lg:col-span-8">
          {selectedVisa ? (
            <div className="glass-panel p-6 rounded-2xl border border-slate-700/80 shadow-2xl space-y-6 text-slate-100">
              {/* Country & Visa Title */}
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs text-amber-400 font-mono">{selectedVisa.countryNameEn}</span>
                  <h3 className="text-xl font-bold text-white mt-1">{selectedVisa.countryNameAr}</h3>
                  <p className="text-xs text-slate-300 mt-1">{selectedVisa.visaType}</p>
                </div>

                <div className="text-left">
                  <span className="text-[11px] text-slate-400 block">مركز التقديم للمقيمين بسورية</span>
                  <span className="text-xs font-semibold text-slate-200">
                    {selectedVisa.processingLocationForSyrians}
                  </span>
                </div>
              </div>

              {/* Purpose */}
              <div>
                <h4 className="text-xs font-bold text-amber-400 mb-1.5">الغرض من التأشيرة</h4>
                <p className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                  {selectedVisa.purposeAr}
                </p>
              </div>

              {/* Official Requirements */}
              <div>
                <h4 className="text-xs font-bold text-amber-400 mb-2">الشروط الرسمية والأهلية</h4>
                <ul className="space-y-2 text-xs text-slate-200">
                  {selectedVisa.officialRequirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/80">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Required Documents */}
              <div>
                <h4 className="text-xs font-bold text-amber-400 mb-2">الوثائق والأوراق المطلوبة</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300">
                  {selectedVisa.requiredDocuments.map((doc, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-slate-900/40 p-2.5 rounded-lg border border-slate-800">
                      <FileText className="w-4 h-4 text-amber-400/80 shrink-0 mt-0.5" />
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fees and Legal Reference */}
              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <Coins className="w-4 h-4" />
                  <span>الرسوم الرسمية وطريقة السداد</span>
                </div>
                <p className="text-sm font-bold font-mono text-white">
                  {selectedVisa.fees.amount}
                </p>
                <p className="text-slate-300">
                  طريقة السداد: {selectedVisa.fees.paymentMethod}
                </p>
                <p className="text-slate-400 text-[11px]">
                  السند القانوني: {selectedVisa.fees.legalReference}
                </p>
              </div>

              {/* Anti-fraud callout */}
              <div className="p-3.5 rounded-xl bg-red-950/30 border border-red-800/40 text-xs text-red-200 leading-relaxed">
                <strong className="text-red-400 block mb-1">تنبيه قانوني رسمي:</strong>
                {selectedVisa.antiFraudWarning}
              </div>

              {/* Official Links and Metadata */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs">
                <div className="text-slate-400 text-[11px]">
                  <span>المصدر: {selectedVisa.source}</span>
                  <span className="block mt-0.5 font-mono">آخر تحقق: {selectedVisa.lastVerifiedDate}</span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={selectedVisa.officialEmbassyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 py-2 px-3.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold transition-colors shadow-sm"
                  >
                    <span>البوابة الرسمية للسفارة</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-12 text-center text-slate-400 rounded-2xl">
              اختر دولة من القائمة لعرض الدليل الرسمي
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
