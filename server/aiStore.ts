/**
 * Server-side storage for AI provider keys and settings.
 *
 * Key sources (priority order):
 *   1. Environment variable  <ID>_API_KEY  (e.g. GEMINI_API_KEY) — never written to disk by the app.
 *   2. Key saved from the admin UI — stored ENCRYPTED (AES-256-GCM) in data/ai-secrets.json.
 *      Requires AI_SECRETS_ENCRYPTION_KEY; without it, saving from the UI is refused.
 *
 * Plain keys are never returned by any function that feeds an HTTP response; only `last4` masks are.
 * Non-secret settings (default provider, models, last real check result) live in data/ai-settings.json.
 */
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { PROVIDERS, ProviderId, ErrorCode } from './providers';

const dataDir = () => path.resolve(process.env.AI_DATA_DIR || 'data');
const secretsFile = () => path.join(dataDir(), 'ai-secrets.json');
const settingsFile = () => path.join(dataDir(), 'ai-settings.json');

export type ConnStatus = 'unconfigured' | 'unverified' | 'connected' | 'failed';

export interface LastCheck {
  status: ConnStatus;
  code?: ErrorCode;
  checkedAt: string;
}

export interface Settings {
  defaultProvider: ProviderId | null;
  fallbackEnabled: boolean;
  models: Partial<Record<ProviderId, string>>;
  checks: Partial<Record<ProviderId, LastCheck>>;
}

const ensureDir = () => fs.mkdirSync(dataDir(), { recursive: true, mode: 0o700 });

function readJson<T>(file: string, fallback: T): T {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8')) as T;
  } catch {
    return fallback;
  }
}

function writeJson(file: string, obj: unknown) {
  ensureDir();
  const tmp = file + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(obj, null, 2), { mode: 0o600 });
  fs.renameSync(tmp, file);
}

// ---------- encryption ----------
export const encryptionAvailable = (): boolean => !!process.env.AI_SECRETS_ENCRYPTION_KEY;

const encKey = (): Buffer =>
  crypto.createHash('sha256').update(String(process.env.AI_SECRETS_ENCRYPTION_KEY)).digest();

const encrypt = (plain: string) => {
  const iv = crypto.randomBytes(12);
  const c = crypto.createCipheriv('aes-256-gcm', encKey(), iv);
  const data = Buffer.concat([c.update(plain, 'utf8'), c.final()]);
  return { iv: iv.toString('base64'), tag: c.getAuthTag().toString('base64'), data: data.toString('base64') };
};

const decrypt = (rec: { iv: string; tag: string; data: string }): string | null => {
  try {
    const d = crypto.createDecipheriv('aes-256-gcm', encKey(), Buffer.from(rec.iv, 'base64'));
    d.setAuthTag(Buffer.from(rec.tag, 'base64'));
    return Buffer.concat([d.update(Buffer.from(rec.data, 'base64')), d.final()]).toString('utf8');
  } catch {
    return null; // wrong encryption key / corrupted file
  }
};

type SecretsFile = Partial<Record<ProviderId, { iv: string; tag: string; data: string; last4: string }>>;

// ---------- keys ----------
const envName = (id: ProviderId) => `${id.toUpperCase()}_API_KEY`;

/** Plain key — for server-side use only. */
export function getKey(id: ProviderId): { key: string; source: 'env' | 'stored' } | null {
  const fromEnv = (process.env[envName(id)] || '').trim();
  // Ignore the placeholder from .env.example
  if (fromEnv && !/^MY_|^YOUR_/i.test(fromEnv)) return { key: fromEnv, source: 'env' };
  if (!encryptionAvailable()) return null;
  const rec = readJson<SecretsFile>(secretsFile(), {})[id];
  if (!rec) return null;
  const k = decrypt(rec);
  return k ? { key: k, source: 'stored' } : null;
}

export function keyMask(id: ProviderId): { source: 'env' | 'stored' | 'none'; last4?: string } {
  const k = getKey(id);
  if (k) return { source: k.source, last4: k.key.slice(-4) };
  return { source: 'none' };
}

export function saveKey(id: ProviderId, key: string) {
  if (!encryptionAvailable()) {
    throw new Error('ENCRYPTION_KEY_MISSING');
  }
  const all = readJson<SecretsFile>(secretsFile(), {});
  all[id] = { ...encrypt(key), last4: key.slice(-4) };
  writeJson(secretsFile(), all);
  setCheck(id, { status: 'unverified', checkedAt: new Date().toISOString() });
}

export function deleteStoredKey(id: ProviderId) {
  const all = readJson<SecretsFile>(secretsFile(), {});
  delete all[id];
  writeJson(secretsFile(), all);
  const s = getSettings();
  delete s.checks[id];
  writeJson(settingsFile(), s);
}

// ---------- settings ----------
export function getSettings(): Settings {
  const s = readJson<Partial<Settings>>(settingsFile(), {});
  return {
    defaultProvider: s.defaultProvider ?? null,
    fallbackEnabled: s.fallbackEnabled ?? true,
    models: s.models ?? {},
    checks: s.checks ?? {},
  };
}

export function updateSettings(patch: Partial<Pick<Settings, 'defaultProvider' | 'fallbackEnabled'>>) {
  const s = getSettings();
  if (patch.defaultProvider !== undefined) s.defaultProvider = patch.defaultProvider;
  if (patch.fallbackEnabled !== undefined) s.fallbackEnabled = patch.fallbackEnabled;
  writeJson(settingsFile(), s);
}

export function setModel(id: ProviderId, model: string) {
  const s = getSettings();
  s.models[id] = model;
  writeJson(settingsFile(), s);
}

export function setCheck(id: ProviderId, c: LastCheck) {
  const s = getSettings();
  s.checks[id] = c;
  writeJson(settingsFile(), s);
}

export function effectiveStatus(id: ProviderId): LastCheck {
  if (!getKey(id)) return { status: 'unconfigured', checkedAt: '' };
  return getSettings().checks[id] ?? { status: 'unverified', checkedAt: '' };
}

export const modelFor = (id: ProviderId): string =>
  getSettings().models[id] || PROVIDERS.find((p) => p.id === id)!.defaultModel;

/** Providers to try, in order: default first, then other configured ones (if fallback enabled). */
export function providerOrder(): ProviderId[] {
  const s = getSettings();
  const configured = PROVIDERS.map((p) => p.id).filter((id) => !!getKey(id));
  if (!configured.length) return [];
  const first = s.defaultProvider && configured.includes(s.defaultProvider) ? s.defaultProvider : configured[0];
  if (!s.fallbackEnabled) return [first];
  return [first, ...configured.filter((id) => id !== first)];
}
