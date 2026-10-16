import React, { useState } from 'react';
import {
  Bus,
  Train,
  Ship,
  MapPin,
  Clock,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Search,
  Building,
} from 'lucide-react';
import { TRANSPORT_ROUTES_DATA } from '../data/transport';
import { TransportRoute } from '../types';

export const TransportView: React.FC = () => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchRoute, setSearchRoute] = useState('');

  const filteredRoutes = TRANSPORT_ROUTES_DATA.filter((r) => {
    const matchesType = filterType === 'all' || r.type === filterType;
    const matchesSearch =
      !searchRoute.trim() ||
      r.title.includes(searchRoute) ||
      r.origin.includes(searchRoute) ||
      r.destination.includes(searchRoute);
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fadeIn text-right">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-l from-[#0f172a] via-[#10182c] to-[#0a0f1d] border border-cyan-500/20 shadow-xl">
        <span className="inline-block px-3 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 mb-2">
          النقل البري والبحري والسكك الحديدية (واقع 2026)
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          منظومة النقل الداخلي وبين المحافظات
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
          دليل حافلات البولمان، السرافيس، قطارات الساحل وحلب، والموانئ البحرية مع إيضاح المسارات والمواعيد وتبيان الخطوط العاملة والمتوقفة بشفافية تامة.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[#0e1424] border border-white/[0.08]">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              filterType === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            كافة الوسائل
          </button>
          <button
            onClick={() => setFilterType('بولمان بين المحافظات')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              filterType === 'بولمان بين المحافظات'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Bus className="w-3.5 h-3.5" />
            <span>البولمان بين المحافظات</span>
          </button>
          <button
            onClick={() => setFilterType('سكك حديدية')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              filterType === 'سكك حديدية'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Train className="w-3.5 h-3.5" />
            <span>القطارات والسكك الحديدية</span>
          </button>
          <button
            onClick={() => setFilterType('نقل بحري')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              filterType === 'نقل بحري'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Ship className="w-3.5 h-3.5" />
            <span>النقل البحري والموانئ</span>
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchRoute}
            onChange={(e) => setSearchRoute(e.target.value)}
            placeholder="ابحث عن مسار، مدينة، أو كراج..."
            className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 pr-9 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
          />
          <Search className="absolute right-3 top-2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Routes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRoutes.map((route) => {
          const isWorking = route.status === 'عامل بانتظام';
          return (
            <div
              key={route.id}
              className="rounded-3xl bg-gradient-to-b from-[#0f172a] to-[#0a0f1d] border border-white/[0.08] p-5 shadow-lg space-y-3.5"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-blue-500/10 text-blue-300 border border-blue-500/20">
                  {route.type}
                </span>
                <span
                  className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${
                    isWorking
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                  }`}
                >
                  {route.status}
                </span>
              </div>

              <h3 className="text-base font-bold text-white leading-snug">{route.title}</h3>

              {/* Origin & Destination */}
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="font-semibold text-slate-400">الانطلاق:</span>
                  <span>{route.origin}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span className="font-semibold text-slate-400">الوصول:</span>
                  <span>{route.destination}</span>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">التكلفة / التذكرة:</span>
                  <span className="font-black text-amber-300">{route.priceFormatted}</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">المدة التقريبية:</span>
                  <span className="font-semibold text-cyan-300">{route.duration}</span>
                </div>
                {route.distanceKm && (
                  <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-slate-400 block">المسافة:</span>
                    <span className="font-semibold text-slate-200">{route.distanceKm} كم</span>
                  </div>
                )}
              </div>

              {/* Schedule and Companies */}
              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex items-start gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed"><strong>المواعيد والجدول:</strong> {route.schedule}</span>
                </div>
                {route.operatingCompanies.length > 0 && (
                  <div className="flex items-start gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span className="text-[11px] text-slate-400">
                      <strong>الشركات والمشغلون:</strong> {route.operatingCompanies.join('، ')}
                    </span>
                  </div>
                )}
              </div>

              {/* Source date */}
              <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-400">
                المصدر والتحقق: {route.sourceAndDate}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
