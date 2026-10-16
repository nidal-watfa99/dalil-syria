import React, { useState } from 'react';
import {
  Plane,
  Globe2,
  ShieldAlert,
  ShieldCheck,
  ExternalLink,
  Clock,
  DollarSign,
  FileText,
  AlertTriangle,
  Phone,
  Search,
} from 'lucide-react';
import {
  VISA_DESTINATIONS_DATA,
  AIRLINES_DATA,
  ASYLUM_AND_MIGRATION_DATA,
} from '../data/travel';

export const TravelView: React.FC<{ defaultSubSection?: 'visas' | 'asylum' }> = ({
  defaultSubSection = 'visas',
}) => {
  const [activeTab, setActiveTab] = useState<'visas' | 'airlines' | 'asylum'>(
    defaultSubSection === 'asylum' ? 'asylum' : 'visas'
  );
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVisas = VISA_DESTINATIONS_DATA.filter(
    (v) =>
      !searchQuery.trim() ||
      v.country.includes(searchQuery) ||
      v.visaType.includes(searchQuery)
  );

  return (
    <div className="space-y-6 animate-fadeIn text-right">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-l from-[#0f172a] via-[#10182c] to-[#0a0f1d] border border-cyan-500/20 shadow-xl">
        <span className="inline-block px-3 py-0.5 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 mb-2">
          التأشيرات، الطيران، وقسم اللجوء والهجرة الرسمي
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          دليل السفر، التأشيرات، الطيران، وإجراءات اللجوء
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
          اشتراطات التأشيرات الدولية للسوريين، مقارنة الرسوم الرسمية بأتعاب المكاتب، شركات الطيران العاملة وروابط الحجز، وتوجيهات الحماية الدولية والتحذير الصارم من الاحتيال.
        </p>
      </div>

      {/* Sub-Tabs Selector */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#0e1424] border border-white/[0.08] w-fit">
        <button
          onClick={() => setActiveTab('visas')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'visas'
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>التأشيرات وشروط الدخول</span>
        </button>

        <button
          onClick={() => setActiveTab('airlines')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'airlines'
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Plane className="w-3.5 h-3.5" />
          <span>شركات الطيران والمطارات</span>
        </button>

        <button
          onClick={() => setActiveTab('asylum')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'asylum'
              ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>اللجوء والهجرة والتحذير من الاحتيال</span>
        </button>
      </div>

      {/* TAB 1: VISAS */}
      {activeTab === 'visas' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredVisas.map((v) => (
              <div
                key={v.id}
                className="rounded-3xl bg-gradient-to-b from-[#0f172a] to-[#0a0f1d] border border-white/[0.08] p-5 shadow-lg space-y-3.5"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">{v.country}</h3>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    {v.applicationMode}
                  </span>
                </div>

                <p className="text-xs text-slate-300 font-semibold">{v.visaType}</p>

                {/* Requirements list */}
                <div className="space-y-1.5 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 block mb-1">
                    الشروط والوثائق الرسمية:
                  </span>
                  {v.officialRequirements.map((req, rIdx) => (
                    <div key={rIdx} className="flex items-start gap-2 text-xs text-slate-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                      <span>{req}</span>
                    </div>
                  ))}
                </div>

                {/* Fees Breakdown: Official vs Agency */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                    <span className="text-[10px] text-emerald-400 font-bold block">الرسم الرسمي:</span>
                    <span className="text-xs font-bold text-white mt-0.5 block">{v.officialFees}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                    <span className="text-[10px] text-amber-400 font-bold block">أتعاب المكاتب التقديرية:</span>
                    <span className="text-xs font-bold text-amber-300 mt-0.5 block">{v.agencyFeesEstimate}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span>مدة المعالجة: {v.processingTime}</span>
                  {v.officialPortalUrl && (
                    <a
                      href={v.officialPortalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-cyan-400 hover:underline font-semibold"
                    >
                      <span>البوابة الرسمية</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <p className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
                  تنبيه: {v.notes}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: AIRLINES */}
      {activeTab === 'airlines' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {AIRLINES_DATA.map((air, idx) => (
              <div
                key={idx}
                className="rounded-3xl bg-gradient-to-b from-[#0f172a] to-[#0a0f1d] border border-white/[0.08] p-5 shadow-lg space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    رمز إياتا: {air.code}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                    {air.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">{air.name}</h3>

                <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs space-y-1.5">
                  <p className="text-slate-300"><strong>المطارات الرئيسية:</strong> {air.hub}</p>
                  <p className="text-slate-300"><strong>المكتب الرئيسي:</strong> {air.headOffice}</p>
                  <p className="text-slate-300" dir="ltr"><strong>هاتف الحجز:</strong> {air.phone}</p>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-400 block mb-1.5">
                    الوجهات والرحلات المتاحة:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {air.destinations.map((dest, dIdx) => (
                      <span
                        key={dIdx}
                        className="px-2.5 py-1 rounded-xl bg-slate-800 text-xs text-slate-200 border border-slate-700/60"
                      >
                        {dest}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <a
                    href={air.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 py-2 text-xs font-bold text-white hover:from-cyan-500 hover:to-blue-500 transition"
                  >
                    <span>الانتقال لموقع الحجز الرسمي</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ASYLUM, RESETTLEMENT & ANTI-FRAUD */}
      {activeTab === 'asylum' && (
        <div className="space-y-4">
          {/* Urgent Warning Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-rose-950/30 border border-rose-500/40 text-xs sm:text-sm text-rose-200 flex items-start gap-3 shadow-lg">
            <ShieldAlert className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1 leading-relaxed">
              <strong className="block text-rose-300 text-sm font-bold">
                تحذير صارم من الاحتيال والسماسرة غير المعتمدين:
              </strong>
              <p>
                لا تضمن أي جهة أو وسيط أو صفحة فيسبوك أو تلغرام قبول أي طلب لجوء أو إعادة توطين إطلاقاً. خدمات المفوضية السامية للأمم المتحدة (UNHCR) والمنظمة الدولية للهجرة (IOM) مجانية بنسبة 100%. التعامل مع المهربين أو شراء مواعيد وهمية يعرضك للمساءلة القانونية والحظر الدائم وضياع الأموال.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ASYLUM_AND_MIGRATION_DATA.map((guide) => (
              <div
                key={guide.id}
                className="rounded-3xl bg-gradient-to-b from-[#0f172a] to-[#0a0f1d] border border-white/[0.08] p-5 shadow-lg space-y-3.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-blue-500/10 text-blue-300 border border-blue-500/20">
                    {guide.organization}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    تحديث: {guide.lastUpdated}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">{guide.title}</h3>
                <p className="text-xs text-cyan-300 font-semibold">{guide.targetCountryOrScope}</p>

                {/* Official Procedures */}
                <div className="space-y-2 bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
                  <span className="text-[11px] font-bold text-slate-300 block">
                    الإجراءات والمسارات الرسمية القانونية:
                  </span>
                  {guide.officialProcedures.map((proc, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-2 text-xs text-slate-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                      <span>{proc}</span>
                    </div>
                  ))}
                </div>

                {/* Specific anti-fraud note */}
                <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200/90 leading-relaxed">
                  <strong>تنبيه الأمان:</strong> {guide.warningAgainstFraud}
                </div>

                {/* Contacts & Portals */}
                <div className="pt-2 border-t border-slate-800 space-y-1.5">
                  <span className="text-[10px] text-slate-400 block font-bold">
                    قنوات الاتصال والروابط الموثوقة:
                  </span>
                  {guide.officialContacts.map((contact, cIdx) => (
                    <div key={cIdx} className="flex items-center justify-between text-xs text-slate-300">
                      <span>{contact.type}:</span>
                      {contact.detail.startsWith('http') ? (
                        <a
                          href={contact.detail}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
                          dir="ltr"
                        >
                          <span>{contact.detail.replace('https://', '')}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="font-bold text-emerald-400" dir="ltr">
                          {contact.detail}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
