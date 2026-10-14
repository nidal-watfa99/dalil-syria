import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Bot,
  MapPin,
  ShieldCheck,
  Compass,
  FileText,
  Clock,
  ArrowRight,
  ChevronLeft,
  X,
  ExternalLink,
  Coins,
  Bookmark,
  Share2,
  Sparkles,
  SlidersHorizontal,
  Bus,
  Globe,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { SyriaInteractiveMap } from './components/map/SyriaInteractiveMap';
import { VoiceSearchButton } from './components/common/VoiceSearchButton';
import { TransactionCard } from './components/transactions/TransactionCard';
import { TransactionDetailModal } from './components/transactions/TransactionDetailModal';
import { SmartAssistantModal } from './components/assistant/SmartAssistantModal';
import { VisasView } from './components/visas/VisasView';
import { TransportFaresView } from './components/transport/TransportFaresView';
import { ConsoleDiagnosticsModal } from './components/diagnostics/ConsoleDiagnosticsModal';
import { AdminPortal } from './components/admin/AdminPortal';
import { FeedbackModal } from './components/feedback/FeedbackModal';
import { OfflineIndicator } from './components/common/OfflineIndicator';

import { Transaction, Authority, Governorate, Category } from './types';
import { TRANSACTIONS_DATA } from './data/transactionsData';
import { AUTHORITIES_DATA } from './data/authoritiesData';
import { GOVERNORATES_DATA } from './data/governoratesData';
import { CATEGORIES_DATA } from './data/categoriesData';
import { executeUnifiedSearch, analyzeNaturalQuery } from './utils/searchEngine';
import { getFavorites, logDiagnostic } from './utils/storageAndLogs';

