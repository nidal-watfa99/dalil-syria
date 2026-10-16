import React, { useCallback, useState } from 'react';
import {
  KeyRound,
  Eye,
  EyeOff,
  Save,
  Trash2,
  PlugZap,
  Send,
  ExternalLink,
  ShieldCheck,
  Lock,
  Loader2,
  CheckCircle2,
  XCircle,
  CircleDashed,
  AlertTriangle,
} from 'lucide-react';

type Status = 'unconfigured' | 'unverified' | 'connected' | 'failed';

interface ProviderView {
  id: string;
  name: string;
  suggestedModels: string[];
  defaultModel: string;
  model: string;
  keyUrl: string;
  docsUrl: string;
  termsUrl: string;
  note: string;
  keySource: 'env' | 'stored' | 'none';
  keyMask: string | null;
  status: Status;
  errorCode: string | null;
  errorMessage: string | null;
  checkedAt: string | null;
  isDefault: boolean;
}

interface ProvidersResponse {
  encryptionAvailable: boolean;
  fallbackEnabled: boolean;
  defaultProvider: string | null;
  providers: ProviderView[];
}

const STATUS_LABEL: Record<Status, string> = {
  unconfigured: 'لم يتم الإعداد',
  unverified: 'مفتاح محفوظ — لم يُتحقق منه',
  connected: 'متصل',
  failed: 'فشل الاتصال',
};

const CODE_LABEL: Record<string, string> = {
  invalid_key: 'مفتاح غير صالح',
  quota_exceeded: 'تجاوز الحصة',
  timeout: 'انتهت المهلة',
  model_unavailable: 'النموذج غير متاح',
  network_error: 'تعذر الوصول للمزود',
  provider_error: 'خطأ من المزود',
};

