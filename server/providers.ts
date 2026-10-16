/**
 * Unified AI provider layer.
 * Each provider is described declaratively; calls go through plain fetch (no extra SDKs),
 * so adding a provider = adding one entry here.
 * Base URLs can be overridden via env (AI_BASE_URL_<ID>) — used by the integration tests
 * to point at a local mock upstream. Keys are NEVER logged or returned to the browser.
 */

export type ProviderId = 'gemini' | 'openai' | 'anthropic' | 'deepseek' | 'groq';

export interface ProviderDef {
  id: ProviderId;
  name: string;
  kind: 'gemini' | 'openai-compatible' | 'anthropic';
  baseUrl: string;
  defaultModel: string;
  /** Suggested models shown in the UI. The user may type any other model id. */
  suggestedModels: string[];
  keyUrl: string;
  docsUrl: string;
  termsUrl: string;
  note: string;
}

export const PROVIDERS: ProviderDef[] = [
  {
    id: 'gemini',
    name: 'Google Gemini',
    kind: 'gemini',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    defaultModel: 'gemini-2.5-flash',
    suggestedModels: ['gemini-2.5-flash', 'gemini-2.5-pro'],
    keyUrl: 'https://aistudio.google.com/apikey',
    docsUrl: 'https://ai.google.dev/gemini-api/docs',
    termsUrl: 'https://ai.google.dev/gemini-api/terms',
    note: 'يتطلب حساب Google. توفّر Google مستوى مجانياً بحصص محدودة تتغير — راجع صفحة الأسعار الرسمية.',
  },
  {
    id: 'openai',
    name: 'OpenAI',
    kind: 'openai-compatible',
    baseUrl: 'https://api.openai.com/v1',
    defaultModel: 'gpt-4o-mini',
    suggestedModels: ['gpt-4o-mini', 'gpt-4o'],
    keyUrl: 'https://platform.openai.com/api-keys',
    docsUrl: 'https://platform.openai.com/docs',
    termsUrl: 'https://openai.com/policies/terms-of-use',
    note: 'واجهة API مدفوعة بالاستهلاك وتتطلب حساباً ورصيداً؛ لا تتوفر حصة مجانية مضمونة.',
  },
  {
    id: 'anthropic',
    name: 'Anthropic (Claude)',
    kind: 'anthropic',
    baseUrl: 'https://api.anthropic.com/v1',
    defaultModel: 'claude-haiku-5-5',
    suggestedModels: ['claude-haiku-5-5', 'claude-sonnet-5-5'],
    keyUrl: 'https://console.anthropic.com/settings/keys',
    docsUrl: 'https://docs.claude.com',
    termsUrl: 'https://www.anthropic.com/legal/commercial-terms',
    note: 'واجهة API مدفوعة بالاستهلاك وتتطلب حساباً ورصيداً في Claude Console.',
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    kind: 'openai-compatible',
    baseUrl: 'https://api.deepseek.com',
    defaultModel: 'deepseek-chat',
    suggestedModels: ['deepseek-chat', 'deepseek-reasoner'],
    keyUrl: 'https://platform.deepseek.com/api_keys',
    docsUrl: 'https://api-docs.deepseek.com',
    termsUrl: 'https://cdn.deepseek.com/policies/en-US/deepseek-terms-of-use.html',
    note: 'تتطلب حساباً؛ الأسعار والحصص تحددها DeepSeek وقد تتغير.',
  },
  {
    id: 'groq',
    name: 'Groq',
    kind: 'openai-compatible',
    baseUrl: 'https://api.groq.com/openai/v1',
    defaultModel: 'llama-3.3-70b-versatile',
    suggestedModels: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'],
    keyUrl: 'https://console.groq.com/keys',
    docsUrl: 'https://console.groq.com/docs',
    termsUrl: 'https://groq.com/terms-of-use',
    note: 'تتطلب حساباً؛ قد يتوفر مستوى مجاني بحدود معدل تحددها Groq وتتغير.',
  },
];

export const getProvider = (id: string): ProviderDef | undefined => PROVIDERS.find((p) => p.id === id);

export const baseUrlFor = (p: ProviderDef): string =>
  (process.env[`AI_BASE_URL_${p.id.toUpperCase()}`] || p.baseUrl).replace(/\/+$/, '');

export type ErrorCode =
  | 'not_configured'
  | 'invalid_key'
  | 'quota_exceeded'
  | 'timeout'
  | 'model_unavailable'
  | 'network_error'
  | 'provider_error';

export class ProviderError extends Error {
  constructor(public code: ErrorCode, message: string, public httpStatus?: number) {
    super(message);
  }
}

