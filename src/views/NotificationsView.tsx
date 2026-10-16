import React, { useState } from 'react';
import { Bell, CheckCheck, Clock, FileText, DollarSign, Bus, Info } from 'lucide-react';
import { NotificationItem } from '../types';

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'تعديل رسوم جواز السفر الفوري والإلكتروني لعام 2026',
    summary: 'صدور التعليمات التنفيذية الناظمة للجواز البيومتري السوري العادي (312,000 ل.س) والفوري (4,000,000 ل.س) وتفعيل آلية التسديد الرقمي.',
    date: '15 تشرين الأول 2026',
    category: 'رسوم ومعاملات',
    isRead: false,
    relatedTransactionId: 'tx-passport-electronic',
  },
  {
    id: 'notif-2',
    title: 'اعتماد تعرفة عدادات سيارات الأجرة (التاكسي) لعام 2026',
    summary: 'تحديد فتحة عداد التكسي بـ 3,000 ليرة سورية، وسعر الكيلومتر المقطوع بـ 3,500 ل.س في دمشق وريفها.',
    date: '14 تشرين الأول 2026',
    category: 'نقل وطرق',
    isRead: false,
  },
  {
    id: 'notif-3',
    title: 'توسيع الربط الشبكي لمراكز خدمة المواطن التخصصية',
    summary: 'إتاحة استخراج وثيقة غير محكوم وبيانات السجل المدني إلكترونياً من أي مركز في المحافظات الـ 14 دون التقيد بمحافظة القيد.',
    date: '12 تشرين الأول 2026',
    category: 'مواعيد وخدمات',
    isRead: true,
    relatedTransactionId: 'tx-non-conviction',
  },
  {
    id: 'notif-4',
    title: 'جدول تشغيل قطارات الركاب الساحلية المنتظمة',
    summary: 'تسيير 3 رحلات يومية ذهاباً وإياباً بين اللاذقية وجبلة وبانياس وطرطوس بتسعيرة مدعومة 5,000 ل.س.',
    date: '10 تشرين الأول 2026',
    category: 'نقل وطرق',
    isRead: true,
  },
];

export const NotificationsView: React.FC<{ onOpenTransaction?: (id: string) => void }> = ({
  onOpenTransaction,
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const toggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    );
  };

  const filtered = notifications.filter(
    (n) => activeFilter === 'all' || n.category === activeFilter
  );

  return (
    <div className="space-y-6 animate-fadeIn text-right">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-l from-[#0f172a] via-[#10182c] to-[#0a0f1d] border border-cyan-500/20 shadow-xl">
        <div>
          <span className="inline-block px-3 py-0.5 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 mb-2">
            مركز التنبيهات وسجل التحديثات الحكومية
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            الإشعارات والتحديثات الإدارية والرسوم
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
            متابعة حية للتعديلات التشريعية، تغيرات الرسوم، مواعيد انطلاق الرحلات، والإعلانات الحكومية الرسمية.
          </p>
        </div>

        <button
          onClick={markAllAsRead}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-cyan-300 hover:bg-slate-700 transition shrink-0"
        >
          <CheckCheck className="w-4 h-4" />
          <span>تحديد الكل كمقروء</span>
        </button>
      </div>

      {/* Filter Category pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {['all', 'رسوم ومعاملات', 'نقل وطرق', 'مواعيد وخدمات', 'تحديثات التطبيق'].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
              activeFilter === cat
                ? 'bg-cyan-600 text-white shadow-md'
                : 'bg-[#0e1424] text-slate-400 hover:text-white border border-white/[0.08]'
            }`}
          >
            {cat === 'all' ? 'كافة التنبيهات' : cat}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleRead(item.id)}
            className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
              item.isRead
                ? 'bg-[#0b101c] border-white/[0.05] text-slate-400'
                : 'bg-gradient-to-r from-[#0e182e] to-[#0a101f] border-cyan-500/30 text-slate-200 shadow-md'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      item.isRead ? 'bg-slate-600' : 'bg-cyan-400 animate-pulse'
                    }`}
                  />
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-800 text-slate-300">
                    {item.category}
                  </span>
                  <span className="text-[10px] text-slate-500">{item.date}</span>
                </div>
                <h3 className={`text-sm font-bold ${item.isRead ? 'text-slate-300' : 'text-white'}`}>
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed pt-1">
                  {item.summary}
                </p>
              </div>

              {item.relatedTransactionId && onOpenTransaction && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenTransaction(item.relatedTransactionId!);
                  }}
                  className="px-3 py-1 rounded-xl bg-cyan-600/20 text-cyan-300 text-xs font-semibold hover:bg-cyan-600/30 shrink-0"
                >
                  فتح المعاملة
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
