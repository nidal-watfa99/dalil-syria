import React from 'react';
import {
  Menu,
  X,
  Mic,
  Search,
  Bell,
  Volume2,
  Square,
  Sparkles,
  Wifi,
  WifiOff,
  KeyRound,
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  onOpenVoiceModal: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit: () => void;
  unreadNotificationsCount: number;
  onNavigateToNotifications: () => void;
  isPlayingAudio: boolean;
  onStopAudio: () => void;
  isOnline: boolean;
  onOpenAISettings?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  isSidebarOpen,
  onOpenVoiceModal,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  unreadNotificationsCount,
  onNavigateToNotifications,
  isPlayingAudio,
  onStopAudio,
  isOnline,
  onOpenAISettings,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearchSubmit();
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#18191a]/95 backdrop-blur-md border-b border-[#333538] shadow-md">
      <div className="flex h-16 items-center justify-between px-3 sm:px-6 gap-2 sm:gap-4">
        {/* Right side (RTL Start): Menu toggle + Brand */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-[#c4c7c5] hover:text-white hover:bg-[#282a2c] transition-colors"
            title={isSidebarOpen ? 'طي القائمة' : 'فتح القائمة'}
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5 cursor-pointer">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#282a2c] border border-[#333538] shadow-sm p-1">
              <img src={`${import.meta.env.BASE_URL}icon.svg`} alt="DALIL SYRIA" className="h-full w-full object-contain" />
              <div className="absolute -bottom-0.5 -left-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-[#18191a]" />
            </div>
            <div className="hidden xs:block text-right">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold tracking-tight text-white">
                  دليل سوريا
                </span>
                <span className="rounded-md bg-[#1a73e8]/20 px-1.5 py-0.2 text-[10px] font-bold text-[#8ab4f8] border border-[#1a73e8]/30">
                  2026
                </span>
              </div>
              <p className="text-[10px] font-semibold tracking-wider text-[#c4c7c5]">
                DALIL SYRIA · المنظومة الحكومية
              </p>
            </div>
          </div>
        </div>

        {/* Center: Search input with Voice Search Microphone Button */}
        <div className="flex-1 max-w-xl mx-2 sm:mx-4">
          <div className="relative flex items-center w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="ابحث عن معاملة (مثال: حصر إرث، جواز سفر، غير محكوم)..."
              className="w-full rounded-2xl bg-[#131314] border border-[#333538] pl-20 pr-10 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] transition-all shadow-inner"
            />
            <Search className="absolute right-3.5 w-4 h-4 text-[#c4c7c5] pointer-events-none" />

            {/* Microphone button inside search bar */}
            <button
              onClick={onOpenVoiceModal}
              className="absolute left-2.5 flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#282a2c] border border-[#333538] text-[#8ab4f8] hover:bg-[#1a73e8] hover:text-white transition-all active:scale-95 group shadow-sm"
              title="البحث الصوتي باللغة العربية"
            >
              <Mic className="w-3.5 h-3.5 text-[#8ab4f8] group-hover:text-white animate-pulse" />
              <span className="hidden sm:inline text-[11px] font-semibold">صوت</span>
            </button>
          </div>
        </div>

        {/* Left side (RTL End): Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* AI Settings */}
          {onOpenAISettings && (
            <button
              onClick={onOpenAISettings}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#282a2c] border border-[#333538] text-[#8ab4f8] hover:bg-[#1a73e8] hover:text-white active:scale-95 text-xs font-bold transition shadow-sm"
              title="إعدادات الذكاء الاصطناعي ومفاتيح API"
              aria-label="إعدادات الذكاء الاصطناعي"
            >
              <KeyRound className="w-4 h-4" />
              <span className="hidden sm:inline">الذكاء الاصطناعي</span>
            </button>
          )}

          {/* PWA Install Button */}
          <div className="hidden sm:block">
            <PWAInstallButton compact />
          </div>


          {/* Audio Playing Indicator / Stop Button */}
          {isPlayingAudio && (
            <button
              onClick={onStopAudio}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold hover:bg-rose-500/30 transition animate-pulse"
              title="إيقاف القراءة الصوتية"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <Square className="w-2.5 h-2.5" />
            </button>
          )}

          {/* Online/Offline status icon */}
          <div
            className={`p-2 rounded-xl border text-xs ${
              isOnline
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
            }`}
            title={isOnline ? 'متصل بالإنترنت وقواعد البيانات الحية' : 'العمل دون اتصال (وضع الذاكرة المؤقتة)'}
          >
            {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
          </div>

          {/* Notifications Bell */}
          <button
            onClick={onNavigateToNotifications}
            className="relative p-2 rounded-xl text-[#c4c7c5] hover:text-white hover:bg-[#282a2c] transition"
            title="مركز التنبيهات الحكومية"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#1a73e8] text-[10px] font-bold text-white shadow-sm ring-2 ring-[#18191a]">
                {unreadNotificationsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
