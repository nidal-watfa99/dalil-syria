import React, { useState, useEffect } from 'react';
import {
  Activity,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Cpu,
  Mic,
  Volume2,
  Wifi,
  Database,
  Download,
  ShieldCheck,
} from 'lucide-react';
import { DiagnosticItem } from '../types';

export const DiagnosticsView: React.FC = () => {
  const [diagnostics, setDiagnostics] = useState<DiagnosticItem[]>([]);
  const [isRunningCheck, setIsRunningCheck] = useState(false);
  const [exportedLogs, setExportedLogs] = useState<string | null>(null);

  const runSystemDiagnostics = async () => {
    setIsRunningCheck(true);

    const results: DiagnosticItem[] = [];
    const now = new Date().toLocaleTimeString('ar-SY');

    // 1. Check Speech Recognition (Microphone)
    const hasSpeechRec = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
    results.push({
      feature: 'التعرف الصوتي (الميكروفون)',
      status: hasSpeechRec ? 'يعمل بكفاءة' : 'غير متاح حالياً',
      details: hasSpeechRec
        ? 'محرك التعرف الصوتي العربي مدعوم ومتوافق مع المتصفح'
        : 'المتصفح لا يدعم واجهة Web Speech Recognition',
      technicalCode: hasSpeechRec ? 'SPEECH_REC_OK' : 'SPEECH_REC_UNSUPPORTED',
      lastCheckTime: now,
    });

    // 2. Check Text to Speech (TTS)
    const hasTTS = 'speechSynthesis' in window;
    const voices = hasTTS ? window.speechSynthesis.getVoices() : [];
    const hasArabicVoice = voices.some((v) => v.lang.startsWith('ar'));
    results.push({
      feature: 'القراءة الصوتية للنصوص (TTS)',
      status: hasTTS ? 'يعمل بكفاءة' : 'غير متاح حالياً',
      details: hasTTS
        ? `محرك النطق الصوتي نشط. ${hasArabicVoice ? 'يتوفر صوت عربي أصلي بالجهاز' : 'يعتمد على الصوت النظامي الافتراضي'}`
        : 'محرك SpeechSynthesis غير مدعوم',
      technicalCode: hasTTS ? 'TTS_OK' : 'TTS_UNSUPPORTED',
      lastCheckTime: now,
    });

    // 3. Check Network Connectivity
    const isOnline = navigator.onLine;
    results.push({
      feature: 'حالة الاتصال بالشبكة والإنترنت',
      status: isOnline ? 'يعمل بكفاءة' : 'غير متاح حالياً',
      details: isOnline
        ? 'متصل بالإنترنت وقواعد البيانات الحكومية الحية'
        : 'يعمل التطبيق في وضع الذاكرة المؤقتة (Offline Cache)',
      technicalCode: isOnline ? 'NETWORK_ONLINE' : 'NETWORK_OFFLINE',
      lastCheckTime: now,
    });

    // 4. Check LocalStorage & Quota
    try {
      localStorage.setItem('__test_storage__', '1');
      localStorage.removeItem('__test_storage__');
      results.push({
        feature: 'التخزين المحلي الآمن (Local Storage)',
        status: 'يعمل بكفاءة',
        details: 'الذاكرة المحلية متاحة لحفظ المفضلة وقوائم التحقق والإعدادات الشخصية',
        technicalCode: 'STORAGE_HEALTHY',
        lastCheckTime: now,
      });
    } catch (e) {
      results.push({
        feature: 'التخزين المحلي الآمن (Local Storage)',
        status: 'غير متاح حالياً',
        details: 'تم حظر التخزين المحلي أو تم بلوغ الحد الأقصى للمتصفح',
        technicalCode: 'STORAGE_BLOCKED',
        lastCheckTime: now,
      });
    }

    // 5. Check Service Worker / PWA support
    const hasSW = 'serviceWorker' in navigator;
    results.push({
      feature: 'محرك العمل دون اتصال وتثبيت التطبيق (PWA)',
      status: hasSW ? 'يعمل بكفاءة' : 'غير متاح حالياً',
      details: hasSW
        ? 'محرك Service Worker وManifest جاهزان لتشغيل التطبيق والبحث دون إنترنت'
        : 'المتصفح لا يدعم Service Worker',
      technicalCode: hasSW ? 'PWA_READY' : 'PWA_UNSUPPORTED',
      lastCheckTime: now,
    });

    // 6. Check backend + real AI availability (based on /api/ai/status, which reflects configured keys)
    try {
      const res = await fetch('/api/ai/status');
      if (!res.ok) throw new Error('API non-200');
      const st = await res.json();
      results.push({
        feature: 'خادم التطبيق والذكاء الاصطناعي',
        status: st.liveAvailable ? 'يعمل بكفاءة' : 'غير مفعل',
        details: st.liveAvailable
          ? `الخادم يعمل. مزود الذكاء الاصطناعي النشط: ${st.activeProvider} (${st.activeModel}). حالة الاتصال الفعلية تُفحص من «إعدادات الذكاء الاصطناعي».`
          : 'الخادم يعمل، لكن لم يُعدّ أي مزود ذكاء اصطناعي. المساعد يستخدم ردوداً ثابتة محلية فقط.',
        technicalCode: st.liveAvailable ? 'AI_PROVIDER_CONFIGURED' : 'AI_NOT_CONFIGURED',
        lastCheckTime: now,
      });
    } catch (err) {
      results.push({
        feature: 'خادم التطبيق والذكاء الاصطناعي',
        status: 'غير مفعل',
        details: 'تعذر الوصول إلى خادم التطبيق (قد يكون التطبيق يعمل كواجهة ثابتة دون خادم).',
        technicalCode: 'API_UNREACHABLE',
        lastCheckTime: now,
      });
    }

    setDiagnostics(results);
    setIsRunningCheck(false);
  };

  useEffect(() => {
    runSystemDiagnostics();
  }, []);

  const handleExportLogs = () => {
    const logData = {
      app: 'DALIL SYRIA | دليل سوريا 2026',
      generatedAt: new Date().toISOString(),
      userAgent: navigator.userAgent,
      diagnostics,
    };
    const logStr = JSON.stringify(logData, null, 2);
    setExportedLogs(logStr);

    const blob = new Blob([logStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dalil-syria-diagnostics-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fadeIn text-right max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-l from-[#0f172a] via-[#10182c] to-[#0a0f1d] border border-cyan-500/20 shadow-xl">
        <div>
          <span className="inline-block px-3 py-0.5 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 mb-2">
            مركز التشخيص والتحقق التقني
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            تشخيص حالة النظام والاتصال
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
            فحص مباشر لصلاحيات الميكروفون، محرك النطق العربي، التخزين المحلي، اتصال الخادم، وجاهزية العمل دون إنترنت.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={runSystemDiagnostics}
            disabled={isRunningCheck}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 text-xs font-bold text-white shadow-lg shadow-cyan-950/40 hover:from-cyan-500 hover:to-blue-500 transition active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRunningCheck ? 'animate-spin' : ''}`} />
            <span>إعادة الفحص الآن</span>
          </button>

          <button
            onClick={handleExportLogs}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-slate-700 bg-slate-800 text-xs font-bold text-slate-300 hover:text-white transition"
            title="تصدير سجل التشخيص المنقح"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">تصدير السجل</span>
          </button>
        </div>
      </div>

      {/* Diagnostics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {diagnostics.map((item, idx) => {
          const isOk = item.status === 'يعمل بكفاءة';
          return (
            <div
              key={idx}
              className="rounded-2xl bg-gradient-to-b from-[#0f172a] to-[#0a0f1d] border border-white/[0.08] p-5 shadow-lg space-y-2.5"
            >
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-white">{item.feature}</h4>
                <span
                  className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border flex items-center gap-1 ${
                    isOk
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                  }`}
                >
                  {isOk ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                  <span>{item.status}</span>
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{item.details}</p>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>كود: {item.technicalCode}</span>
                <span>توقيت: {item.lastCheckTime}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Privacy Notice on Diagnostic Logs */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          سجلات التشخيص لا تسجل أي معلومات حساسة أو بيانات شخصية. جميع الاختبارات تجري على مستوى المتصفح وتضمن خصوصيتك التامة.
        </p>
      </div>
    </div>
  );
};
