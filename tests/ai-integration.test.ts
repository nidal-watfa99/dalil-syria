/**
 * Integration tests for AI provider management. Runs the REAL server (production mode, built dist)
 * against a local mock upstream that simulates provider behaviour by API key:
 *   good-*  -> 200   bad-* -> 401   quota-* -> 429   slow-* -> hangs (timeout)
 * NOTE: this validates our integration logic, not the real providers' live endpoints.
 */
import http from 'http';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { spawn, ChildProcess } from 'child_process';

let passed = 0;
let failed = 0;
const results: string[] = [];
function check(name: string, cond: boolean, extra = '') {
  if (cond) {
    passed++;
    results.push(`PASS  ${name}`);
  } else {
    failed++;
    results.push(`FAIL  ${name} ${extra}`);
  }
}

const MOCK_PORT = 4510;
const APP_PORT = 4511;
const ADMIN = 'test-admin-token-123456';
const ENC = 'test-encryption-secret-xyz';
const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'dalil-ai-'));

const mock = http.createServer((req, res) => {
  const auth = String(req.headers['authorization'] || '').replace('Bearer ', '');
  const key = auth || String(req.headers['x-goog-api-key'] || req.headers['x-api-key'] || '');
  const provider = (req.url || '').split('/')[1];
  const respond = (code: number, body: unknown) => {
    res.writeHead(code, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(body));
  };
  if (key.startsWith('slow-')) return; // never answers -> client timeout
  if (key.startsWith('bad-')) return respond(401, { error: { message: `invalid key ${key}` } });
  if (key.startsWith('quota-')) return respond(429, { error: { message: 'rate limited' } });
  if (!key.startsWith('good-')) return respond(401, { error: 'no key' });
  const url = req.url || '';
  if (url.includes('/models') && !url.includes(':generateContent')) return respond(200, { data: [{ id: 'm' }], models: [{ name: 'm' }] });
  if (url.includes(':generateContent')) return respond(200, { candidates: [{ content: { parts: [{ text: `رد حي من mock-${provider}` }] } }] });
  if (url.endsWith('/messages')) return respond(200, { content: [{ type: 'text', text: `رد حي من mock-${provider}` }] });
  if (url.endsWith('/chat/completions')) return respond(200, { choices: [{ message: { content: `رد حي من mock-${provider}` } }] });
  respond(404, {});
});

