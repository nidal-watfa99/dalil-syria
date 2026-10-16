import React, { useState, useMemo, useEffect } from 'react';
import {
  FileText,
  Search,
  Filter,
  DollarSign,
  Clock,
  MapPin,
  Building,
  CheckCircle2,
  AlertTriangle,
  Volume2,
  Bookmark,
  Share2,
  ExternalLink,
  ChevronDown,
  Layers,
  Sparkles,
  X,
} from 'lucide-react';
import { TRANSACTIONS_DATA } from '../data/transactions';
import { MINISTRIES_DATA } from '../data/ministries';
import { Transaction } from '../types';
import { arabicMatchesAny } from '../utils/arabicSearch';

interface TransactionsViewProps {
  onSelectTransaction: (tx: Transaction) => void;
  onSpeak: (text: string) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onShare: (item: Transaction) => void;
  initialSearch?: string;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  onSelectTransaction,
  onSpeak,
  favorites,
  onToggleFavorite,
  onShare,
  initialSearch = '',
}) => {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedMinistry, setSelectedMinistry] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Synchronize when parent changes initialSearch (e.g. from top Navbar or voice search)
  useEffect(() => {
    if (initialSearch !== undefined) {
      setSearchTerm(initialSearch);
    }
  }, [initialSearch]);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    TRANSACTIONS_DATA.forEach((t) => set.add(t.category));
    return Array.from(set);
  }, []);

  // Filter transactions with robust Arabic normalized search
  const filteredTransactions = useMemo(() => {
    return TRANSACTIONS_DATA.filter((tx) => {
      // Normalized Arabic Search across multiple comprehensive fields
      const matchesSearch =
        !searchTerm.trim() ||
        arabicMatchesAny(
          [
            tx.name,
            tx.responsibleEntity,
            tx.category,
            tx.ministryName,
            ...(tx.keywords || []),
            ...tx.conditions,
            ...tx.steps,
            ...tx.requiredDocuments.map((d) => d.name),
            tx.submissionPlace,
            tx.notes,
            tx.legalReferences,
          ],
          searchTerm
        );

      // Ministry filter
      const matchesMinistry =
        selectedMinistry === 'all' || tx.ministryId === selectedMinistry;

      // Status filter
      const matchesStatus =
        selectedStatus === 'all' || tx.status === selectedStatus;

      // Category filter
      const matchesCategory =
        selectedCategory === 'all' || tx.category === selectedCategory;

      return matchesSearch && matchesMinistry && matchesStatus && matchesCategory;
    });
  }, [searchTerm, selectedMinistry, selectedStatus, selectedCategory]);

  const quickSearchShortcuts = [
    { label: 'حصر الإرث والتركات', query: 'حصر الارث' },
    { label: 'جواز السفر الإلكتروني', query: 'جواز السفر' },
    { label: 'صحيفة لا حكم عليه', query: 'غير محكوم' },
    { label: 'إخراج قيد نفوس', query: 'قيد نفوس' },
    { label: 'رخصة القيادة وإجازة السوق', query: 'رخصة قيادة' },
    { label: 'بيان قيد عقاري', query: 'قيد عقاري' },
    { label: 'ساعة كهرباء جديدة', query: 'كهرباء' },
    { label: 'سجل تجاري وشركات', query: 'سجل تجاري' },
    { label: 'فراغ ونقل ملكية سيارة', query: 'فراغ مركبة' },
    { label: 'معادلة شهادة جامعية', query: 'معادلة' },
  ];

  return (
    <div className="space-y-5 animate-fadeIn text-right">
      {/* Header with Google AI Studio styling */}
      <div className="p-6 rounded-3xl bg-[#1e1f20] border border-[#333537] shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-[#1a73e8]/20 text-[#a8c7fa] border border-[#1a73e8]/30">
                القسم الأساسي والأولوية الأولى للتطبيق
              </span>
              <span className="text-xs text-[#c4c7c5] font-medium">
                حصر رسمي شامل وتدقيق كامل لإصدار 2026
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#e3e3e3]">
              معاملاتي الشامل — دليل المعاملات الحكومية السورية
            </h1>
            <p className="text-xs sm:text-sm text-[#c4c7c5] mt-1 max-w-3xl leading-relaxed">
              محرك استعلام فوري ذكي يغطي كافة المعاملات الرسمية في سوريا: الشروط، الرسوم بالليرة السورية، الوثائق (الأصلية والنسخ المصدقة)، خطوات التقديم، مراكز خدمة المواطن، والمراجع القانونية المعتمدة.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="px-4 py-2.5 rounded-2xl bg-[#282a2c] border border-[#3c4043] text-center">
              <span className="text-[10px] text-[#8e918f] block">إجمالي المعاملات الموثقة</span>
              <span className="text-lg font-black text-[#a8c7fa]">{TRANSACTIONS_DATA.length} معاملة</span>
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-[#282a2c] border border-[#3c4043] text-center">
              <span className="text-[10px] text-[#8e918f] block">نسبة التدقيق الرسمية</span>
              <span className="text-lg font-black text-emerald-400">100% مدققة</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar with Google AI Studio Surface */}
      <div className="relative z-20 p-5 rounded-2xl bg-[#1e1f20] border border-[#333537] shadow-md space-y-4">
        {/* Main Search Input */}
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ابحث باسم المعاملة أو الكلمات المفتاحية (مثال: حصر الارث، جواز سفر، غير محكوم، إخراج قيد، رخصة قيادة، قيد عقاري، ساعة كهرباء)..."
            className="w-full rounded-xl bg-[#282a2c] border border-[#3c4043] pr-11 pl-10 py-3 text-sm text-white placeholder-[#8e918f] focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] transition"
          />
          <Search className="absolute right-3.5 top-3.5 w-5 h-5 text-[#8e918f] pointer-events-none" />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute left-3 top-2.5 p-1 text-[#c4c7c5] hover:text-white bg-[#333537] hover:bg-[#3c4043] rounded-lg transition"
              title="مسح البحث"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Search Shortcut Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-[#8e918f] font-semibold shrink-0 ml-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#a8c7fa]" />
            بحث سريع:
          </span>
          {quickSearchShortcuts.map((chip) => {
            const isSelected = searchTerm.includes(chip.query) || searchTerm === chip.label;
            return (
              <button
                key={chip.label}
                onClick={() => setSearchTerm(chip.query)}
                className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition ${
                  isSelected
                    ? 'bg-[#1a73e8] text-white shadow-sm'
                    : 'bg-[#282a2c] hover:bg-[#333537] text-[#c4c7c5] hover:text-white border border-[#3c4043]'
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 border-t border-[#333537]">
          {/* Ministry Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-[#8e918f] mb-1">الجهة الحكومية:</label>
            <select
              value={selectedMinistry}
              onChange={(e) => setSelectedMinistry(e.target.value)}
              className="w-full rounded-xl bg-[#282a2c] border border-[#3c4043] px-3 py-2 text-xs text-[#e3e3e3] focus:outline-none focus:border-[#1a73e8]"
            >
              <option value="all">كافة الوزارات والجهات ({MINISTRIES_DATA.length})</option>
              {MINISTRIES_DATA.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-[#8e918f] mb-1">تصنيف المعاملة:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-xl bg-[#282a2c] border border-[#3c4043] px-3 py-2 text-xs text-[#e3e3e3] focus:outline-none focus:border-[#1a73e8]"
            >
              <option value="all">كافة التصنيفات ({categories.length})</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-[#8e918f] mb-1">حالة المعاملة:</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full rounded-xl bg-[#282a2c] border border-[#3c4043] px-3 py-2 text-xs text-[#e3e3e3] focus:outline-none focus:border-[#1a73e8]"
            >
              <option value="all">جميع الحالات (متاحة، متوقفة، غير متحقق)</option>
              <option value="متاحة">متاحة حالياً</option>
              <option value="متوقفة">متوقفة مؤقتاً</option>
              <option value="غير متحقق منها">غير متحقق منها</option>
            </select>
          </div>
        </div>

        {/* Active Filters count */}
        <div className="flex items-center justify-between text-xs text-[#8e918f] pt-1">
          <span>
            نتائج البحث والتصفية: <strong className="text-white">{filteredTransactions.length}</strong> معاملة مطابقة
          </span>
          {(selectedMinistry !== 'all' || selectedStatus !== 'all' || selectedCategory !== 'all' || searchTerm) && (
            <button
              onClick={() => {
                setSelectedMinistry('all');
                setSelectedStatus('all');
                setSelectedCategory('all');
                setSearchTerm('');
              }}
              className="text-[#a8c7fa] hover:underline font-semibold"
            >
              إعادة ضبط الفلاتر وإظهار الكل
            </button>
          )}
        </div>
      </div>

      {/* Transactions Cards Grid */}
      {filteredTransactions.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[#1e1f20] border border-[#333537] space-y-3">
          <FileText className="w-12 h-12 text-[#8e918f] mx-auto opacity-50" />
          <h3 className="text-base font-bold text-white">لم يتم العثور على أي معاملة تطابق بحثك</h3>
          <p className="text-xs text-[#c4c7c5] max-w-md mx-auto leading-relaxed">
            البحث يدعم الآن الكلمات المتعددة والهمزات تلقائياً (مثل &quot;حصر الارث&quot; أو &quot;حصر الإرث&quot;). حاول كتابة كلمة واحدة رئيسية أو اضغط &quot;إعادة ضبط الفلاتر&quot;.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedMinistry('all');
              setSelectedCategory('all');
              setSelectedStatus('all');
            }}
            className="mt-2 px-4 py-2 rounded-xl bg-[#1a73e8] text-xs font-bold text-white hover:bg-[#1b66c9] transition"
          >
            عرض كافة المعاملات الحكومية
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTransactions.map((tx) => {
            const isFav = favorites.includes(tx.id);
            return (
              <div
                key={tx.id}
                className="group flex flex-col justify-between rounded-2xl bg-[#1e1f20] hover:bg-[#282a2c] border border-[#333537] hover:border-[#a8c7fa]/50 p-5 shadow-lg transition-all duration-200"
              >
                <div>
                  {/* Card Top badges */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-[#282a2c] text-[#a8c7fa] border border-[#3c4043]">
                      {tx.ministryName}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                          tx.status === 'متاحة'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : tx.status === 'متوقفة'
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        }`}
                      >
                        {tx.status}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(tx.id);
                        }}
                        className={`p-1.5 rounded-lg transition ${
                          isFav ? 'text-amber-400 bg-amber-400/10' : 'text-[#8e918f] hover:text-[#c4c7c5] hover:bg-[#333537]'
                        }`}
                        title={isFav ? 'إزالة من المفضلة' : 'حفظ في المفضلة'}
                      >
                        <Bookmark className="w-3.5 h-3.5 fill-current" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Entity */}
                  <h3
                    onClick={() => onSelectTransaction(tx)}
                    className="text-base font-bold text-white group-hover:text-[#a8c7fa] cursor-pointer transition-colors leading-snug mb-1.5"
                  >
                    {tx.name}
                  </h3>
                  <p className="text-xs text-[#c4c7c5] flex items-center gap-1.5 mb-3">
                    <Building className="w-3.5 h-3.5 text-[#a8c7fa] shrink-0" />
                    <span className="truncate">{tx.responsibleEntity}</span>
                  </p>

                  {/* Key Conditions excerpt */}
                  <div className="bg-[#282a2c] rounded-xl p-2.5 mb-3 border border-[#333537]">
                    <span className="text-[10px] font-bold text-[#8e918f] block mb-1">
                      أبرز الشروط والأهلية:
                    </span>
                    <p className="text-xs text-[#e3e3e3] line-clamp-2 leading-relaxed">
                      {tx.conditions[0] || 'يرجى مراجعة تفاصيل المعاملة كاملة.'}
                    </p>
                  </div>
                </div>

                {/* Card Bottom Meta & Actions */}
                <div className="pt-3 border-t border-[#333537] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#8e918f]">الرسم الرسمي (2026):</span>
                    <span className="font-extrabold text-amber-300">{tx.fee.formattedFee}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#8e918f]">المدة المتوقعة:</span>
                    <span className="font-semibold text-[#a8c7fa]">{tx.expectedDuration}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#8e918f]">الوثائق المطلوبة:</span>
                    <span className="text-[#c4c7c5] font-medium">
                      {tx.requiredDocuments.length} وثائق (
                      {tx.requiredDocuments.filter((d) => d.isOriginal).length} أصل)
                    </span>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 pt-1.5">
                    <button
                      onClick={() => onSelectTransaction(tx)}
                      className="flex-1 rounded-xl bg-[#1a73e8] hover:bg-[#1b66c9] py-2 text-xs font-bold text-white transition text-center shadow-sm"
                    >
                      عرض الدليل الكامل والخطوات
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSpeak(
                          `معاملة: ${tx.name}. الجهة المسؤولة: ${tx.responsibleEntity}. الرسوم الرسمية: ${tx.fee.formattedFee}. المدة المتوقعة: ${tx.expectedDuration}. الشرط الأول: ${tx.conditions[0]}`
                        );
                      }}
                      className="p-2 rounded-xl bg-[#282a2c] text-[#a8c7fa] hover:bg-[#333537] transition border border-[#3c4043]"
                      title="استمع للملخص صوتياً"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onShare(tx);
                      }}
                      className="p-2 rounded-xl bg-[#282a2c] text-[#c4c7c5] hover:text-white hover:bg-[#333537] transition border border-[#3c4043]"
                      title="مشاركة تفاصيل المعاملة"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
