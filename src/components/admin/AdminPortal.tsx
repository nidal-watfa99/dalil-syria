import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Plus,
  Trash2,
  Edit,
  Download,
  Upload,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  AlertTriangle,
  History,
  X
} from 'lucide-react';
import { Transaction, Authority, TransportFare, InaccuracyReport, AuditLog } from '../../types';
import { TRANSACTIONS_DATA } from '../../data/transactionsData';
import { AUTHORITIES_DATA } from '../../data/authoritiesData';
import { TRANSPORT_FARES_DATA } from '../../data/transportFaresData';
import {
  getInaccuracyReports,
  updateReportStatus,
  getAuditLogs,
  recordAuditLog,
  logDiagnostic
} from '../../utils/storageAndLogs';

interface AdminPortalProps {
  onClose: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('dalil_admin_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'reports' | 'transactions' | 'authorities' | 'audit' | 'export'>('reports');
  const [reports, setReports] = useState<InaccuracyReport[]>(getInaccuracyReports());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(getAuditLogs());

  // Default Admin PIN for verification workflow: "2026"
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '2026' || pinInput === 'admin2026') {
      setIsAuthenticated(true);
      sessionStorage.setItem('dalil_admin_auth', 'true');
      setAuthError(null);
      recordAuditLog({
        action: 'ADMIN_LOGIN',
        entityType: 'Session',
        entityId: 'auth',
        user: 'مسؤول النظام (Super Admin)',
        details: 'تسجيل دخول ناجح إلى لوحة الإدارة والتحقق',
      });
      setAuditLogs(getAuditLogs());
    } else {
      setAuthError('رمز الدخول غير صحيح. الرمز المعتمد لبيئة العرض هو: 2026');
    }
  };

  const handleUpdateReport = (reportId: string, status: InaccuracyReport['status']) => {
    updateReportStatus(reportId, status);
    setReports(getInaccuracyReports());
    recordAuditLog({
      action: 'UPDATE_REPORT_STATUS',
      entityType: 'InaccuracyReport',
      entityId: reportId,
      user: 'مسؤول النظام',
      details: `تحديث حالة البلاغ إلى ${status}`,
    });
    setAuditLogs(getAuditLogs());
  };

  const handleExportDataJSON = () => {
    const backup = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      transactions: TRANSACTIONS_DATA,
      authorities: AUTHORITIES_DATA,
      transportFares: TRANSPORT_FARES_DATA,
      reports: getInaccuracyReports(),
      auditLogs: getAuditLogs(),
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dalil_syria_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    logDiagnostic('info', 'AdminCMS', 'Exported JSON full database backup');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 md:p-6 overflow-hidden">
      <div className="w-full max-w-4xl h-[88vh] glass-panel rounded-2xl border border-slate-700/80 shadow-2xl flex flex-col overflow-hidden text-slate-100 animate-fade-in">
        
        {/* Header */}
        <div className="p-4 md:p-5 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm md:text-base text-white">
                لوحة الإدارة والتحقق وضبط المحتوى الحكومي
              </h3>
              <p className="text-[11px] text-slate-400">
                إدارة المعاملات والمصادر والبت في بلاغات التصحيح وسجل العمليات
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content area: If not authenticated, show PIN gate */}
        {!isAuthenticated ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <form
              onSubmit={handleLogin}
              className="max-w-sm w-full glass-card p-6 rounded-2xl border border-slate-700 space-y-4 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 mx-auto flex items-center justify-center border border-amber-500/30">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-base text-white">تسجيل الدخول للوحة الإدارة</h4>
                <p className="text-xs text-slate-400 mt-1">
                  منطقة مخصصة للمدققين ومسؤولي تحديث المصادر الرسمية
                </p>
              </div>

              <div className="space-y-2 text-right">
                <label className="text-xs text-slate-300 font-semibold">رمز المرور الإداري (PIN)</label>
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="أدخل الرمز الإداري (مثال: 2026)"
                  className="w-full py-2.5 px-3 rounded-lg recessed-field text-center font-mono text-base tracking-widest text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                  autoFocus
                />
              </div>

              {authError && (
                <p className="text-xs text-red-400 bg-red-950/40 p-2 rounded border border-red-800/40">
                  {authError}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-md"
              >
                تأكيد الدخول
              </button>
              <p className="text-[11px] text-slate-500">
                الرمز الافتراضي لبيئة الاختبار: <code className="text-amber-300 font-mono">2026</code>
              </p>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Tabs */}
            <div className="flex items-center border-b border-slate-800 px-4 bg-slate-950/50 text-xs font-semibold overflow-x-auto">
              <button
                onClick={() => setActiveTab('reports')}
                className={`py-3 px-4 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'reports'
                    ? 'border-amber-400 text-amber-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>بلاغات تصحيح المعلومات</span>
                {reports.filter((r) => r.status === 'pending').length > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-mono text-[10px] font-bold">
                    {reports.filter((r) => r.status === 'pending').length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('transactions')}
                className={`py-3 px-4 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'transactions'
                    ? 'border-amber-400 text-amber-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                المعاملات المسجلة ({TRANSACTIONS_DATA.length})
              </button>
              <button
                onClick={() => setActiveTab('authorities')}
                className={`py-3 px-4 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'authorities'
                    ? 'border-amber-400 text-amber-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                الجهات والمراكز الحكومية ({AUTHORITIES_DATA.length})
              </button>
              <button
                onClick={() => setActiveTab('audit')}
                className={`py-3 px-4 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'audit'
                    ? 'border-amber-400 text-amber-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                سجل تدقيق العمليات (Audit Trail)
              </button>
              <button
                onClick={() => setActiveTab('export')}
                className={`py-3 px-4 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'export'
                    ? 'border-amber-400 text-amber-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                النسخ الاحتياطي والتصدير
              </button>
            </div>

            {/* Tab Body */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 text-xs">
              {/* TAB: REPORTS */}
              {activeTab === 'reports' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-slate-400">
                      تقارير وملاحظات المواطنين حول تغير الرسوم أو الأوراق أو ساعات العمل:
                    </p>
                    <span className="text-slate-500 font-mono">الإجمالي: {reports.length}</span>
                  </div>

                  {reports.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                      لا توجد بلاغات غير مراجعة حالياً.
                    </div>
                  ) : (
                    reports.map((rep) => (
                      <div
                        key={rep.id}
                        className="p-4 rounded-xl glass-card border border-slate-800 space-y-2.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-mono text-amber-400 uppercase">
                              {rep.targetType} · {rep.issueCategory}
                            </span>
                            <h4 className="font-bold text-sm text-white mt-0.5">{rep.targetName}</h4>
                            <span className="text-[11px] text-slate-400 font-mono">{rep.createdAt}</span>
                          </div>

                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                              rep.status === 'resolved'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : rep.status === 'rejected'
                                ? 'bg-red-950 text-red-300 border border-red-800'
                                : 'bg-amber-950 text-amber-300 border border-amber-800'
                            }`}
                          >
                            {rep.status === 'resolved' ? 'تم التصحيح والاعتماد' : rep.status === 'rejected' ? 'مرفوض بعد المراجعة' : 'قيد المراجعة'}
                          </span>
                        </div>

                        <p className="text-slate-300 bg-slate-950/50 p-2.5 rounded border border-slate-800">
                          {rep.description}
                        </p>

                        {rep.proposedCorrection && (
                          <p className="text-emerald-300 text-[11px]">
                            التصحيح المقترح: {rep.proposedCorrection}
                          </p>
                        )}

                        <div className="flex items-center gap-2 pt-1 border-t border-slate-800/80">
                          <button
                            onClick={() => handleUpdateReport(rep.id, 'resolved')}
                            className="flex items-center gap-1 py-1.5 px-3 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-semibold transition-colors"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>قبول وتحديث المعلومة</span>
                          </button>
                          <button
                            onClick={() => handleUpdateReport(rep.id, 'rejected')}
                            className="flex items-center gap-1 py-1.5 px-3 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 text-[11px] font-semibold transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>رفض البلاغ</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB: TRANSACTIONS LIST */}
              {activeTab === 'transactions' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-slate-400">قائمة المعاملات الموثقة في قاعدة البيانات المركزية:</p>
                  </div>
                  <div className="rounded-xl overflow-hidden border border-slate-800">
                    <table className="w-full text-right">
                      <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                        <tr>
                          <th className="p-3">اسم المعاملة</th>
                          <th className="p-3">الجهة المسؤولة</th>
                          <th className="p-3">الحالة القانونية</th>
                          <th className="p-3">آخر تحقق</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 bg-slate-900/40">
                        {TRANSACTIONS_DATA.map((tx) => (
                          <tr key={tx.id} className="hover:bg-slate-900">
                            <td className="p-3 font-semibold text-white">{tx.titleAr}</td>
                            <td className="p-3 text-slate-300">{tx.responsibleAuthority}</td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                                موثق ومنشور
                              </span>
                            </td>
                            <td className="p-3 font-mono text-slate-400">{tx.lastVerifiedDate}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB: AUTHORITIES LIST */}
              {activeTab === 'authorities' && (
                <div className="space-y-3">
                  <p className="text-slate-400">قائمة المراكز والدوائر الحكومية المسجلة بالإحداثيات الموثقة:</p>
                  <div className="rounded-xl overflow-hidden border border-slate-800">
                    <table className="w-full text-right">
                      <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                        <tr>
                          <th className="p-3">اسم الجهة</th>
                          <th className="p-3">المحافظة والمنطقة</th>
                          <th className="p-3">الهاتف الرسمي</th>
                          <th className="p-3">الإحداثيات الجغرافية</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 bg-slate-900/40">
                        {AUTHORITIES_DATA.map((auth) => (
                          <tr key={auth.id} className="hover:bg-slate-900">
                            <td className="p-3 font-semibold text-white">{auth.nameAr}</td>
                            <td className="p-3 text-slate-300">{auth.district}</td>
                            <td className="p-3 font-mono text-slate-300">{auth.phone}</td>
                            <td className="p-3 font-mono text-[11px] text-amber-300">
                              {auth.lat.toFixed(4)}, {auth.lng.toFixed(4)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB: AUDIT LOGS */}
              {activeTab === 'audit' && (
                <div className="space-y-3">
                  <p className="text-slate-400">سجل تدقيق التعديلات والعمليات الإدارية الحساسة:</p>
                  <div className="space-y-2">
                    {auditLogs.map((log) => (
                      <div key={log.id} className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <strong className="text-amber-400 font-mono text-[11px]">{log.action}</strong>
                            <span className="text-slate-400">بواسطة {log.user}</span>
                          </div>
                          <p className="text-slate-300 mt-0.5">{log.details}</p>
                        </div>
                        <span className="text-[11px] font-mono text-slate-500 whitespace-nowrap">
                          {log.timestamp}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: EXPORT & BACKUP */}
              {activeTab === 'export' && (
                <div className="space-y-4 max-w-lg">
                  {/* Download Full Application Source Code ZIP */}
                  <div className="p-4 rounded-xl glass-card border border-amber-500/40 bg-amber-500/5 space-y-3">
                    <h4 className="font-bold text-sm text-white flex items-center gap-2">
                      <Download className="w-4 h-4 text-amber-400" />
                      الحزمة المصدرية الشاملة الكاملة للتطبيق (ZIP)
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      ملف أرشيف مضغوط يضم كافة ملفات المشروع المصدرية الأصلية (React 19، Express، البيانات الموثقة، الخرائط GIS، البحث الصوتي، وملفات التكوين).
                    </p>
                    <a
                      href="/dalil-syria-complete-source.zip"
                      download="dalil-syria-complete-source.zip"
                      className="inline-flex py-2.5 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors items-center gap-2 shadow-lg"
                    >
                      <Download className="w-4 h-4" />
                      <span>تحميل dalil-syria-complete-source.zip</span>
                    </a>
                  </div>

                  <div className="p-4 rounded-xl glass-card border border-slate-800 space-y-3">
                    <h4 className="font-bold text-sm text-white flex items-center gap-2">
                      <Download className="w-4 h-4 text-amber-400" />
                      تصدير نسخة احتياطية للبيانات (JSON)
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      تصدير كافة المعاملات والجهات والخرائط وأسعار النقل والبلاغات وسجل التدقيق في ملف JSON موحد.
                    </p>
                    <button
                      onClick={handleExportDataJSON}
                      className="py-2.5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors flex items-center gap-2 border border-slate-700"
                    >
                      <Download className="w-4 h-4" />
                      <span>تنزيل ملف النسخة الاحتياطية</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