export const ERROR_MESSAGES_AR: Record<ErrorCode, string> = {
  not_configured: 'لم يتم إعداد مفتاح لهذا المزود.',
  invalid_key: 'المفتاح غير صالح أو لا يملك الصلاحية المطلوبة.',
  quota_exceeded: 'تم تجاوز الحصة أو حد المعدل لدى المزود. جرّب لاحقاً أو راجع حسابك.',
  timeout: 'انتهت مهلة الاتصال بالمزود.',
  model_unavailable: 'النموذج المحدد غير متاح لهذا الحساب أو غير موجود.',
  network_error: 'تعذر الوصول إلى خادم المزود (شبكة أو حجب).',
  provider_error: 'أعاد المزود خطأً غير متوقع.',
};

const TIMEOUT_MS = Number(process.env.AI_TIMEOUT_MS || 20000);

/** Remove anything that looks like the key from text before it can reach logs or the client. */
export const redact = (text: string, key?: string): string => {
  let out = String(text ?? '');
  if (key && key.length > 6) out = out.split(key).join('[REDACTED]');
  return out.replace(/(sk-[A-Za-z0-9_\-]{8,}|AIza[0-9A-Za-z_\-]{20,}|gsk_[A-Za-z0-9]{10,})/g, '[REDACTED]');
};

async function http(url: string, init: RequestInit, key: string): Promise<any> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch(url, { ...init, signal: ctrl.signal });
  } catch (e: any) {
    if (e?.name === 'AbortError') throw new ProviderError('timeout', ERROR_MESSAGES_AR.timeout);
    throw new ProviderError('network_error', ERROR_MESSAGES_AR.network_error);
  } finally {
    clearTimeout(timer);
  }
  if (!res.ok) {
    let detail = '';
    try {
      detail = redact((await res.text()).slice(0, 300), key);
    } catch {
      /* ignore */
    }
    const s = res.status;
    if (s === 401 || s === 403) throw new ProviderError('invalid_key', ERROR_MESSAGES_AR.invalid_key, s);
    if (s === 429) throw new ProviderError('quota_exceeded', ERROR_MESSAGES_AR.quota_exceeded, s);
    if (s === 404) throw new ProviderError('model_unavailable', ERROR_MESSAGES_AR.model_unavailable, s);
    // Gemini reports an invalid key as 400 "API key not valid"
    if (s === 400 && /api key|api_key/i.test(detail)) {
      throw new ProviderError('invalid_key', ERROR_MESSAGES_AR.invalid_key, s);
    }
    throw new ProviderError('provider_error', `${ERROR_MESSAGES_AR.provider_error} (HTTP ${s})`, s);
  }
  try {
    return await res.json();
  } catch {
    throw new ProviderError('provider_error', ERROR_MESSAGES_AR.provider_error);
  }
}

export interface ChatTurn {
  role: 'user' | 'assistant';
  content: string;
}

/** Cheap, real request that validates the key (lists models). Does not consume generation quota. */
export async function verifyKey(p: ProviderDef, key: string): Promise<void> {
  const base = baseUrlFor(p);
  if (p.kind === 'gemini') {
    await http(`${base}/models?pageSize=1`, { headers: { 'x-goog-api-key': key } }, key);
  } else if (p.kind === 'anthropic') {
    await http(`${base}/models?limit=1`, { headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01' } }, key);
  } else {
    await http(`${base}/models`, { headers: { Authorization: `Bearer ${key}` } }, key);
  }
}

/** Real generation call. Returns the model's text. */
export async function generate(
  p: ProviderDef,
  key: string,
  model: string,
  system: string,
  history: ChatTurn[],
  message: string
): Promise<string> {
  const base = baseUrlFor(p);
  const turns: ChatTurn[] = [...history, { role: 'user', content: message }];

  if (p.kind === 'gemini') {
    const data = await http(
      `${base}/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          contents: turns.map((t) => ({ role: t.role === 'assistant' ? 'model' : 'user', parts: [{ text: t.content }] })),
        }),
      },
      key
    );
    const text = data?.candidates?.[0]?.content?.parts?.map((x: any) => x.text || '').join('') || '';
    if (!text) throw new ProviderError('provider_error', 'لم يُرجع النموذج نصاً.');
    return text;
  }

  if (p.kind === 'anthropic') {
    const data = await http(
      `${base}/messages`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({ model, max_tokens: 1500, system, messages: turns }),
      },
      key
    );
    const text = (data?.content || []).filter((b: any) => b.type === 'text').map((b: any) => b.text).join('');
    if (!text) throw new ProviderError('provider_error', 'لم يُرجع النموذج نصاً.');
    return text;
  }

  const data = await http(
    `${base}/chat/completions`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({ model, messages: [{ role: 'system', content: system }, ...turns] }),
    },
    key
  );
  const text = data?.choices?.[0]?.message?.content || '';
  if (!text) throw new ProviderError('provider_error', 'لم يُرجع النموذج نصاً.');
  return text;
}