let app: ChildProcess | null = null;
let logs = '';
async function startApp(extraEnv: Record<string, string> = {}, withAdmin = true) {
  logs = '';
  let stale = false;
  try {
    await fetch(`http://127.0.0.1:${APP_PORT}/api/ai/status`);
    stale = true;
  } catch {
    /* port free, good */
  }
  if (stale) throw new Error('PORT_IN_USE: a stale server is still running on ' + APP_PORT);
  const env: NodeJS.ProcessEnv = {
    ...process.env,
    NODE_ENV: 'production',
    PORT: String(APP_PORT),
    AI_DATA_DIR: dataDir,
    AI_TIMEOUT_MS: '1500',
    AI_SECRETS_ENCRYPTION_KEY: ENC,
    GEMINI_API_KEY: '',
    OPENAI_API_KEY: '',
    ANTHROPIC_API_KEY: '',
    DEEPSEEK_API_KEY: '',
    GROQ_API_KEY: '',
    AI_BASE_URL_GEMINI: `http://127.0.0.1:${MOCK_PORT}/gemini`,
    AI_BASE_URL_OPENAI: `http://127.0.0.1:${MOCK_PORT}/openai`,
    AI_BASE_URL_ANTHROPIC: `http://127.0.0.1:${MOCK_PORT}/anthropic`,
    AI_BASE_URL_DEEPSEEK: `http://127.0.0.1:${MOCK_PORT}/deepseek`,
    AI_BASE_URL_GROQ: `http://127.0.0.1:${MOCK_PORT}/groq`,
    ...extraEnv,
  };
  if (withAdmin) env.ADMIN_TOKEN = ADMIN;
  else delete env.ADMIN_TOKEN;
  app = spawn(process.execPath, ['--import', 'tsx', 'server.ts'], { env, stdio: ['ignore', 'pipe', 'pipe'] });
  app.stdout!.on('data', (d) => (logs += d));
  app.stderr!.on('data', (d) => (logs += d));
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${APP_PORT}/api/ai/status`);
      if (r.ok) return;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error('server did not start: ' + logs);
}
async function stopApp() {
  if (!app) return;
  const p = app;
  app = null;
  await new Promise<void>((resolve) => {
    p.on('exit', () => resolve());
    p.kill('SIGKILL');
    setTimeout(() => resolve(), 2000);
  });
  // tsx spawns a child; make sure the port is freed
  await new Promise((r) => setTimeout(r, 500));
}

const base = `http://127.0.0.1:${APP_PORT}`;
async function call(method: string, p: string, body?: unknown, token: string | null = ADMIN) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['x-admin-token'] = token;
  const r = await fetch(base + p, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
  const text = await r.text();
  let json: any = null;
  try {
    json = JSON.parse(text);
  } catch {
    /* */
  }
  return { status: r.status, json, text };
}

async function main() {
  await new Promise<void>((r) => mock.listen(MOCK_PORT, r));
  const allBodies: string[] = [];
  const track = <T extends { text: string }>(r: T): T => (allBodies.push(r.text), r);

  // ---- A. admin protection ----
  await startApp();
  check('A1 no token -> 401', (await call('GET', '/api/admin/ai/providers', undefined, null)).status === 401);
  check('A2 wrong token -> 401', (await call('GET', '/api/admin/ai/providers', undefined, 'wrong-token-wrong')).status === 401);
  check('A3 right token -> 200', (await call('GET', '/api/admin/ai/providers')).status === 200);
  const initial = track(await call('GET', '/api/admin/ai/providers'));
  check('A4 all providers start unconfigured', initial.json.providers.every((p: any) => p.status === 'unconfigured'));
  check('A5 status endpoint says live unavailable', (await call('GET', '/api/ai/status', undefined, null)).json.liveAvailable === false);

  // ---- B. no provider configured: assistant must NOT claim live AI ----
  const noAi = track(await call('POST', '/api/assistant', { message: 'ما رسوم جواز السفر؟' }, null));
  check('B1 no provider -> isLiveAI=false', noAi.json.isLiveAI === false);
  check('B2 fallback labelled as local static', /ثابت|ليس من نموذج/.test(noAi.json.source));

  // ---- C. save / verify with real upstream requests ----
  const KEYS: Record<string, string> = {
    gemini: 'good-gemini-KEY-1111',
    openai: 'bad-openai-KEY-2222',
    anthropic: 'quota-anthropic-KEY-3333',
    deepseek: 'slow-deepseek-KEY-4444',
    groq: 'good-groq-KEY-5555',
  };
  for (const [id, k] of Object.entries(KEYS)) {
    const r = track(await call('PUT', `/api/admin/ai/providers/${id}`, { apiKey: k }));
    check(`C1 save ${id}: 200`, r.status === 200);
    check(`C2 save ${id}: key not echoed`, !r.text.includes(k));
    check(`C3 save ${id}: status unverified (not faked connected)`, r.json.status === 'unverified');
  }
  const expected: Record<string, [string, string | null]> = {
    gemini: ['connected', null],
    openai: ['failed', 'invalid_key'],
    anthropic: ['failed', 'quota_exceeded'],
    deepseek: ['failed', 'timeout'],
    groq: ['connected', null],
  };
  for (const [id, [st, code]] of Object.entries(expected)) {
    const r = track(await call('POST', `/api/admin/ai/providers/${id}/verify`));
    check(`C4 verify ${id} -> ${st}${code ? '/' + code : ''}`, r.json.status === st && (r.json.errorCode ?? null) === code, JSON.stringify(r.json));
    check(`C5 verify ${id}: key not in response`, !r.text.includes(KEYS[id]));
  }
  // missing key
  await call('DELETE', '/api/admin/ai/providers/groq/key');
  const miss = track(await call('POST', '/api/admin/ai/providers/groq/verify'));
  check('C6 missing key -> unconfigured', miss.json.status === 'unconfigured');

  // test question really calls model
  const t1 = track(await call('POST', '/api/admin/ai/providers/gemini/test', { question: 'مرحبا' }));
  check('C7 test question returns real upstream reply', t1.json.ok === true && t1.json.reply.includes('mock-gemini'));
  const t2 = track(await call('POST', '/api/admin/ai/providers/openai/test', { question: 'مرحبا' }));
  check('C8 test with bad key -> ok=false invalid_key', t2.json.ok === false && t2.json.code === 'invalid_key');

  // validation
  check('C9 bad key format rejected', (await call('PUT', '/api/admin/ai/providers/gemini', { apiKey: 'a b' })).status === 400);
  check('C10 bad model rejected', (await call('PUT', '/api/admin/ai/providers/gemini', { model: 'x; rm -rf /' })).status === 400);
  check('C11 unknown provider 404', (await call('PUT', '/api/admin/ai/providers/nope', { apiKey: 'good-12345678' })).status === 404);

  // ---- D. at-rest storage ----
  const secretsRaw = fs.readFileSync(path.join(dataDir, 'ai-secrets.json'), 'utf8');
  check('D1 secrets file contains no plaintext keys', !Object.values(KEYS).some((k) => secretsRaw.includes(k)));
  const settingsRaw = fs.readFileSync(path.join(dataDir, 'ai-settings.json'), 'utf8');
  check('D2 settings file contains no plaintext keys', !Object.values(KEYS).some((k) => settingsRaw.includes(k)));
  const mode = fs.statSync(path.join(dataDir, 'ai-secrets.json')).mode & 0o777;
  check('D3 secrets file mode is 600', mode === 0o600, mode.toString(8));

  // ---- E. real chat + fallback ----
  await call('PUT', '/api/admin/ai/settings', { defaultProvider: 'openai', fallbackEnabled: true }); // openai has bad key
  const fb = track(await call('POST', '/api/assistant', { message: 'سؤال', history: [{ role: 'user', content: 'سابق' }] }, null));
  check('E1 fallback used after primary failure', fb.json.isLiveAI === true && fb.json.fallbackUsed === true);
  check('E2 response names the provider actually used', /Google Gemini/.test(fb.json.source) && /بديل/.test(fb.json.source), fb.json.source);
  check('E3 reply text came from upstream', String(fb.json.reply).includes('mock-gemini'));
  check('E4 attempts list records the failed primary', fb.json.attempts?.[0]?.provider === 'openai' && fb.json.attempts[0].code === 'invalid_key');
  await call('PUT', '/api/admin/ai/settings', { fallbackEnabled: false });
  const nofb = track(await call('POST', '/api/assistant', { message: 'سؤال' }, null));
  check('E5 fallback disabled -> not live, honest label', nofb.json.isLiveAI === false && /ليس من نموذج/.test(nofb.json.source));
  await call('PUT', '/api/admin/ai/settings', { defaultProvider: 'gemini', fallbackEnabled: true });
  const ok = track(await call('POST', '/api/assistant', { message: 'سؤال' }, null));
  check('E6 default provider answers live', ok.json.isLiveAI === true && ok.json.fallbackUsed === false && /Google Gemini/.test(ok.json.source));
  await call('PUT', '/api/admin/ai/providers/gemini', { apiKey: 'bad-gemini-KEY-9999' });
  await call('DELETE', '/api/admin/ai/providers/anthropic/key');
  await call('DELETE', '/api/admin/ai/providers/deepseek/key');
  await call('DELETE', '/api/admin/ai/providers/openai/key');
  const allBad = track(await call('POST', '/api/assistant', { message: 'سؤال' }, null));
  check('E7 all providers failing -> not live + attempts', allBad.json.isLiveAI === false && allBad.json.attempts.length >= 1);
  await call('PUT', '/api/admin/ai/providers/gemini', { apiKey: KEYS.gemini });
  await call('PUT', '/api/admin/ai/settings', { defaultProvider: 'gemini' });
  await call('PUT', '/api/admin/ai/providers/gemini', { model: 'gemini-2.5-pro' });

  // ---- F. persistence across restart ----
  await stopApp();
  await startApp();
  const after = track(await call('GET', '/api/admin/ai/providers'));
  const g = after.json.providers.find((p: any) => p.id === 'gemini');
  check('F1 key survives restart (masked)', g.keySource === 'stored' && g.keyMask.endsWith('1111'));
  check('F2 model + default survive restart', g.model === 'gemini-2.5-pro' && after.json.defaultProvider === 'gemini');
  const live = track(await call('POST', '/api/assistant', { message: 'بعد إعادة التشغيل' }, null));
  check('F3 stored encrypted key decrypts and works after restart', live.json.isLiveAI === true);

  // ---- G. leaks ----
  const everyKey = [...Object.values(KEYS), 'bad-gemini-KEY-9999'];
  check('G1 no key in any HTTP response body', !allBodies.some((b) => everyKey.some((k) => b.includes(k))));
  check('G2 no key in server logs', !everyKey.some((k) => logs.includes(k)));
  const distText = fs
    .readdirSync('dist/assets')
    .map((f) => fs.readFileSync(path.join('dist/assets', f), 'utf8'))
    .join('');
  check('G3 no key in built browser bundle', !everyKey.some((k) => distText.includes(k)));

  // ---- H. env key source ----
  await stopApp();
  await startApp({ OPENAI_API_KEY: 'good-openai-ENV-7777' });
  const envView = track(await call('GET', '/api/admin/ai/providers'));
  const o = envView.json.providers.find((p: any) => p.id === 'openai');
  check('H1 env key recognised as env source (masked)', o.keySource === 'env' && o.keyMask.endsWith('7777'), JSON.stringify(o));
  const ev = track(await call('POST', '/api/admin/ai/providers/openai/verify'));
  check('H2 env key verifies against upstream', ev.json.status === 'connected');

  // ---- I. no encryption secret -> UI save refused; no admin token -> disabled ----
  await stopApp();
  await startApp({ AI_SECRETS_ENCRYPTION_KEY: '' });
  const noenc = await call('PUT', '/api/admin/ai/providers/groq', { apiKey: 'good-groq-NOENC-8888' });
  check('I1 save refused without encryption secret', noenc.status === 400 && noenc.json.error === 'encryption_key_missing');
  await stopApp();
  await startApp({}, false);
  const noadm = await call('GET', '/api/admin/ai/providers', undefined, 'anything-at-all-123');
  check('I2 admin API disabled (503) without ADMIN_TOKEN', noadm.status === 503, String(noadm.status));
  await stopApp();

  mock.close();
  console.log(results.join('\n'));
  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed ? 1 : 0);
}

main().catch(async (e) => {
  console.error(e);
  await stopApp();
  mock.close();
  process.exit(2);
});