export const AISettingsView: React.FC = () => {
  // Admin token lives only in component state — never persisted to storage.
  const [token, setToken] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [data, setData] = useState<ProvidersResponse | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [keyInputs, setKeyInputs] = useState<Record<string, string>>({});
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});
  const [modelInputs, setModelInputs] = useState<Record<string, string>>({});
  const [messages, setMessages] = useState<Record<string, { ok: boolean; text: string }>>({});
  const [testQuestion, setTestQuestion] = useState('ما هي عاصمة سوريا؟ أجب بجملة واحدة.');

  const api = useCallback(
    async (path: string, method = 'GET', body?: unknown) => {
      const res = await fetch(path, {
        method,
        headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
        body: body === undefined ? undefined : JSON.stringify(body),
      });
      let json: any = null;
      try {
        json = await res.json();
      } catch {
        /* non-JSON */
      }
      return { ok: res.ok, status: res.status, json };
    },
    [token]
  );

  const load = useCallback(async () => {
    const r = await api('/api/admin/ai/providers');
    if (r.ok) {
      setData(r.json);
      setModelInputs((prev) => {
        const next = { ...prev };
        for (const p of r.json.providers as ProviderView[]) if (next[p.id] === undefined) next[p.id] = p.model;
        return next;
      });
    }
    return r;
  }, [api]);

  const unlock = async () => {
    setAuthError(null);
    setBusy('auth');
    try {
      const r = await api('/api/admin/ai/auth', 'POST');
      if (r.ok) {
        setUnlocked(true);
        await load();
      } else {
        setAuthError(r.json?.message || 'تعذر الوصول إلى خادم الإدارة. تأكد أن التطبيق يعمل مع الخادم (npm run dev / npm start).');
      }
    } catch {
      setAuthError('تعذر الاتصال بالخادم. هذه الصفحة تتطلب تشغيل خادم التطبيق.');
    } finally {
      setBusy(null);
    }
  };

  const setMsg = (id: string, ok: boolean, text: string) => setMessages((m) => ({ ...m, [id]: { ok, text } }));

  const save = async (p: ProviderView) => {
    const key = (keyInputs[p.id] || '').trim();
    const model = (modelInputs[p.id] || '').trim();
    const body: Record<string, string> = {};
    if (key) body.apiKey = key;
    if (model && model !== p.model) body.model = model;
    if (!Object.keys(body).length) return setMsg(p.id, false, 'لا توجد تغييرات للحفظ.');
    setBusy(`save-${p.id}`);
    const r = await api(`/api/admin/ai/providers/${p.id}`, 'PUT', body);
    if (r.ok) {
      setKeyInputs((k) => ({ ...k, [p.id]: '' })); // clear the secret from the browser immediately
      setShowKey((s) => ({ ...s, [p.id]: false }));
      setMsg(p.id, true, key ? 'تم حفظ المفتاح على الخادم. اضغط «التحقق من الاتصال» للتأكد من صلاحيته.' : 'تم حفظ النموذج.');
      await load();
    } else {
      setMsg(p.id, false, r.json?.message || 'فشل الحفظ.');
    }
    setBusy(null);
  };

  const verify = async (p: ProviderView) => {
    setBusy(`verify-${p.id}`);
    const r = await api(`/api/admin/ai/providers/${p.id}/verify`, 'POST');
    setMsg(p.id, r.ok && r.json?.status === 'connected', r.json?.message || 'فشل الطلب.');
    await load();
    setBusy(null);
  };

  const remove = async (p: ProviderView) => {
    if (!window.confirm(`حذف مفتاح ${p.name} من الخادم؟`)) return;
    setBusy(`del-${p.id}`);
    const r = await api(`/api/admin/ai/providers/${p.id}/key`, 'DELETE');
    setMsg(p.id, r.ok, r.json?.message || 'فشل الحذف.');
    await load();
    setBusy(null);
  };

  const test = async (p: ProviderView) => {
    setBusy(`test-${p.id}`);
    const r = await api(`/api/admin/ai/providers/${p.id}/test`, 'POST', { question: testQuestion });
    if (r.json?.ok) setMsg(p.id, true, `رد حقيقي من ${r.json.provider} / ${r.json.model}:\n${r.json.reply}`);
    else setMsg(p.id, false, r.json?.message || 'فشل الاختبار.');
    await load();
    setBusy(null);
  };

  const updateGlobal = async (patch: { defaultProvider?: string | null; fallbackEnabled?: boolean }) => {
    await api('/api/admin/ai/settings', 'PUT', patch);
    await load();
  };

  const StatusIcon: React.FC<{ s: Status }> = ({ s }) =>
    s === 'connected' ? (
      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
    ) : s === 'failed' ? (
      <XCircle className="w-4 h-4 text-rose-400" />
    ) : (
      <CircleDashed className="w-4 h-4 text-[#8e918f]" />
    );

  return (
    <div className="space-y-6 animate-fadeIn text-right max-w-4xl mx-auto">
      <div className="p-6 rounded-3xl bg-[#1e1f20] border border-[#333537] shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-2xl bg-[#1a73e8]/15 border border-[#1a73e8]/30 text-[#a8c7fa]">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-white">إعدادات الذكاء الاصطناعي</h1>
        </div>
        <p className="text-xs sm:text-sm text-[#c4c7c5] leading-relaxed">
          إدارة مزودي النماذج ومفاتيح API. تُحفظ المفاتيح على الخادم فقط (مشفّرة أو في متغيرات البيئة) ولا تُعاد إلى المتصفح أبداً.
          المفتاح مسؤوليتك: الحصة والاستهلاك والتكاليف المحتملة تخضع لشروط كل مزود، والأسعار والحصص المجانية قد تتغير وقد تتطلب حساباً.
        </p>
      </div>

      {!unlocked && (
        <div className="p-5 rounded-3xl bg-[#1e1f20] border border-amber-500/30 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Lock className="w-4 h-4 text-amber-400" />
            رمز الإدارة مطلوب
          </div>
          <p className="text-xs text-[#c4c7c5]">
            أدخل قيمة ADMIN_TOKEN المضبوطة على الخادم. لا يُحفظ الرمز في المتصفح ويُمسح عند إغلاق الصفحة.
          </p>
          <div className="flex gap-2">
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && token && unlock()}
              autoComplete="off"
              dir="ltr"
              placeholder="ADMIN_TOKEN"
              className="flex-1 rounded-xl bg-[#282a2c] border border-[#3c4043] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#1a73e8]"
            />
            <button
              onClick={unlock}
              disabled={!token || busy === 'auth'}
              className="px-4 py-2 rounded-xl bg-[#1a73e8] text-white text-xs font-bold disabled:opacity-40 flex items-center gap-1.5"
            >
              {busy === 'auth' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              دخول
            </button>
          </div>
          {authError && <p className="text-xs text-rose-300">{authError}</p>}
        </div>
      )}

      {unlocked && data && (
        <>
          {!data.encryptionAvailable && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                حفظ المفاتيح من هذه الواجهة معطّل لأن AI_SECRETS_ENCRYPTION_KEY غير مضبوط على الخادم. يمكنك ضبط المفاتيح كمتغيرات بيئة
                (مثل GEMINI_API_KEY) وسيظهر المزود هنا كمُعدّ، أو اضبط مفتاح التشفير لتفعيل الحفظ من الواجهة.
              </span>
            </div>
          )}

          <div className="p-4 rounded-2xl bg-[#1e1f20] border border-[#333537] flex flex-wrap items-center gap-4 text-xs">
            <label className="flex items-center gap-2 text-[#e3e3e3]">
              المزود الافتراضي:
              <select
                value={data.defaultProvider ?? ''}
                onChange={(e) => updateGlobal({ defaultProvider: e.target.value || null })}
                className="rounded-lg bg-[#282a2c] border border-[#3c4043] px-2 py-1 text-white"
              >
                <option value="">تلقائي (أول مزود مُعدّ)</option>
                {data.providers.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-2 text-[#e3e3e3]">
              <input
                type="checkbox"
                checked={data.fallbackEnabled}
                onChange={(e) => updateGlobal({ fallbackEnabled: e.target.checked })}
              />
              استخدام مزود بديل عند فشل الأساسي (يُذكر في الرد أيّ نموذج استُخدم)
            </label>
          </div>

          <div className="p-4 rounded-2xl bg-[#1e1f20] border border-[#333537] text-xs space-y-1.5">
            <label className="text-[#c4c7c5] block">سؤال اختبار الاتصال (يُرسل فعلياً إلى النموذج عند الضغط على «اختبار سؤال»):</label>
            <input
              value={testQuestion}
              onChange={(e) => setTestQuestion(e.target.value)}
              maxLength={500}
              className="w-full rounded-xl bg-[#282a2c] border border-[#3c4043] px-3 py-2 text-white"
            />
          </div>

          {data.providers.map((p) => {
            const m = messages[p.id];
            return (
              <div key={p.id} className="p-5 rounded-3xl bg-[#1e1f20] border border-[#333537] space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-extrabold text-white">{p.name}</h2>
                    {p.isDefault && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1a73e8]/20 text-[#a8c7fa] border border-[#1a73e8]/30">
                        افتراضي
                      </span>
                    )}
                  </div>
                  <span className="flex items-center gap-1.5 text-xs font-bold text-[#e3e3e3]">
                    <StatusIcon s={p.status} />
                    {STATUS_LABEL[p.status]}
                    {p.status === 'failed' && p.errorCode && ` — ${CODE_LABEL[p.errorCode] || p.errorCode}`}
                  </span>
                </div>

                {p.status === 'failed' && p.errorMessage && <p className="text-xs text-rose-300">{p.errorMessage}</p>}
                {p.checkedAt && (
                  <p className="text-[10px] text-[#8e918f]">آخر طلب فعلي: {new Date(p.checkedAt).toLocaleString('ar-SY')}</p>
                )}
                <p className="text-[11px] text-[#c4c7c5] leading-relaxed">{p.note}</p>

                <div className="grid sm:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <label className="text-[#c4c7c5]">
                      مفتاح API{' '}
                      {p.keyMask && (
                        <span className="text-[#8e918f]" dir="ltr">
                          ({p.keySource === 'env' ? 'متغير بيئة' : 'مخزَّن مشفّراً'}: {p.keyMask})
                        </span>
                      )}
                    </label>
                    <div className="relative">
                      <input
                        type={showKey[p.id] ? 'text' : 'password'}
                        value={keyInputs[p.id] || ''}
                        onChange={(e) => setKeyInputs((k) => ({ ...k, [p.id]: e.target.value }))}
                        autoComplete="off"
                        spellCheck={false}
                        dir="ltr"
                        placeholder={p.keyMask ? 'أدخل مفتاحاً جديداً للاستبدال' : 'الصق المفتاح هنا'}
                        className="w-full rounded-xl bg-[#282a2c] border border-[#3c4043] pl-9 pr-3 py-2 text-white focus:outline-none focus:border-[#1a73e8]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowKey((s) => ({ ...s, [p.id]: !s[p.id] }))}
                        className="absolute left-2.5 top-2.5 text-[#8e918f] hover:text-white"
                        aria-label={showKey[p.id] ? 'إخفاء المفتاح' : 'إظهار المفتاح'}
                      >
                        {showKey[p.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[#c4c7c5]">النموذج</label>
                    <input
                      list={`models-${p.id}`}
                      value={modelInputs[p.id] ?? p.model}
                      onChange={(e) => setModelInputs((s) => ({ ...s, [p.id]: e.target.value }))}
                      dir="ltr"
                      className="w-full rounded-xl bg-[#282a2c] border border-[#3c4043] px-3 py-2 text-white focus:outline-none focus:border-[#1a73e8]"
                    />
                    <datalist id={`models-${p.id}`}>
                      {p.suggestedModels.map((mm) => (
                        <option key={mm} value={mm} />
                      ))}
                    </datalist>
                    <p className="text-[10px] text-[#8e918f]" dir="ltr">
                      {p.suggestedModels.join(' · ')}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => save(p)}
                    disabled={!!busy}
                    className="px-3 py-2 rounded-xl bg-[#1a73e8] text-white text-xs font-bold flex items-center gap-1.5 disabled:opacity-40"
                  >
                    <Save className="w-3.5 h-3.5" /> حفظ
                  </button>
                  <button
                    onClick={() => verify(p)}
                    disabled={!!busy || p.status === 'unconfigured'}
                    className="px-3 py-2 rounded-xl bg-[#282a2c] border border-[#3c4043] text-[#e3e3e3] text-xs font-bold flex items-center gap-1.5 disabled:opacity-40"
                  >
                    {busy === `verify-${p.id}` ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <PlugZap className="w-3.5 h-3.5" />}
                    التحقق من الاتصال
                  </button>
                  <button
                    onClick={() => test(p)}
                    disabled={!!busy || p.status === 'unconfigured'}
                    className="px-3 py-2 rounded-xl bg-[#282a2c] border border-[#3c4043] text-[#e3e3e3] text-xs font-bold flex items-center gap-1.5 disabled:opacity-40"
                  >
                    {busy === `test-${p.id}` ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    اختبار سؤال
                  </button>
                  <button
                    onClick={() => remove(p)}
                    disabled={!!busy || p.keySource === 'none'}
                    className="px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-1.5 disabled:opacity-40"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> حذف المفتاح
                  </button>
                </div>

                {m && (
                  <pre
                    className={`whitespace-pre-wrap text-xs rounded-xl p-3 border ${
                      m.ok ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200' : 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                    }`}
                  >
                    {m.text}
                  </pre>
                )}

                <div className="flex flex-wrap gap-3 text-[11px] text-[#8ab4f8]" dir="ltr">
                  <a href={p.keyUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline">
                    <ExternalLink className="w-3 h-3" /> Get API key
                  </a>
                  <a href={p.docsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline">
                    <ExternalLink className="w-3 h-3" /> Docs
                  </a>
                  <a href={p.termsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline">
                    <ExternalLink className="w-3 h-3" /> Terms
                  </a>
                </div>
              </div>
            );
          })}

          <div className="p-4 rounded-2xl bg-[#282a2c] border border-[#3c4043] flex gap-2 text-[11px] text-[#c4c7c5] leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              لا يُعرض أي مزود كـ«متصل» إلا بعد طلب فعلي ناجح. حالة «لم يُتحقق منه» تعني وجود مفتاح لم يُجرَّب بعد. الروابط أعلاه تقود إلى
              الصفحات الرسمية للحصول على المفتاح وقراءة الشروط.
            </span>
          </div>
        </>
      )}
    </div>
  );
};
