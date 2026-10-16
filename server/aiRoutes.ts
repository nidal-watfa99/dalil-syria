import type { Express, Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import {
  PROVIDERS,
  ProviderDef,
  ProviderError,
  ERROR_MESSAGES_AR,
  ChatTurn,
  getProvider,
  verifyKey,
  generate,
  redact,
} from './providers';
import {
  getKey,
  keyMask,
  saveKey,
  deleteStoredKey,
  getSettings,
  updateSettings,
  setModel,
  setCheck,
  effectiveStatus,
  modelFor,
  providerOrder,
  encryptionAvailable,
} from './aiStore';

// ---------------- admin protection ----------------
const failures = new Map<string, { n: number; first: number }>();
const WINDOW = 15 * 60 * 1000;
const MAX_FAILS = 10;

const safeEqual = (a: string, b: string) => {
  const ha = crypto.createHash('sha256').update(a).digest();
  const hb = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
};

function adminOnly(req: Request, res: Response, next: NextFunction) {
  res.setHeader('Cache-Control', 'no-store');
  const expected = process.env.ADMIN_TOKEN;
  if (!expected || expected.length < 12) {
    return res.status(503).json({
      error: 'admin_disabled',
      message: 'إدارة المفاتيح معطّلة: يجب ضبط متغير البيئة ADMIN_TOKEN (12 محرفاً على الأقل) على الخادم.',
    });
  }
  const ip = req.ip || 'unknown';
  const now = Date.now();
  const f = failures.get(ip);
  if (f && now - f.first < WINDOW && f.n >= MAX_FAILS) {
    return res.status(429).json({ error: 'too_many_attempts', message: 'محاولات كثيرة. حاول لاحقاً.' });
  }
  const given = String(req.header('x-admin-token') || '');
  if (!given || !safeEqual(given, expected)) {
    const cur = f && now - f.first < WINDOW ? f : { n: 0, first: now };
    cur.n += 1;
    failures.set(ip, cur);
    return res.status(401).json({ error: 'unauthorized', message: 'رمز الإدارة غير صحيح.' });
  }
  failures.delete(ip);
  next();
}

// ---------------- views ----------------
function providerView(p: ProviderDef) {
  const st = effectiveStatus(p.id);
  const mask = keyMask(p.id);
  const s = getSettings();
  return {
    id: p.id,
    name: p.name,
    suggestedModels: p.suggestedModels,
    defaultModel: p.defaultModel,
    model: modelFor(p.id),
    keyUrl: p.keyUrl,
    docsUrl: p.docsUrl,
    termsUrl: p.termsUrl,
    note: p.note,
    keySource: mask.source,
    keyMask: mask.last4 ? `••••••••${mask.last4}` : null,
    status: st.status,
    errorCode: st.code ?? null,
    errorMessage: st.code ? ERROR_MESSAGES_AR[st.code] : null,
    checkedAt: st.checkedAt || null,
    isDefault: s.defaultProvider === p.id,
  };
}

const MODEL_RE = /^[A-Za-z0-9._:\/\-]{1,100}$/;

function resolveProvider(req: Request, res: Response): ProviderDef | null {
  const p = getProvider(String(req.params.id));
  if (!p) {
    res.status(404).json({ error: 'unknown_provider', message: 'مزود غير معروف.' });
    return null;
  }
  return p;
}

const errInfo = (e: unknown) =>
  e instanceof ProviderError
    ? { code: e.code, message: e.message }
    : { code: 'provider_error' as const, message: ERROR_MESSAGES_AR.provider_error };

// ---------------- public chat orchestration ----------------
export interface ChatResult {
  ok: boolean;
  reply?: string;
  provider?: string;
  providerName?: string;
  model?: string;
  fallbackUsed?: boolean;
  attempts: { provider: string; providerName: string; code: string; message: string }[];
}

export async function runChat(system: string, message: string, history: ChatTurn[]): Promise<ChatResult> {
  const order = providerOrder();
  const attempts: ChatResult['attempts'] = [];
  for (let i = 0; i < order.length; i++) {
    const id = order[i];
    const p = getProvider(id)!;
    const k = getKey(id)!;
    const model = modelFor(id);
    try {
      const reply = await generate(p, k.key, model, system, history, message);
      setCheck(id, { status: 'connected', checkedAt: new Date().toISOString() });
      return { ok: true, reply, provider: id, providerName: p.name, model, fallbackUsed: i > 0, attempts };
    } catch (e) {
      const info = errInfo(e);
      attempts.push({ provider: id, providerName: p.name, code: info.code, message: info.message });
      // Only persist failure for conditions that are about the provider/key, not a transient model blip
      setCheck(id, { status: 'failed', code: info.code as any, checkedAt: new Date().toISOString() });
    }
  }
  return { ok: false, attempts };
}

export function registerAiRoutes(app: Express) {
  // Public, non-sensitive: lets the assistant UI show honestly whether live AI is configured.
  app.get('/api/ai/status', (_req, res) => {
    const order = providerOrder();
    const first = order[0] ? getProvider(order[0]) : null;
    res.json({
      liveAvailable: order.length > 0,
      activeProvider: first?.name ?? null,
      activeModel: first ? modelFor(first.id) : null,
    });
  });

  // ---- admin ----
  app.post('/api/admin/ai/auth', adminOnly, (_req, res) => {
    res.json({ ok: true, encryptionAvailable: encryptionAvailable() });
  });

  app.get('/api/admin/ai/providers', adminOnly, (_req, res) => {
    const s = getSettings();
    res.json({
      encryptionAvailable: encryptionAvailable(),
      fallbackEnabled: s.fallbackEnabled,
      defaultProvider: s.defaultProvider,
      providers: PROVIDERS.map(providerView),
    });
  });

  app.put('/api/admin/ai/providers/:id', adminOnly, (req, res) => {
    const p = resolveProvider(req, res);
    if (!p) return;
    const { apiKey, model } = req.body || {};
    if (model !== undefined) {
      if (typeof model !== 'string' || !MODEL_RE.test(model)) {
        return res.status(400).json({ error: 'bad_model', message: 'اسم النموذج غير صالح.' });
      }
      setModel(p.id, model);
    }
    if (apiKey !== undefined) {
      if (typeof apiKey !== 'string' || apiKey.length < 8 || apiKey.length > 512 || /\s/.test(apiKey)) {
        return res.status(400).json({ error: 'bad_key', message: 'صيغة المفتاح غير صالحة (8–512 محرفاً بدون مسافات).' });
      }
      try {
        saveKey(p.id, apiKey);
      } catch (e: any) {
        if (e?.message === 'ENCRYPTION_KEY_MISSING') {
          return res.status(400).json({
            error: 'encryption_key_missing',
            message:
              'لا يمكن حفظ المفتاح من الواجهة لأن AI_SECRETS_ENCRYPTION_KEY غير مضبوط على الخادم. اضبط المفتاح كمتغير بيئة ' +
              `${p.id.toUpperCase()}_API_KEY أو فعّل التشفير ثم أعد المحاولة.`,
          });
        }
        return res.status(500).json({ error: 'save_failed', message: 'تعذر حفظ المفتاح.' });
      }
    }
    res.json(providerView(p));
  });

  app.delete('/api/admin/ai/providers/:id/key', adminOnly, (req, res) => {
    const p = resolveProvider(req, res);
    if (!p) return;
    deleteStoredKey(p.id);
    const stillEnv = keyMask(p.id).source === 'env';
    res.json({
      ...providerView(p),
      message: stillEnv
        ? 'حُذف المفتاح المخزَّن، لكن المزود ما زال مُعدّاً عبر متغير بيئة على الخادم (احذفه من إعدادات الاستضافة).'
        : 'تم حذف المفتاح.',
    });
  });

  app.post('/api/admin/ai/providers/:id/verify', adminOnly, async (req, res) => {
    const p = resolveProvider(req, res);
    if (!p) return;
    const k = getKey(p.id);
    if (!k) return res.json({ ...providerView(p), message: ERROR_MESSAGES_AR.not_configured });
    try {
      await verifyKey(p, k.key);
      setCheck(p.id, { status: 'connected', checkedAt: new Date().toISOString() });
      res.json({ ...providerView(p), message: 'نجح الاتصال والمفتاح صالح.' });
    } catch (e) {
      const info = errInfo(e);
      setCheck(p.id, { status: 'failed', code: info.code as any, checkedAt: new Date().toISOString() });
      res.json({ ...providerView(p), message: redact(info.message, k.key) });
    }
  });

  app.put('/api/admin/ai/settings', adminOnly, (req, res) => {
    const { defaultProvider, fallbackEnabled } = req.body || {};
    if (defaultProvider !== undefined && defaultProvider !== null && !getProvider(String(defaultProvider))) {
      return res.status(400).json({ error: 'unknown_provider', message: 'مزود غير معروف.' });
    }
    if (fallbackEnabled !== undefined && typeof fallbackEnabled !== 'boolean') {
      return res.status(400).json({ error: 'bad_value', message: 'قيمة غير صالحة.' });
    }
    updateSettings({ defaultProvider: defaultProvider as any, fallbackEnabled });
    const s = getSettings();
    res.json({ defaultProvider: s.defaultProvider, fallbackEnabled: s.fallbackEnabled });
  });

  // Real generation test against ONE provider (no fallback) so the result is attributable.
  app.post('/api/admin/ai/providers/:id/test', adminOnly, async (req, res) => {
    const p = resolveProvider(req, res);
    if (!p) return;
    const q = typeof req.body?.question === 'string' && req.body.question.trim() ? req.body.question.trim().slice(0, 500) : 'ما هي عاصمة سوريا؟ أجب بجملة واحدة.';
    const k = getKey(p.id);
    if (!k) return res.json({ ok: false, code: 'not_configured', message: ERROR_MESSAGES_AR.not_configured });
    const model = modelFor(p.id);
    try {
      const reply = await generate(p, k.key, model, 'أجب بإيجاز وباللغة العربية.', [], q);
      setCheck(p.id, { status: 'connected', checkedAt: new Date().toISOString() });
      res.json({ ok: true, provider: p.name, model, reply: redact(reply, k.key) });
    } catch (e) {
      const info = errInfo(e);
      setCheck(p.id, { status: 'failed', code: info.code as any, checkedAt: new Date().toISOString() });
      res.json({ ok: false, code: info.code, message: redact(info.message, k.key), provider: p.name, model });
    }
  });
}
