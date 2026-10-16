/**
 * Single source of truth for developer contact details.
 * Used by the UI (ContactView, SettingsView, Sidebar) and by server.ts.
 */
export const DEVELOPER_EMAIL = 'nidalwatfa99@gmail.com';

export const buildDeveloperMailto = (subject?: string, body?: string): string => {
  const params: string[] = [];
  if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
  if (body) params.push(`body=${encodeURIComponent(body)}`);
  return `mailto:${DEVELOPER_EMAIL}${params.length ? '?' + params.join('&') : ''}`;
};
