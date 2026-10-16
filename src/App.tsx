import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar, TabId } from './components/Sidebar';
import { VoiceSearchModal } from './components/VoiceSearchModal';
import { AudioBar } from './components/AudioBar';
import { TransactionModal } from './components/TransactionModal';
import { HomeView } from './views/HomeView';
import { TransactionsView } from './views/TransactionsView';
import { MinistriesView } from './views/MinistriesView';
import { GovernoratesView } from './views/GovernoratesView';
import { AssistantView } from './views/AssistantView';
import { PricesView } from './views/PricesView';
import { TransportView } from './views/TransportView';
import { MapView } from './views/MapView';
import { TravelView } from './views/TravelView';
import { FavoritesView } from './views/FavoritesView';
import { NotificationsView } from './views/NotificationsView';
import { ContactView } from './views/ContactView';
import { DiagnosticsView } from './views/DiagnosticsView';
import { SettingsView } from './views/SettingsView';
import { FreeAIModelsView } from './views/FreeAIModelsView';
import { AISettingsView } from './views/AISettingsView';
import { useTextToSpeech } from './hooks/useTextToSpeech';
import { TRANSACTIONS_DATA } from './data/transactions';
import { Transaction } from './types';
import { Check, Copy, Share2, WifiOff } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabId>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  // Favorites stored in LocalStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('dalil_syria_favs_2026');
      return saved ? JSON.parse(saved) : ['tx-passport-electronic', 'tx-non-conviction'];
    } catch {
      return ['tx-passport-electronic', 'tx-non-conviction'];
    }
  });

  // Settings
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>(() => {
    try {
      return (localStorage.getItem('dalil_font_size') as any) || 'normal';
    } catch {
      return 'normal';
    }
  });

  const [highContrast, setHighContrast] = useState<boolean>(() => {
    try {
      return localStorage.getItem('dalil_high_contrast') === 'true';
    } catch {
      return false;
    }
  });

  const [reduceMotion, setReduceMotion] = useState<boolean>(() => {
    try {
      return localStorage.getItem('dalil_reduce_motion') === 'true';
    } catch {
      return false;
    }
  });

  // Network Online status
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  // Share Toast state
  const [shareToast, setShareToast] = useState<string | null>(null);

  // Text to speech hook
  const {
    isPlaying: isPlayingAudio,
    isPaused: isPausedAudio,
    currentText: audioCurrentText,
    speechRate,
    setSpeechRate,
    speak,
    pause: pauseAudio,
    resume: resumeAudio,
    stop: stopAudio,
  } = useTextToSpeech();

  // Network listener
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Save favorites
  useEffect(() => {
    try {
      localStorage.setItem('dalil_syria_favs_2026', JSON.stringify(favorites));
    } catch (e) {
      // ignore
    }
  }, [favorites]);

  // Save settings
  useEffect(() => {
    try {
      localStorage.setItem('dalil_font_size', fontSize);
      localStorage.setItem('dalil_high_contrast', String(highContrast));
      localStorage.setItem('dalil_reduce_motion', String(reduceMotion));
    } catch (e) {
      // ignore
    }
  }, [fontSize, highContrast, reduceMotion]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleShareApp = async (customText?: string) => {
    const shareTitle = 'DALIL SYRIA | دليل سوريا — إصدار 2026';
    const shareUrl = window.location.href;
    const shareText =
      customText ||
      'دليل المعاملات الحكومية السورية والخدمات والأسعار والمحافظات والنقل والذكاء الاصطناعي — إصدار 2026';

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch (err) {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(`${shareTitle}\n${shareText}\n${shareUrl}`);
      setShareToast('تم نسخ رابط دليل سوريا بنجاح للحافظة!');
      setTimeout(() => setShareToast(null), 3500);
    } catch (e) {
      setShareToast('رابط التطبيق: ' + shareUrl);
      setTimeout(() => setShareToast(null), 3500);
    }
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      setCurrentTab('transactions');
    }
  };

  const handleVoiceSearchResult = (transcript: string) => {
    setSearchQuery(transcript);
    setCurrentTab('transactions');
  };

  const openTransactionById = (id: string) => {
    const found = TRANSACTIONS_DATA.find((t) => t.id === id);
    if (found) {
      setSelectedTransaction(found);
    }
  };

  const openTransactionByName = (name: string) => {
    const found = TRANSACTIONS_DATA.find((t) => t.name.includes(name) || name.includes(t.name));
    if (found) {
      setSelectedTransaction(found);
    } else {
      setSearchQuery(name);
      setCurrentTab('transactions');
    }
  };

  const handleClearAllStorage = () => {
    localStorage.clear();
    setFavorites([]);
    setFontSize('normal');
    setHighContrast(false);
    setReduceMotion(false);
    setShareToast('تم مسح الذاكرة المحلية بنجاح');
    setTimeout(() => setShareToast(null), 3000);
  };

  // Font size class mapping
  const fontSizeClass =
    fontSize === 'xlarge'
      ? 'text-[1.15rem]'
      : fontSize === 'large'
      ? 'text-[1.05rem]'
      : 'text-[1rem]';

  return (
    <div
      dir="rtl"
      className={`min-h-screen bg-[#131314] text-[#e3e3e3] flex flex-col selection:bg-[#1a73e8]/30 selection:text-[#a8c7fa] ${fontSizeClass} ${
        highContrast ? 'contrast-125' : ''
      } ${reduceMotion ? '[&_*]:transition-none [&_*]:animate-none' : ''}`}
    >
      {/* Top Navbar */}
      <Navbar
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        isSidebarOpen={isSidebarOpen}
        onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
        unreadNotificationsCount={2}
        onNavigateToNotifications={() => setCurrentTab('notifications')}
        onOpenAISettings={() => setCurrentTab('ai-settings')}
        isPlayingAudio={isPlayingAudio}
        onStopAudio={stopAudio}
        isOnline={isOnline}
      />

      {/* Main Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => {
            setCurrentTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          isOpen={isSidebarOpen}
          onCloseMobile={() => setIsSidebarOpen(false)}
          onShareApp={() => handleShareApp()}
          />

        {/* View Content Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          {currentTab === 'home' && (
            <HomeView
              onNavigate={(tab) => {
                setCurrentTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenTransaction={openTransactionById}
              onSpeak={speak}
            />
          )}

          {currentTab === 'transactions' && (
            <TransactionsView
              onSelectTransaction={(tx) => setSelectedTransaction(tx)}
              onSpeak={speak}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onShare={(tx) =>
                handleShareApp(`معاملة ${tx.name} — الرسوم: ${tx.fee.formattedFee}. الجهة: ${tx.ministryName}`)
              }
              initialSearch={searchQuery}
            />
          )}

          {currentTab === 'ministries' && (
            <MinistriesView onOpenTransactionByName={openTransactionByName} />
          )}

          {currentTab === 'governorates' && <GovernoratesView />}

          {currentTab === 'search' && (
            <TransactionsView
              onSelectTransaction={(tx) => setSelectedTransaction(tx)}
              onSpeak={speak}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onShare={(tx) => handleShareApp(`معاملة ${tx.name}`)}
              initialSearch={searchQuery}
            />
          )}

          {currentTab === 'assistant' && (
            <AssistantView
              onSpeak={speak}
              onOpenTransactionByName={openTransactionByName}
              onNavigateToFreeAI={() => setCurrentTab('ai-models')}
            />
          )}

          {currentTab === 'ai-models' && <FreeAIModelsView />}

          {currentTab === 'ai-settings' && <AISettingsView />}

          {currentTab === 'prices' && <PricesView />}

          {currentTab === 'transport' && <TransportView />}

          {currentTab === 'railways-sea' && <TransportView />}

          {currentTab === 'map' && <MapView />}

          {currentTab === 'travel' && <TravelView defaultSubSection="visas" />}

          {currentTab === 'asylum' && <TravelView defaultSubSection="asylum" />}

          {currentTab === 'favorites' && (
            <FavoritesView
              favoriteIds={favorites}
              onOpenTransaction={openTransactionById}
              onRemoveFavorite={toggleFavorite}
            />
          )}

          {currentTab === 'notifications' && (
            <NotificationsView onOpenTransaction={openTransactionById} />
          )}

          {currentTab === 'contact' && <ContactView />}

          {currentTab === 'diagnostics' && <DiagnosticsView />}

          {currentTab === 'settings' && (
            <SettingsView
              fontSize={fontSize}
              onFontSizeChange={setFontSize}
              highContrast={highContrast}
              onHighContrastChange={setHighContrast}
              reduceMotion={reduceMotion}
              onReduceMotionChange={setReduceMotion}
              speechRate={speechRate}
              onSpeechRateChange={setSpeechRate}
              onClearStorage={handleClearAllStorage}
                  />
          )}
        </main>
      </div>

      {/* Voice Search Modal */}
      <VoiceSearchModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onSearch={handleVoiceSearchResult}
      />

      {/* Full Transaction Details Modal */}
      <TransactionModal
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
        onSpeak={speak}
        isFavorite={selectedTransaction ? favorites.includes(selectedTransaction.id) : false}
        onToggleFavorite={toggleFavorite}
        onShare={(tx) =>
          handleShareApp(`معاملة ${tx.name} — الرسوم: ${tx.fee.formattedFee}. الجهة: ${tx.ministryName}`)
        }
      />

      {/* Text To Speech Audio Bar */}
      <AudioBar
        isPlaying={isPlayingAudio}
        isPaused={isPausedAudio}
        currentText={audioCurrentText}
        speechRate={speechRate}
        onPause={pauseAudio}
        onResume={resumeAudio}
        onStop={stopAudio}
        onRateChange={setSpeechRate}
      />

      {/* Offline Toast Banner if disconnected */}
      {!isOnline && (
        <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-600/90 backdrop-blur-md px-3.5 py-2 text-xs font-bold text-white shadow-xl animate-bounce">
          <WifiOff className="w-4 h-4" />
          <span>وضع دون اتصال — يتم استخدام البيانات وقواعد المعاملات المحفوظة</span>
        </div>
      )}

      {/* Share Toast */}
      {shareToast && (
        <div className="fixed bottom-16 right-6 z-50 rounded-2xl bg-[#1e1f20] border border-[#333537] p-4 text-xs font-bold text-emerald-300 shadow-2xl flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{shareToast}</span>
        </div>
      )}
    </div>
  );
}
