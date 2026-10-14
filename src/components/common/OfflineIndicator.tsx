import React, { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';
import { logDiagnostic } from '../../utils/storageAndLogs';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      logDiagnostic('info', 'Network', 'Internet connection restored - online mode active');
    };
    const handleOffline = () => {
      setIsOnline(false);
      logDiagnostic('warn', 'Network', 'Device disconnected from internet - offline cached mode active');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-lg bg-amber-900/90 border border-amber-600/50 px-3 py-2 text-xs font-medium text-amber-200 shadow-2xl backdrop-blur-md animate-fade-in">
      <WifiOff className="w-4 h-4 text-amber-400 animate-pulse" />
      <span>وضع العمل دون اتصال — يتم عرض البيانات المفهرسة والمخزنة محلياً.</span>
    </div>
  );
};
