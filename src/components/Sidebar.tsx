import React from 'react';
import {
  KeyRound,
  Home,
  FileText,
  Building2,
  Building,
  Search,
  Bot,
  Map,
  Bus,
  Train,
  Plane,
  Globe2,
  DollarSign,
  Bookmark,
  Bell,
  Mail,
  Share2,
  Settings,
  Activity,
  ChevronLeft,
  Sparkles,
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

export type TabId =
  | 'home'
  | 'transactions'
  | 'ministries'
  | 'governorates'
  | 'search'
  | 'assistant'
  | 'ai-models'
  | 'ai-settings'
  | 'map'
  | 'transport'
  | 'railways-sea'
  | 'travel'
  | 'asylum'
  | 'prices'
  | 'favorites'
  | 'notifications'
  | 'contact'
  | 'settings'
  | 'diagnostics';

interface SidebarProps {
  currentTab: TabId;
  onSelectTab: (tab: TabId) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
  onShareApp: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpen,
  onCloseMobile,
  onShareApp,
}) => {
  const navSections = [
    {
      groupTitle: 'الخدمات الحكومية الأساسية',
      items: [
        { id: 'home' as TabId, label: 'الرئيسية', icon: Home, badge: '' },
        {
          id: 'transactions' as TabId,
          label: 'معاملاتي الشامل',
          icon: FileText,
          badge: 'الأولوية القصوى',
          badgeColor: 'bg-[#1a73e8]/20 text-[#a8c7fa] border border-[#1a73e8]/30',
        },
        {
          id: 'ministries' as TabId,
          label: 'جميع الوزارات والجهات',
          icon: Building2,
          badge: '14 وزارة',
          badgeColor: 'bg-[#282a2c] text-[#c4c7c5]',
        },
        {
          id: 'governorates' as TabId,
          label: 'المحافظات والتقسيم الإداري',
          icon: Building,
          badge: '14 محافظة',
          badgeColor: 'bg-[#282a2c] text-[#c4c7c5]',
        },
        {
          id: 'search' as TabId,
          label: 'البحث المتقدم والصوتي',
          icon: Search,
          badge: 'ميكروفون',
          badgeColor: 'bg-amber-500/20 text-amber-300',
        },
        {
          id: 'assistant' as TabId,
          label: 'المساعد الذكي للخدمات',
          icon: Bot,
          badge: 'حسب الإعداد',
          badgeColor: 'bg-purple-500/20 text-purple-300',
        },
        {
          id: 'ai-models' as TabId,
          label: 'نماذج الذكاء المجانية الرسمية',
          icon: Sparkles,
          badge: 'روابط رسمية',
          badgeColor: 'bg-emerald-500/20 text-emerald-400',
        },
        {
          id: 'ai-settings' as TabId,
          label: 'إعدادات الذكاء الاصطناعي',
          icon: KeyRound,
          badge: 'المفاتيح',
          badgeColor: 'bg-amber-500/20 text-amber-300',
        },
        {
          id: 'map' as TabId,
          label: 'الخريطة التفاعلية الشاملة',
          icon: Map,
          badge: 'مواقع حية',
          badgeColor: 'bg-blue-500/20 text-blue-300',
        },
      ],
    },
    {
      groupTitle: 'الأسعار والنقل والسفر',
      items: [
        {
          id: 'prices' as TabId,
          label: 'الأسعار والرسوم (2026)',
          icon: DollarSign,
          badge: 'رسمي وتقديري',
          badgeColor: 'bg-amber-500/20 text-amber-300',
        },
        { id: 'transport' as TabId, label: 'النقل والمسارات والبولمان', icon: Bus, badge: '', badgeColor: '' },
        {
          id: 'railways-sea' as TabId,
          label: 'السكك الحديدية والموانئ البحرية',
          icon: Train,
          badge: 'واقعي 2026',
          badgeColor: 'bg-blue-500/20 text-blue-300',
        },
        { id: 'travel' as TabId, label: 'التأشيرات والسفر والطيران', icon: Plane, badge: '', badgeColor: '' },
        {
          id: 'asylum' as TabId,
          label: 'اللجوء والهجرة ومكافحة الاحتيال',
          icon: Globe2,
          badge: 'توجيه رسمي',
          badgeColor: 'bg-rose-500/20 text-rose-300',
        },
      ],
    },
    {
      groupTitle: 'الأدوات والمساعدة',
      items: [
        { id: 'favorites' as TabId, label: 'المفضلة وقوائم التحقق', icon: Bookmark, badge: '', badgeColor: '' },
        { id: 'notifications' as TabId, label: 'مركز التنبيهات والتحديثات', icon: Bell, badge: '', badgeColor: '' },
        { id: 'contact' as TabId, label: 'التواصل مع المطور', icon: Mail, badge: 'الدعم الفني', badgeColor: 'bg-[#282a2c] text-[#8e918f]' },
        { id: 'settings' as TabId, label: 'الإعدادات والخصوصية', icon: Settings, badge: '', badgeColor: '' },
        { id: 'diagnostics' as TabId, label: 'التشخيص وحالة النظام', icon: Activity, badge: '', badgeColor: '' },
      ],
    },
  ];

  const handleItemClick = (id: TabId) => {
    onSelectTab(id);
    if (window.innerWidth < 1024) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar container with Google AI Studio styling */}
      <aside
        className={`fixed top-0 bottom-0 right-0 z-40 w-72 bg-[#1e1f20] border-l border-[#333537] flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Brand Header */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-[#333537] bg-[#1e1f20]">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-[#282a2c] border border-[#3c4043] p-1 flex items-center justify-center shadow-sm">
              <img src={`${import.meta.env.BASE_URL}icon.svg`} alt="DALIL SYRIA" className="h-full w-full object-contain" />
            </div>
            <div>
              <span className="font-extrabold text-white text-sm tracking-wide">
                DALIL SYRIA
              </span>
              <span className="block text-[10px] text-[#a8c7fa] font-semibold">
                دليل سوريا — إصدار 2026
              </span>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-[#8e918f] hover:text-white hover:bg-[#282a2c]"
          >
            <ChevronLeft className="w-5 h-5 rotate-180" />
          </button>
        </div>

        {/* Scrollable Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navSections.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <h4 className="px-3 text-[11px] font-bold uppercase tracking-wider text-[#8e918f] mb-2">
                {group.groupTitle}
              </h4>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                      isActive
                        ? 'bg-[#282a2c] text-white border-r-4 border-[#1a73e8] shadow-sm'
                        : 'text-[#c4c7c5] hover:bg-[#282a2c]/60 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          isActive ? 'text-[#a8c7fa]' : 'text-[#8e918f] group-hover:text-white'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${item.badgeColor}`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}

          {/* Quick Actions in Sidebar */}
          <div className="pt-2 border-t border-[#333537] space-y-1">
            <button
              onClick={onShareApp}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-[#c4c7c5] hover:bg-[#282a2c] hover:text-white transition"
            >
              <div className="flex items-center gap-3">
                <Share2 className="w-4 h-4 text-[#8e918f]" />
                <span>مشاركة التطبيق</span>
              </div>
              <span className="text-[10px] text-[#a8c7fa]">رابط مباشر</span>
            </button>

          </div>
        </div>

        {/* Sidebar Footer with Install Prompt & Offline Badge */}
        <div className="p-3 border-t border-[#333537] bg-[#1e1f20] space-y-2">
          <PWAInstallButton className="w-full justify-center" />
          <div className="text-center text-[10px] text-[#8e918f] font-medium">
            دليل سوريا 2026 · متوافق مع نمط Google AI Studio
          </div>
        </div>
      </aside>
    </>
  );
};
