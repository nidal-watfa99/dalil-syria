import { AuditLog, DiagnosticLog, InaccuracyReport } from '../types';

const STORAGE_KEYS = {
  FAVORITES: 'dalil_syria_favorites_v1',
  CHECKLISTS: 'dalil_syria_checklists_v1',
  REPORTS: 'dalil_syria_reports_v1',
  AUDIT_LOGS: 'dalil_syria_audit_v1',
  DIAGNOSTICS: 'dalil_syria_diag_v1',
  THEME: 'dalil_syria_theme_v1',
  ADMIN_TOKEN: 'dalil_syria_admin_session_v1',
};

// Global in-memory diagnostics ring buffer (keeps last 200 logs)
const MAX_LOGS = 200;
let diagnosticLogs: DiagnosticLog[] = [];

// Initialize from storage safely
try {
  const saved = localStorage.getItem(STORAGE_KEYS.DIAGNOSTICS);
  if (saved) {
    diagnosticLogs = JSON.parse(saved);
  }
} catch {
  diagnosticLogs = [];
}

export function logDiagnostic(
  level: 'info' | 'warn' | 'error',
  context: string,
  message: string,
  meta?: unknown
): void {
  const log: DiagnosticLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: new Date().toISOString(),
    level,
    context,
    message,
    meta,
  };

  diagnosticLogs.unshift(log);
  if (diagnosticLogs.length > MAX_LOGS) {
    diagnosticLogs = diagnosticLogs.slice(0, MAX_LOGS);
  }

  try {
    localStorage.setItem(STORAGE_KEYS.DIAGNOSTICS, JSON.stringify(diagnosticLogs));
  } catch {
    // quota exceeded or disabled
  }

  // Also output to console in development
  if (level === 'error') {
    console.error(`[DalilSyria ${context}]`, message, meta);
  } else if (level === 'warn') {
    console.warn(`[DalilSyria ${context}]`, message, meta);
  } else {
    console.log(`[DalilSyria ${context}]`, message);
  }
}

export function getDiagnosticLogs(): DiagnosticLog[] {
  return [...diagnosticLogs];
}

export function clearDiagnosticLogs(): void {
  diagnosticLogs = [];
  localStorage.removeItem(STORAGE_KEYS.DIAGNOSTICS);
}

// Favorites Storage
export function getFavorites(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleFavorite(transactionId: string): boolean {
  const favs = getFavorites();
  const exists = favs.includes(transactionId);
  const updated = exists ? favs.filter((id) => id !== transactionId) : [...favs, transactionId];
  try {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updated));
    logDiagnostic('info', 'Favorites', `${exists ? 'Removed' : 'Added'} transaction: ${transactionId}`);
  } catch {
    // ignore
  }
  return !exists;
}

export function isFavorite(transactionId: string): boolean {
  return getFavorites().includes(transactionId);
}

// Checklist State
export function getCheckedDocuments(transactionId: string): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CHECKLISTS);
    const all = raw ? JSON.parse(raw) : {};
    return all[transactionId] || [];
  } catch {
    return [];
  }
}

export function toggleDocumentCheck(transactionId: string, documentId: string): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CHECKLISTS);
    const all = raw ? JSON.parse(raw) : {};
    const current: string[] = all[transactionId] || [];
    const exists = current.includes(documentId);
    const next = exists ? current.filter((id) => id !== documentId) : [...current, documentId];
    all[transactionId] = next;
    localStorage.setItem(STORAGE_KEYS.CHECKLISTS, JSON.stringify(all));
    return !exists;
  } catch {
    return false;
  }
}

// Inaccuracy Reports
export function saveInaccuracyReport(report: InaccuracyReport): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REPORTS);
    const reports: InaccuracyReport[] = raw ? JSON.parse(raw) : [];
    reports.unshift(report);
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
    logDiagnostic('info', 'InaccuracyReport', `Recorded report for ${report.targetName}`, { reportId: report.id });
  } catch (err) {
    logDiagnostic('error', 'InaccuracyReport', 'Failed to save local report', err);
  }
}

export function getInaccuracyReports(): InaccuracyReport[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REPORTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function updateReportStatus(reportId: string, newStatus: InaccuracyReport['status']): void {
  try {
    const reports = getInaccuracyReports();
    const idx = reports.findIndex((r) => r.id === reportId);
    if (idx !== -1) {
      reports[idx].status = newStatus;
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
    }
  } catch {
    // ignore
  }
}

// Admin Audit Logs
export function recordAuditLog(log: Omit<AuditLog, 'id' | 'timestamp'>): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    const logs: AuditLog[] = raw ? JSON.parse(raw) : [];
    const entry: AuditLog = {
      ...log,
      id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
    };
    logs.unshift(entry);
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs.slice(0, 100)));
  } catch {
    // ignore
  }
}

export function getAuditLogs(): AuditLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Environment & App Diagnostics Info
export function getSystemDiagnosticsInfo() {
  const isPWA =
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true;

  return {
    appName: 'دليل سوريا | DALIL SYRIA',
    version: '1.0.0-PROD',
    runtime: 'Vite 8 + React 19 + TypeScript',
    userAgent: navigator.userAgent,
    language: navigator.language,
    onlineStatus: navigator.onLine ? 'Online (متصل)' : 'Offline (دون اتصال)',
    displayMode: isPWA ? 'Standalone PWA (مثبت)' : 'Browser Web Window (متصفح)',
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    viewportSize: `${window.innerWidth}x${window.innerHeight}`,
    cookiesEnabled: navigator.cookieEnabled,
    serviceWorkerSupported: 'serviceWorker' in navigator,
    geolocationSupported: 'geolocation' in navigator,
    localTime: new Date().toLocaleString('ar-SY'),
  };
}
