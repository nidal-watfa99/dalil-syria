import React, { useState } from 'react';
import {
  Bus,
  MapPin,
  Clock,
  Coins,
  ShieldCheck,
  Search,
  Filter,
  Luggage,
  Calendar,
  FileText,
  AlertCircle
} from 'lucide-react';
import { TRANSPORT_FARES_DATA } from '../../data/transportFaresData';
import { GOVERNORATES_DATA } from '../../data/governoratesData';
import { TransportFare } from '../../types';

export const TransportFaresView: React.FC = () => {
  const [selectedGovernorate, setSelectedGovernorate] = useState<string>('all');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const filtered = TRANSPORT_FARES_DATA.filter((fare) => {
    if (selectedGovernorate !== 'all') {
      if (fare.fromGovernorate !== selectedGovernorate && fare.toGovernorate !== selectedGovernorate) {
        return false;
      }
    }
    if (selectedClass !== 'all' && fare.serviceClass !== selectedClass) {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      const matchRoute = fare.routeNameAr.toLowerCase().includes(q);
      const matchStations =
        fare.departureStation.toLowerCase().includes(q) ||
        fare.arrivalStation.toLowerCase().includes(q);
      const matchOperators = fare.licensedOperators.some((op) => op.toLowerCase().includes(q));
      if (!matchRoute && !matchStations && !matchOperators) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-700/80 shadow-xl space-y-3">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <Bus className="w-4 h-4" />
          <span>دليل أسعار وتعرفة النقل البري بين المحافظات السورية</span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-white">
          التعرفة الرسمية المعتمدة لرحلات البولمان والميكروباص
        </h2>
        <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-3xl">
          الأسعار الصادرة بموجب قرارات وزارة التجارة الداخلية وحماية المستهلك ولجان نقل الركاب المشتركة، مع بيان مراكز الانطلاق، الشركات المرخصة، والمسافات المقاسة بالكيلومتر.
        </p>

        <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
          <ShieldCheck className="w-4 h-4" />
          <span>جميع الأسعار المعروضة أدناه مستندة إلى قرارات رسمية موثقة ومعلنة.</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-xl border border-slate-700 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث عن خط، شركة، أو كراج..."
            className="w-full py-2 pr-9 pl-3 text-xs rounded-lg recessed-field text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          <select
            value={selectedGovernorate}
            onChange={(e) => setSelectedGovernorate(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg recessed-field text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="all">كل المحافظات</option>
            {GOVERNORATES_DATA.map((g) => (
              <option key={g.id} value={g.id}>
                {g.nameAr}
              </option>
            ))}
          </select>

          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg recessed-field text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="all">كل فئات المركبات</option>
            <option value="بولمان رجال أعمال (VIP)">بولمان رجال أعمال (VIP)</option>
            <option value="بولمان عادي">بولمان عادي</option>
            <option value="ميكروباص / فان">ميكروباص / فان</option>
          </select>
        </div>
      </div>

      {/* Transport Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((fare) => (
          <div
            key={fare.id}
            className="glass-card rounded-xl p-5 border border-slate-800 hover:border-slate-700 transition-all space-y-4 flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[11px] font-mono text-amber-400 font-semibold">
                    {fare.serviceClass}
                  </span>
                  <h3 className="text-base font-bold text-white mt-0.5 leading-snug">
                    {fare.routeNameAr}
                  </h3>
                </div>
                <span className="p-2 rounded-lg bg-slate-900 text-amber-400">
                  <Bus className="w-4 h-4" />
                </span>
              </div>

              {/* Station Details */}
              <div className="space-y-1.5 text-xs text-slate-300 mt-3 pt-3 border-t border-slate-800">
                <p className="flex items-start gap-1.5">
                  <span className="text-slate-500 font-medium whitespace-nowrap">الانطلاق:</span>
                  <span className="text-slate-200">{fare.departureStation}</span>
                </p>
                <p className="flex items-start gap-1.5">
                  <span className="text-slate-500 font-medium whitespace-nowrap">الوصول:</span>
                  <span className="text-slate-200">{fare.arrivalStation}</span>
                </p>
              </div>

              {/* Distance and Duration Metrics */}
              <div className="grid grid-cols-2 gap-2 mt-3 pt-2 text-xs">
                <div className="p-2 rounded-lg bg-slate-900/50 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 block">المسافة التقريبية</span>
                  <strong className="font-mono text-white text-xs">{fare.distanceKm} كم</strong>
                </div>
                <div className="p-2 rounded-lg bg-slate-900/50 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 block">المدة التقديرية</span>
                  <strong className="font-mono text-white text-xs">~{fare.estimatedDurationHours} ساعات</strong>
                </div>
              </div>

              {/* Operators and Luggage */}
              <div className="mt-3 text-xs text-slate-400 space-y-1">
                <p className="text-[11px]">
                  الشركات المرخصة: <span className="text-slate-300">{fare.licensedOperators.join('، ')}</span>
                </p>
                <p className="flex items-center gap-1 text-[11px]">
                  <Luggage className="w-3.5 h-3.5 text-slate-500" />
                  <span>وزن الأمتعة المسموح: {fare.luggageAllowanceKg} كغ</span>
                </p>
              </div>
            </div>

            {/* Price Box & Legal Decree */}
            <div className="pt-3 border-t border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">التعرفة الرسمية للراكب:</span>
                <span className="font-mono text-base font-bold text-amber-400">
                  {fare.officialTariffSyp.toLocaleString('ar-SY')} ل.س
                </span>
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">
                {fare.legalDecree} (سارية منذ {fare.tariffEffectiveDate})
              </p>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="p-12 text-center text-slate-400 glass-panel rounded-2xl">
          لا توجد خطوط نقل مطابقة للبحث المحدد.
        </div>
      )}
    </div>
  );
};