export default function App() {
  // Navigation & Page State
  const [currentTab, setCurrentTab] = useState<'home' | 'transactions' | 'map' | 'visas' | 'transport'>('home');
  const [selectedGovernorate, setSelectedGovernorate] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Search State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Modals State
  const [activeTransaction, setActiveTransaction] = useState<Transaction | null>(null);
  const [assistantOpen, setAssistantOpen] = useState<boolean>(false);
  const [consoleOpen, setConsoleOpen] = useState<boolean>(false);
  const [adminOpen, setAdminOpen] = useState<boolean>(false);
  const [feedbackTarget, setFeedbackTarget] = useState<{
    type: 'transaction' | 'authority' | 'transport' | 'visa' | 'general';
    id: string;
    name: string;
  } | null>(null);
  const [feedbackOpen, setFeedbackOpen] = useState<boolean>(false);

  // Map deep target
  const [mapTargetAuthorityId, setMapTargetAuthorityId] = useState<string | undefined>(undefined);

  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return document.documentElement.classList.contains('dark');
  });

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Deep linking via URL hash
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash.startsWith('tx/')) {
        const txId = hash.replace('tx/', '');
        const found = TRANSACTIONS_DATA.find((t) => t.id === txId);
        if (found) {
          setActiveTransaction(found);
          logDiagnostic('info', 'DeepLink', `Opened transaction via hash link: ${txId}`);
        }
      } else if (hash === 'map') {
        setCurrentTab('map');
      } else if (hash === 'transactions') {
        setCurrentTab('transactions');
      } else if (hash === 'visas') {
        setCurrentTab('visas');
      } else if (hash === 'transport') {
        setCurrentTab('transport');
      } else if (hash === 'admin') {
        setAdminOpen(true);
      } else if (hash === 'diagnostics') {
        setConsoleOpen(true);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Theme Toggle
  const toggleDarkMode = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    if (next) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
    logDiagnostic('info', 'Theme', `Switched theme to ${next ? 'Dark' : 'Light'}`);
  };

  // Web Share App
  const handleShareApp = async () => {
    const shareData = {
      title: 'دليل سوريا | DALIL SYRIA',
      text: 'الدليل الوطني الرقمي الموحد للمعاملات الحكومية والمواقع الجغرافية وأجور النقل في الجمهورية العربية السورية.',
      url: window.location.origin,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        logDiagnostic('info', 'Share', 'Shared via Web Share API');
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(window.location.origin);
      showToast('تم نسخ رابط التطبيق إلى الحافظة بنجاح.');
      logDiagnostic('info', 'Share', 'Copied URL to clipboard');
    }
  };

  // Web Share Transaction
  const handleShareTransaction = async (tx: Transaction) => {
    const txUrl = `${window.location.origin}/#tx/${tx.id}`;
    const shareData = {
      title: `معاملة: ${tx.titleAr} - دليل سوريا`,
      text: `دليل إجراءات ورسوم ${tx.titleAr} الصادر رسمياً عن ${tx.responsibleAuthority}.`,
      url: txUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(txUrl);
      showToast('تم نسخ رابط المعاملة إلى الحافظة بنجاح.');
    }
  };

  // Unified Search Results Computation
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    return executeUnifiedSearch(
      searchQuery,
      {
        governorateId: selectedGovernorate !== 'all' ? selectedGovernorate : undefined,
        categoryId: selectedCategory !== 'all' ? selectedCategory : undefined,
      }
    );
  }, [searchQuery, selectedGovernorate, selectedCategory]);

  // Saved Favorites
  const favorites = getFavorites();
  const favoriteTransactions = useMemo(() => {
    return TRANSACTIONS_DATA.filter((tx) => favorites.includes(tx.id));
  }, [favorites]);

  // Navigate to map with specific pin
  const handleOpenMapWithAuthority = (authorityId?: string) => {
    setMapTargetAuthorityId(authorityId);
    setCurrentTab('map');
  };

  // Open feedback with specific target
  const handleReportInaccuracy = (target: { type: 'transaction' | 'authority' | 'transport' | 'visa' | 'general'; id: string; name: string }) => {
    setFeedbackTarget(target);
    setFeedbackOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F17] text-slate-100 selection:bg-amber-500/20 selection:text-amber-300">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onNavigate={setCurrentTab}
        onOpenAssistant={() => setAssistantOpen(true)}
        onOpenConsole={() => setConsoleOpen(true)}
        onOpenAdmin={() => setAdminOpen(true)}
        onOpenFeedback={() => {
          setFeedbackTarget({ type: 'general', id: 'app', name: 'اقتراح أو ملاحظة عامة' });
          setFeedbackOpen(true);
        }}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        onShareApp={handleShareApp}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-10">
        
        {/* ========================================================= */}
        {/* VIEW 1: HOME PAGE */}
        {/* ========================================================= */}
        {currentTab === 'home' && (
          <div className="space-y-12 animate-fade-in">
            
            {/* Hero Section */}
            <section className="relative rounded-2xl glass-panel p-6 sm:p-10 border border-slate-700/80 shadow-2xl overflow-hidden space-y-6">
              {/* Subtle Syrian Pattern Accent Background */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 max-w-3xl space-y-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>المنظومة الوطنية الموحدة · الجمهورية العربية السورية</span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="text-slate-400 font-mono">بدون معلومات مختلقة</span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  دليل سوريا الرقمي الموحد للمعاملات والجهات والخرائط
                </h1>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                  محرك استعلام متقدم للمعاملات الإدارية والقضائية والعقارية في جميع المحافظات السورية. نوفر الشروط، الرسوم الموثقة بالمراسيم، قوائم الأوراق التفاعلية، ومواقع الدوائر الحكومية الجغرافية.
                </p>
              </div>

              {/* Natural Query Unified Search Bar */}
              <div className="relative z-10 max-w-3xl space-y-2">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="اكتب استفسارك أو تحدث بالصوت (مثال: أريد استخراج جواز سفر في طرطوس)..."
                    className="w-full py-4 pr-12 pl-24 text-xs sm:text-sm rounded-xl recessed-field text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/60 shadow-2xl"
                  />
                  <Search className="w-5 h-5 text-amber-400 absolute right-4 top-4 pointer-events-none" />
                  
                  {/* Voice Search & Clear Buttons */}
                  <div className="absolute left-3 top-2.5 flex items-center gap-1.5">
                    <VoiceSearchButton
                      size="sm"
                      onTranscript={(voiceText) => {
                        setSearchQuery(voiceText);
                        showToast(`تم التقاط البحث الصوتي: "${voiceText}"`);
                      }}
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="p-1.5 text-slate-400 hover:text-white"
                        title="مسح البحث"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Natural search example triggers & direct map toggle */}
                <div className="flex items-center gap-2 overflow-x-auto text-[11px] text-slate-400 pt-1 pb-1">
                  <button
                    onClick={() => {
                      const mapSection = document.getElementById('home-map-section');
                      if (mapSection) {
                        mapSection.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        setCurrentTab('map');
                      }
                    }}
                    className="shrink-0 py-1 px-3 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold border border-amber-500/40 flex items-center gap-1 transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>الخريطة المباشرة</span>
                  </button>
                  <span className="shrink-0 text-slate-500">أو جرب:</span>
                  <button
                    onClick={() => setSearchQuery('أريد استخراج جواز سفر في طرطوس')}
                    className="shrink-0 py-1 px-2.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
                  >
                    جواز سفر في طرطوس
                  </button>
                  <button
                    onClick={() => setSearchQuery('شهادة لا حكم عليه بدمشق')}
                    className="shrink-0 py-1 px-2.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
                  >
                    شهادة لا حكم عليه
                  </button>
                  <button
                    onClick={() => setSearchQuery('فراغ عقار سكني في اللاذقية')}
                    className="shrink-0 py-1 px-2.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
                  >
                    فراغ عقار باللاذقية
                  </button>
                  <button
                    onClick={() => setSearchQuery('تجديد رخصة القيادة')}
                    className="shrink-0 py-1 px-2.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
                  >
                    تجديد رخصة القيادة
                  </button>
                </div>
              </div>

              {/* Natural Analysis Result Box (When search matches intents) */}
              {searchResults && searchResults.analysis.detectedTransaction && (
                <div className="relative z-10 p-4 rounded-xl bg-slate-900/90 border border-amber-500/40 shadow-xl space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-amber-400 font-bold flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" />
                      تحليل السؤال الموجه: تم تحديد المعاملة والمحافظة تلقائياً
                    </span>
                    <button
                      onClick={() => setActiveTransaction(searchResults.analysis.detectedTransaction!)}
                      className="text-xs font-semibold text-amber-300 hover:underline flex items-center gap-1"
                    >
                      فتح الدليل الكامل
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-xs space-y-1.5 text-slate-200">
                    <p>
                      <strong>المعاملة:</strong> {searchResults.analysis.detectedTransaction.titleAr}
                    </p>
                    {searchResults.analysis.detectedGovernorate && (
                      <p>
                        <strong>المحافظة المحددة:</strong> {searchResults.analysis.detectedGovernorate.nameAr}
                      </p>
                    )}
                    <p className="text-slate-300 line-clamp-2">
                      {searchResults.analysis.detectedTransaction.summaryAr}
                    </p>
                  </div>
                </div>
              )}
            </section>

            {/* Quick Map Preview Section */}
            <section id="home-map-section" className="space-y-4 scroll-mt-20">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-amber-400" />
                    <span>الخريطة الجغرافية التفاعلية للجهات والدوائر الحكومية</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    استكشف فروع الهجرة والجوازات، قصور العدل، المصالح العقارية، ومراكز البولمان بإحداثيات حقيقية
                  </p>
                </div>
                <button
                  onClick={() => setCurrentTab('map')}
                  className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 py-1.5 px-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 shadow-md"
                  title="تكبير الخريطة في صفحة مخصصة مع زر رجوع"
                >
                  <span>تكبير الخريطة</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>

              <SyriaInteractiveMap
                className="h-[520px] md:h-[580px] shadow-2xl"
                onBackToHome={() => setCurrentTab('home')}
                onSelectAuthority={(auth) => {
                  logDiagnostic('info', 'HomeMap', `Selected authority pin: ${auth.nameAr}`);
                }}
                onRequestInaccuracyReport={(auth) => {
                  handleReportInaccuracy({ type: 'authority', id: auth.id, name: auth.nameAr });
                }}
              />
            </section>

            {/* Common Transactions Section */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-amber-400" />
                    <span>المعاملات الأكثر طلباً واستعلاماً</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    إجراءات رسمية موثقة بالقوانين مع قوائم الأوراق التفاعلية والرسوم المعلنة
                  </p>
                </div>
                <button
                  onClick={() => setCurrentTab('transactions')}
                  className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                >
                  <span>عرض جميع المعاملات</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(searchResults ? searchResults.transactions : TRANSACTIONS_DATA).slice(0, 6).map((tx) => (
                  <TransactionCard
                    key={tx.id}
                    transaction={tx}
                    onOpenDetails={(t) => setActiveTransaction(t)}
                    onOpenMap={handleOpenMapWithAuthority}
                    onShare={handleShareTransaction}
                  />
                ))}
              </div>
            </section>

            {/* 20 Comprehensive National Categories */}
            <section className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Compass className="w-5 h-5 text-amber-400" />
                  <span>الأقسام والتصنيفات الوطنية الشاملة (٢٠ قسماً)</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  تغطية كاملة لكافة مجالات الخدمة المدنية والقضائية والاقتصادية والتنظيمية
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {CATEGORIES_DATA.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setCurrentTab('transactions');
                    }}
                    className="p-4 rounded-xl glass-card border border-slate-800 hover:border-amber-500/40 transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-mono text-slate-500 block mb-1">
                        قسم {cat.order < 10 ? `0${cat.order}` : cat.order}
                      </span>
                      <h4 className="font-bold text-xs text-white group-hover:text-amber-300 transition-colors leading-snug">
                        {cat.titleAr}
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                      {cat.descriptionAr}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Bookmarked / Saved Transactions (if any) */}
            {favoriteTransactions.length > 0 && (
              <section className="space-y-4 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Bookmark className="w-5 h-5 text-amber-400 fill-current" />
                    <span>المعاملات المحفوظة الخاصة بك ({favoriteTransactions.length})</span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favoriteTransactions.map((tx) => (
                    <TransactionCard
                      key={tx.id}
                      transaction={tx}
                      onOpenDetails={(t) => setActiveTransaction(t)}
                      onOpenMap={handleOpenMapWithAuthority}
                      onShare={handleShareTransaction}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Transport & Visas Highlights Row */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
              {/* Transport Quick Card */}
              <div
                onClick={() => setCurrentTab('transport')}
                className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                    <Bus className="w-6 h-6" />
                  </span>
                  <span className="text-xs text-amber-400 font-semibold group-hover:-translate-x-1 transition-transform flex items-center gap-1">
                    فتح جدول التعرفة
                    <ChevronLeft className="w-4 h-4" />
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">دليل أسعار النقل بالبولمان بين المحافظات</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  التعرفة الرسمية الصادرة عن وزارة التجارة الداخلية، مراكز الانطلاق (القابون، السومرية، الراموسة، طرطوس)، والمسافات بالكيلومترات.
                </p>
              </div>

              {/* Visas Quick Card */}
              <div
                onClick={() => setCurrentTab('visas')}
                className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <Globe className="w-6 h-6" />
                  </span>
                  <span className="text-xs text-emerald-400 font-semibold group-hover:-translate-x-1 transition-transform flex items-center gap-1">
                    دليل التأشيرات الرسمي
                    <ChevronLeft className="w-4 h-4" />
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">قسم التأشيرات والسفر الدولي للمواطنين السوريين</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  متطلبات تأشيرات B1/B2 الأمريكية، الشنغن الأوروبي، الإمارات، مصر، ولبنان وفق القنوات الدبلوماسية المعتمدة مع تحذيرات مكافحة الاحتيال.
                </p>
              </div>
            </section>

          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 2: TRANSACTIONS DIRECTORY */}
        {/* ========================================================= */}
        {currentTab === 'transactions' && (
          <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-700/80 shadow-xl space-y-3">
              <h2 className="text-xl md:text-2xl font-bold text-white">
                دليل المعاملات والإجراءات الحكومية الموحدة
              </h2>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-3xl">
                فهرس الإجراءات الرسمية، الأوراق المطلوبة، الرسوم الموثقة بالمراسيم، وطرق الدفع المعتمدة دون أي تخمين أو بيانات غير موثقة.
              </p>
            </div>

            {/* Filter controls */}
            <div className="glass-panel p-4 rounded-xl border border-slate-700 flex flex-col md:flex-row gap-3">
              <div className="relative flex-1 flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث باسم المعاملة أو الكلمات المرادفة أو تحدث بالصوت..."
                  className="w-full py-2.5 pr-9 pl-20 text-xs rounded-lg recessed-field text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                
                <div className="absolute left-2.5 top-1.5 flex items-center gap-1">
                  <VoiceSearchButton
                    size="sm"
                    onTranscript={(voiceText) => {
                      setSearchQuery(voiceText);
                      showToast(`تم البحث الصوتي: "${voiceText}"`);
                    }}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="p-1 text-slate-400 hover:text-white"
                      title="مسح البحث"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 text-xs rounded-lg recessed-field text-slate-200 focus:outline-none cursor-pointer"
                >
                  <option value="all">جميع القطاعات (٢٠ قطاعاً)</option>
                  {CATEGORIES_DATA.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.titleAr}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedGovernorate}
                  onChange={(e) => setSelectedGovernorate(e.target.value)}
                  className="px-3 py-2 text-xs rounded-lg recessed-field text-slate-200 focus:outline-none cursor-pointer"
                >
                  <option value="all">جميع المحافظات (١٤ محافظة)</option>
                  {GOVERNORATES_DATA.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.nameAr}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(searchResults ? searchResults.transactions : TRANSACTIONS_DATA)
                .filter((tx) => selectedCategory === 'all' || tx.categoryId === selectedCategory)
                .map((tx) => (
                  <TransactionCard
                    key={tx.id}
                    transaction={tx}
                    onOpenDetails={(t) => setActiveTransaction(t)}
                    onOpenMap={handleOpenMapWithAuthority}
                    onShare={handleShareTransaction}
                  />
                ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 3: FULLSCREEN GIS MAP */}
        {/* ========================================================= */}
        {currentTab === 'map' && (
          <div className="space-y-4 animate-fade-in">
            <div className="glass-panel p-4 rounded-xl border border-slate-700 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {/* Prominent Back Button (زر رجوع) */}
                <button
                  type="button"
                  onClick={() => setCurrentTab('home')}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-xl transition-all hover:scale-105 active:scale-95"
                  title="الرجوع إلى الصفحة الرئيسية"
                >
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  <span>الرجوع إلى الصفحة الرئيسية</span>
                </button>

                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-amber-400" />
                    <span>نظام الخرائط الجغرافية GIS ومراكز الخدمات الوطنية</span>
                  </h2>
                  <p className="text-xs text-slate-400 hidden sm:block">
                    انقر على أي مركز لعرض ساعات الدوام، الهاتف الرسمي، والاتجاهات الملاحية المباشرة
                  </p>
                </div>
              </div>

              <div className="text-xs text-slate-400 font-medium hidden md:block">
                ١٤ محافظة سورية موثقة
              </div>
            </div>

            <SyriaInteractiveMap
              className="h-[680px] md:h-[760px] shadow-2xl"
              initialGovernorateId={selectedGovernorate !== 'all' ? selectedGovernorate : undefined}
              selectedAuthorityId={mapTargetAuthorityId}
              onBackToHome={() => setCurrentTab('home')}
              isExpandedView={true}
              onSelectAuthority={(auth) => {
                logDiagnostic('info', 'GISMap', `Selected pin: ${auth.nameAr}`);
              }}
              onRequestInaccuracyReport={(auth) => {
                handleReportInaccuracy({ type: 'authority', id: auth.id, name: auth.nameAr });
              }}
            />
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 4: INTERNATIONAL VISAS */}
        {/* ========================================================= */}
        {currentTab === 'visas' && <VisasView />}

        {/* ========================================================= */}
        {/* VIEW 5: INTER-GOVERNORATE TRANSPORT */}
        {/* ========================================================= */}
        {currentTab === 'transport' && <TransportFaresView />}

      </main>

      {/* Footer */}
      <Footer
        onOpenFeedback={() => {
          setFeedbackTarget({ type: 'general', id: 'footer', name: 'ملاحظة عامة' });
          setFeedbackOpen(true);
        }}
        onOpenConsole={() => setConsoleOpen(true)}
        onOpenAdmin={() => setAdminOpen(true)}
      />

      {/* Global Modals */}
      {activeTransaction && (
        <TransactionDetailModal
          transaction={activeTransaction}
          onClose={() => setActiveTransaction(null)}
          onOpenMap={handleOpenMapWithAuthority}
          onShare={handleShareTransaction}
          onRequestInaccuracyReport={(tx) => {
            handleReportInaccuracy({ type: 'transaction', id: tx.id, name: tx.titleAr });
          }}
        />
      )}

      {assistantOpen && (
        <SmartAssistantModal
          onClose={() => setAssistantOpen(false)}
          onOpenTransaction={(tx) => setActiveTransaction(tx)}
          onOpenMap={handleOpenMapWithAuthority}
        />
      )}

      {consoleOpen && (
        <ConsoleDiagnosticsModal onClose={() => setConsoleOpen(false)} />
      )}

      {adminOpen && (
        <AdminPortal onClose={() => setAdminOpen(false)} />
      )}

      {feedbackOpen && (
        <FeedbackModal
          initialTarget={feedbackTarget || undefined}
          onClose={() => {
            setFeedbackOpen(false);
            setFeedbackTarget(null);
          }}
        />
      )}

      {/* Offline Status Bar */}
      <OfflineIndicator />

      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 py-2.5 px-4 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-2xl animate-fade-in flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
