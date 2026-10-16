import React, { useState } from 'react';
import {
  MapPin,
  Building,
  Bus,
  Clock,
  Phone,
  CheckCircle2,
  AlertCircle,
  Search,
  ChevronDown,
  Navigation,
} from 'lucide-react';
import { GOVERNORATES_DATA } from '../data/governorates';
import { Governorate } from '../types';

interface GovernoratesViewProps {
  onNavigateToMapPoint?: (coords: [number, number], title: string) => void;
}

export const GovernoratesView: React.FC<GovernoratesViewProps> = ({ onNavigateToMapPoint }) => {
  const [selectedGovId, setSelectedGovId] = useState<string>('damascus');
  const [searchGov, setSearchGov] = useState('');

  const currentGov = GOVERNORATES_DATA.find((g) => g.id === selectedGovId) || GOVERNORATES_DATA[0];

  const filteredGovs = GOVERNORATES_DATA.filter((g) =>
    g.name.includes(searchGov) || g.center.includes(searchGov)
  );

  return (
    <div className="space-y-6 animate-fadeIn text-right">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-l from-[#0f172a] via-[#10182c] to-[#0a0f1d] border border-cyan-500/20 shadow-xl">
        <span className="inline-block px-3 py-0.5 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 mb-2">
          التقسيم الإداري الرسمي ومراكز خدمة المواطن
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          المحافظات السورية الأربع عشرة ومناطقها ونواحيها
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
          فهرس شامل للمحافظات الـ 14، مناطقها ونواحيها الإدارية، مراكز خدمة المواطن المؤتمتة، كراجات ومواقف الانطلاق، وحالة التحقق من البيانات.
        </p>
      </div>

      {/* Governorate Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {filteredGovs.map((gov) => {
          const isSelected = gov.id === currentGov.id;
          return (
            <button
              key={gov.id}
              onClick={() => setSelectedGovId(gov.id)}
              className={`shrink-0 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
                isSelected
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-950/40 ring-2 ring-cyan-400/40'
                  : 'bg-[#0e1424] text-slate-400 hover:text-white hover:bg-slate-800 border border-white/[0.08]'
              }`}
            >
              {gov.name}
            </button>
          );
        })}
      </div>

      {/* Selected Governorate Details Card */}
      <div className="rounded-3xl bg-gradient-to-b from-[#0f172a] to-[#0a0f1d] border border-white/[0.08] p-6 shadow-xl space-y-6">
        {/* Top Header info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl sm:text-2xl font-black text-white">
                {currentGov.name}
              </span>
              <span
                className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${
                  currentGov.verificationStatus.includes('مؤكدة')
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                    : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                }`}
              >
                {currentGov.verificationStatus}
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>المركز الإداري: {currentGov.center}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">
              عدد المناطق الإدارية: <strong>{currentGov.districts.length}</strong>
            </span>
          </div>
        </div>

        {/* Administrative Divisions (مناطق ونواحي) */}
        <div>
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <Building className="w-4 h-4 text-cyan-400" />
            المناطق الإدارية والنواحي التابعة لـ {currentGov.name}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {currentGov.districts.map((district, dIdx) => (
              <div
                key={dIdx}
                className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-cyan-300">{district.name}</h4>
                  <span className="text-[10px] text-slate-500">
                    {district.subDistricts.length} نواحي
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {district.subDistricts.map((sub, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2 py-0.5 rounded-lg bg-slate-800 text-[10px] text-slate-300"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Citizen Service Centers (مراكز خدمة المواطن) */}
        <div>
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <Building className="w-4 h-4 text-emerald-400" />
            مراكز خدمة المواطن التابعة للمحافظة
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {currentGov.citizenServiceCenters.map((csc, cIdx) => (
              <div
                key={cIdx}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-bold text-white">{csc.name}</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold shrink-0">
                    مؤتمت
                  </span>
                </div>

                <p className="text-xs text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{csc.address}</span>
                </p>

                {csc.phone && (
                  <p className="text-xs text-slate-300 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span dir="ltr">{csc.phone}</span>
                  </p>
                )}

                <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>ساعات الدوام: {csc.hours}</span>
                </p>

                <div className="pt-2 border-t border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block mb-1">الخدمات المتاحة بالمركز:</span>
                  <div className="flex flex-wrap gap-1">
                    {csc.servicesOffered.map((srv, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-200"
                      >
                        {srv}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Major Transport Hubs */}
        <div>
          <h3 className="text-sm font-bold text-white mb-2.5 flex items-center gap-2">
            <Bus className="w-4 h-4 text-amber-400" />
            كراجات ومحطات الانطلاق الرئيسية في {currentGov.name}
          </h3>
          <div className="space-y-2">
            {currentGov.majorTransportHubs.map((hub, hIdx) => (
              <div
                key={hIdx}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-slate-300"
              >
                <span className="h-2 w-2 rounded-full bg-amber-400 shrink-0" />
                <span>{hub}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
