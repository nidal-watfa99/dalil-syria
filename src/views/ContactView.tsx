import React, { useState } from 'react';
import { DEVELOPER_EMAIL, buildDeveloperMailto } from '../config';
import { Mail, Send, AlertTriangle, MessageSquare, CheckCircle2, ShieldCheck, Bug, Sparkles } from 'lucide-react';

export const ContactView: React.FC = () => {
  const [feedbackType, setFeedbackType] = useState<'bug' | 'suggestion' | 'content_correction' | 'feature_request'>('suggestion');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    ticketId?: string;
    message: string;
  } | null>(null);

  // Real mailto: link built from the current form values (also works with an empty form).
  const mailtoHref = buildDeveloperMailto(
    `[دليل سوريا 2026] ${subject || 'رسالة جديدة من المستخدم'}`,
    `نوع الملاحظة: ${feedbackType}\nالاسم: ${userName || 'مستخدم دليل سوريا'}\nالبريد: ${userEmail || 'غير محدد'}\n\nنص الرسالة:\n${message}\n\n---\nتم الإرسال عبر تطبيق DALIL SYRIA 2026`
  );

  const handleInAppSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: feedbackType,
          name: userName,
          email: userEmail,
          subject,
          message,
          technicalLogs: {
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
          },
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitResult({
          success: true,
          ticketId: data.ticketId,
          message: data.message || 'تم إرسال بلاغك بنجاح للمطور.',
        });
        setMessage('');
        setSubject('');
      } else {
        throw new Error(data.error || 'فشل إرسال البلاغ');
      }
    } catch (err: any) {
      setSubmitResult({
        success: false,
        message: 'تعذر الإرسال عبر الخادم حالياً. يرجى الضغط على زر «فتح تطبيق البريد المباشر» لإرسال الرسالة عبر تطبيق البريد.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn text-right max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-l from-[#0f172a] via-[#10182c] to-[#0a0f1d] border border-cyan-500/20 shadow-xl">
        <span className="inline-block px-3 py-0.5 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 mb-2">
          قنوات التواصل الرسمية وبلاغات التطوير
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          تواصل مع المطور وإرسال البلاغات
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
          نرحب بملاحظاتكم، اقتراحاتكم، بلاغات الأخطاء التقنية، وتصويبات أي رسوم أو معاملات لتحديث المنظومة فوراً.
        </p>
      </div>

      {/* Official Developer Contact */}
      <section
        aria-labelledby="developer-contact-title"
        className="rounded-3xl bg-gradient-to-br from-[#0c1424] to-[#121c33] border border-cyan-500/30 p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3.5">
          <div className="p-3.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h2 id="developer-contact-title" className="text-sm font-extrabold text-white mb-0.5">
              التواصل مع المطور — الدعم الفني للمطور
            </h2>
            <a
              href={`mailto:${DEVELOPER_EMAIL}`}
              className="text-base sm:text-lg font-black text-cyan-300 hover:text-cyan-200 underline underline-offset-4 font-mono"
              dir="ltr"
            >
              {DEVELOPER_EMAIL}
            </a>
            <p className="text-[11px] text-slate-400 mt-0.5">
              اضغط على البريد لفتح رسالة جديدة في تطبيق البريد لديك
            </p>
          </div>
        </div>

        <a
          href={mailtoHref}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 text-xs sm:text-sm font-bold text-white shadow-lg shadow-cyan-950/40 hover:from-cyan-500 hover:to-blue-500 transition active:scale-95 shrink-0"
        >
          <Mail className="w-4 h-4" />
          <span>فتح تطبيق البريد المباشر</span>
        </a>
      </section>

      {/* In-App Feedback & Bug Report Form */}
      <div className="rounded-3xl bg-[#0e1424] border border-white/[0.08] p-6 shadow-xl space-y-5">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-cyan-400" />
          نموذج إرسال البلاغ والملاحظات عبر خادم التطبيق
        </h3>

        <form onSubmit={handleInAppSubmit} className="space-y-4">
          {/* Feedback Type Tabs */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">نوع البلاغ أو الملاحظة:</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'suggestion', label: 'اقتراح تطوير', icon: Sparkles },
                { id: 'bug', label: 'إبلاغ عن خطأ تقني', icon: Bug },
                { id: 'content_correction', label: 'تصويب رسم أو معلومة', icon: AlertTriangle },
                { id: 'feature_request', label: 'طلب ميزة جديدة', icon: MessageSquare },
              ].map((t) => {
                const Icon = t.icon;
                const isSelected = feedbackType === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setFeedbackType(t.id as any)}
                    className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl text-xs font-bold transition border ${
                      isSelected
                        ? 'bg-cyan-600 text-white border-cyan-400 shadow-md'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">الاسم (اختياري):</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="اسمك أو صفتك..."
                className="w-full rounded-xl bg-slate-900 border border-slate-700/80 px-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">بريدك الإلكتروني (للتواصل معك):</label>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="example@domain.com"
                className="w-full rounded-xl bg-slate-900 border border-slate-700/80 px-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                dir="ltr"
              />
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">عنوان الموضوع:</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="مثال: ملاحظة على رسوم معاملة تثبيت الزواج أو استفسار عن مواقف النقل..."
              className="w-full rounded-xl bg-slate-900 border border-slate-700/80 px-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Message content */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">تفاصيل الرسالة أو البلاغ:</label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="يرجى كتابة التفاصيل بدقة لتمكين فريق التطوير من التحقق والمتابعة..."
              className="w-full rounded-xl bg-slate-900 border border-slate-700/80 px-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
              required
            />
          </div>

          {/* Submit Result Message */}
          {submitResult && (
            <div
              className={`p-4 rounded-2xl border text-xs leading-relaxed flex items-start gap-3 ${
                submitResult.success
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
              }`}
            >
              {submitResult.success ? (
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
              )}
              <div className="flex-1">
                <p className="font-bold">{submitResult.message}</p>
                {submitResult.ticketId && (
                  <p className="text-[11px] text-slate-400 mt-1">
                    رقم التتبع المسجل: <span className="font-mono text-cyan-300 font-bold">{submitResult.ticketId}</span>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Form Submit Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !message.trim()}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-cyan-950/40 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition active:scale-95"
            >
              <Send className="w-4 h-4 rotate-180" />
              <span>{isSubmitting ? 'جاري الإرسال...' : 'إرسال البلاغ الآن'}</span>
            </button>

            <a
              href={mailtoHref}
              className="flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition"
            >
              <Mail className="w-4 h-4 text-cyan-400" />
              <span>إرسال عبر برنامج البريد</span>
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};
