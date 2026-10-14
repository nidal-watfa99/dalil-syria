import React from 'react';
import {
  Compass,
  MapPin,
  FileText,
  Globe,
  Bus,
  Bot,
  Terminal,
  Shield,
  Moon,
  Sun,
  Share2,
  Menu,
  X,
  Download
} from 'lucide-react';
import { PWAInstallButton } from '../common/PWAInstallButton';

interface NavbarProps {
  currentTab: 'home' | 'transactions' | 'map' | 'visas' | 'transport';
  onNavigate: (tab: 'home' | 'transactions' | 'map' | 'visas' | 'transport') => void;
  onOpenAssistant: () => void;
  onOpenConsole: () => void;
  onOpenAdmin: () => void;
  onOpenFeedback: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onShareApp: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  onOpenAssistant,
  onOpenConsole,
  onOpenAdmin,
  onOpenFeedback,
  isDarkMode,
  onToggleDarkMode,
  onShareApp,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems: Array<{ id: typeof currentTab; labelAr: string; icon: React.ElementType }> = [
    { id: 'home', labelAr: 'الرئيسية', icon: Compass },
    { id: 'transactions', labelAr: 'دليل المعاملات', icon: FileText },
    { id: 'map', labelAr: 'الخريطة الجغرافية', icon: MapPin },
    { id: 'visas', labelAr: 'التأشيرات الدولية', icon: Globe },
    { id: 'transport', labelAr: 'أجور النقل البري', icon: Bus },
  ];

  const handleNavClick = (tab: typeof currentTab) => {
    onNavigate(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text element wordmark + Syrian Crest */}
        <div
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 cursor-pointer whitespace-nowrap shrink-0 group select-none"
        >
          <div className="w-9 h-9 rounded-xl bg-slate-900 border border-amber-500/40 p-1 flex items-center justify-center shadow-md group-hover:border-amber-400 transition-colors">
            <img
              src="/icon.svg"
              alt="شعار دليل سوريا"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-extrabold tracking-tight text-white group-hover:text-amber-300 transition-colors leading-tight">
              دليل سوريا
            </span>
            <span className="text-[10px] font-mono tracking-widest text-amber-400/90 font-semibold leading-none">
              DALIL SYRIA
            </span>
          </div>
        </div>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-300">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 py-1 ${
                  isActive
                    ? 'text-amber-400 border-b-2 border-amber-400'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <span>{item.labelAr}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action & utility controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* PWA Install Button */}
          <PWAInstallButton className="hidden sm:flex" />

          {/* Smart Assistant Trigger Button */}
          <button
            onClick={onOpenAssistant}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-sm whitespace-nowrap"
            title="فتح المساعد الذكي للمعاملات"
          >
            <Bot className="w-4 h-4" />
            <span className="hidden md:inline">المساعد الذكي</span>
          </button>

          {/* Share Button */}
          <button
            onClick={onShareApp}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="مشاركة التطبيق"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={isDarkMode ? 'تفعيل الوضع النهاري' : 'تفعيل الوضع الليلي'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Console / Diagnostics Button */}
          <button
            onClick={onOpenConsole}
            className="p-2 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
            title="سجل التشخيص وفحص الأخطاء (Console)"
          >
            <Terminal className="w-4 h-4" />
          </button>

          {/* Admin CMS Button */}
          <button
            onClick={onOpenAdmin}
            className="p-2 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
            title="لوحة الإدارة والتحقق (CMS)"
          >
            <Shield className="w-4 h-4" />
          </button>

          {/* Download Full Source Code ZIP */}
          <a
            href="/dalil-syria-complete-source.zip"
            download="dalil-syria-complete-source.zip"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 transition-colors shadow-sm"
            title="تحميل الحزمة المصدرية الشاملة الكاملة للتطبيق (ZIP)"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">تحميل الكود ZIP</span>
          </a>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 lg:hidden rounded-lg text-slate-300 hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-xl p-4 space-y-2 animate-fade-in text-xs font-semibold">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-right transition-colors ${
                  isActive
                    ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                    : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                <Icon className="w-4 h-4 text-amber-400" />
                <span>{item.labelAr}</span>
              </button>
            );
          })}

          <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
            <PWAInstallButton />
            <a
              href="/dalil-syria-complete-source.zip"
              download="dalil-syria-complete-source.zip"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 text-amber-300 border border-amber-500/30"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تحميل الكود المصدري ZIP</span>
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenFeedback();
              }}
              className="text-xs text-amber-400 p-2 hover:underline"
            >
              الإبلاغ عن معلومة خاطئة
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
