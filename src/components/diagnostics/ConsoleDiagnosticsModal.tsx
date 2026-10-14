import React, { useState } from 'react';
import {
  Terminal,
  Copy,
  Download,
  Trash2,
  Mail,
  Check,
  AlertTriangle,
  Info,
  Bug,
  X,
  Server,
  Smartphone
} from 'lucide-react';
import {
  getDiagnosticLogs,
  clearDiagnosticLogs,
  getSystemDiagnosticsInfo
} from '../../utils/storageAndLogs';
import { DiagnosticLog } from '../../types';

interface ConsoleDiagnosticsModalProps {
  onClose: () => void;
}

export const ConsoleDiagnosticsModal: React.FC<ConsoleDiagnosticsModalProps> = ({ onClose }) => {
  const [logs, setLogs] = useState<DiagnosticLog[]>(getDiagnosticLogs());
  const [copied, setCopied] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const sysInfo = getSystemDiagnosticsInfo();

  const handleCopyLogs = () => {
    const reportText = JSON.stringify(
      {
        system: sysInfo,
        logs: logs,
      },
      null,
      2
    );
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportJSON = () => {
    const blob = new Blob(
      [
        JSON.stringify(
          {
            generatedAt: new Date().toISOString(),
            system: sysInfo,
            logs: logs,
          },
          null,
          2
        ),
      ],
      { type: 'application/json' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dalil_syria_diag_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    clearDiagnosticLogs();
    setLogs([]);
  };

  const filteredLogs = logs.filter((log) => {
    if (selectedLevel === 'all') return true;
    return log.level === selectedLevel;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 md:p-6 overflow-hidden">
      <div className="w-full max-w-4xl h-[88vh] glass-panel rounded-2xl border border-slate-700/80 shadow-2xl flex flex-col overflow-hidden text-slate-100 animate-fade-in font-mono text-xs">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <span>سجل التشخيص والأخطاء (Console)</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-amber-300">
                  v1.0.0-PROD
                </span>
              </h3>
              <p className="text-[11px] text-slate-400 font-sans">
                مراقبة أداء النظام وعمليات الشبكة ومحرك الخرائط دون تسريب بيانات حساسة
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLogs}
              className="flex items-center gap-1 py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              title="نسخ كامل السجل للحافظة"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'تم النسخ' : 'نسخ'}</span>
            </button>
            <button
              onClick={handleExportJSON}
              className="flex items-center gap-1 py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              title="تصدير ملف تشخيص"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تصدير</span>
            </button>
            <button
              onClick={handleClear}
              className="p-2 rounded-lg text-red-400 hover:bg-red-950/40 border border-red-900/40 transition-colors"
              title="مسح السجلات"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* System telemetry bar */}
        <div className="px-4 py-2 bg-slate-950 border-b border-slate-800/80 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-400">
          <span>الحالة: <strong className="text-emerald-400">{sysInfo.onlineStatus}</strong></span>
          <span>النمط: <strong className="text-amber-300">{sysInfo.displayMode}</strong></span>
          <span>الأبعاد: <span className="text-slate-300">{sysInfo.viewportSize}</span></span>
          <span>الموقع الجغرافي: <span className="text-slate-300">{sysInfo.geolocationSupported ? 'مدعوم' : 'غير متوفر'}</span></span>
        </div>

        {/* Filter controls */}
        <div className="px-4 py-2 bg-slate-900/60 border-b border-slate-800 flex items-center gap-2">
          <span className="text-[11px] text-slate-400 font-sans">تصفية:</span>
          {(['all', 'info', 'warn', 'error'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`py-1 px-2.5 rounded text-[11px] transition-colors ${
                selectedLevel === lvl
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {lvl.toUpperCase()}
            </button>
          ))}
          <span className="mr-auto text-slate-500 text-[11px]">
            السجلات: {filteredLogs.length}
          </span>
        </div>

        {/* Logs Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-[#06090E] text-[11px] leading-relaxed">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-16 text-slate-600 font-sans">
              لا توجد رسائل مسجلة مطابقة للمرشح.
            </div>
          ) : (
            filteredLogs.map((log) => {
              const color =
                log.level === 'error'
                  ? 'text-red-400 bg-red-950/20 border-red-900/40'
                  : log.level === 'warn'
                  ? 'text-amber-400 bg-amber-950/20 border-amber-900/40'
                  : 'text-slate-300 bg-slate-950/50 border-slate-800/60';

              return (
                <div key={log.id} className={`p-2.5 rounded border ${color} font-mono`}>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="uppercase font-bold">{log.level}</span>
                      <span>[{log.context}]</span>
                    </div>
                    <span>{log.timestamp}</span>
                  </div>
                  <div className="text-white text-xs">{log.message}</div>
                  {log.meta != null && (
                    <pre className="mt-1.5 text-[10px] text-slate-400 overflow-x-auto bg-black/40 p-1.5 rounded">
                      {typeof log.meta === 'object' ? JSON.stringify(log.meta, null, 2) : String(log.meta)}
                    </pre>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer with Developer Contact */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between gap-2 font-sans text-xs">
          <div className="flex items-center gap-1.5 text-slate-400">
            <span>التواصل المباشر مع مهندس النظام:</span>
            <a
              href="mailto:nidalwatfa99@gmail.com?subject=Dalil%20Syria%20Diagnostics%20Report"
              className="text-amber-400 hover:underline font-mono"
            >
              nidalwatfa99@gmail.com
            </a>
          </div>
          <button
            onClick={onClose}
            className="py-1.5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
