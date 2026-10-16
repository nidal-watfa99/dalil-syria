import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { registerAiRoutes, runChat } from './server/aiRoutes';
import { DEVELOPER_EMAIL } from './src/config';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '100kb' }));
registerAiRoutes(app);

// 1. Assistant API Endpoint
app.post('/api/assistant', async (req: Request, res: Response) => {
  const { message, history } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  // System Prompt tailored to Syrian governmental affairs
  const systemPrompt = `أنت المساعد الذكي الرسمي لتطبيق "DALIL SYRIA | دليل سوريا — إصدار 2026".
أنت خبير إداري وقانوني في شؤون المعاملات الحكومية السورية، والوزارات والمحافظات الأربع عشرة، والتقسيم الإداري، والرسوم والأسعار، والنقل البري والبحري والسكك الحديدية، والتأشيرات والطيران، وإجراءات اللجوء ومكافحة الاحتيال.

قواعد الإجابة الإلزامية:
1. أجب باللغة العربية الفصحى السلسة والمحترمة مع ترقيم الخطوات وتنظيم الشروط والوثائق.
2. فرّق دائماً بين الرسوم الرسمية المعتمدة لعام 2026 (بالليرة السورية أو الدولار للبدل والقنصليات) وبين أتعاب المكاتب والتقديرات.
3. اذكر اسم الوزارة والمديرية والفرع ومكان التقديم (مراكز خدمة المواطن) ومدة الإنجاز.
4. إذا سُئلت عن معاملة أو معلومة غير مؤكدة أو متوقفة، صرّح بوضوح بأن المعلومة غير متحقق منها أو تحتاج إلى مراجعة الفرع المختص، ولا تختلق أي رسوم أو شروط وهمية.
5. في قضايا التأشيرات واللجوء: حذّر دائماً من السماسرة وشبكات الاحتيال، وأكّد أن قرارات القبول سيادية أو محصورة بالمفوضية السامية أو السفارات الرسمية.
6. اذكر تاريخ التحقق ومصدر المعلومة إن وجد.`;

  // Real AI through the unified provider layer (default provider first, then configured fallbacks).
  const safeHistory = Array.isArray(history)
    ? history
        .filter((h: any) => h && (h.role === 'user' || h.role === 'assistant') && typeof h.content === 'string')
        .slice(-6)
        .map((h: any) => ({ role: h.role, content: String(h.content).slice(0, 4000) }))
    : [];
  const result = await runChat(systemPrompt, message.slice(0, 4000), safeHistory);
  if (result.ok) {
    return res.json({
      reply: result.reply,
      source: `${result.providerName} · ${result.model}${result.fallbackUsed ? ' (مزود بديل بعد فشل المزود الأساسي)' : ''}`,
      isLiveAI: true,
      provider: result.provider,
      model: result.model,
      fallbackUsed: !!result.fallbackUsed,
      attempts: result.attempts,
      timestamp: new Date().toISOString(),
    });
  }
  const aiAttempts = result.attempts;

  // Grounded Local AI Reasoning Fallback
  const q = message.toLowerCase();
  let fallbackReply = '';

  if (q.includes('جواز') || q.includes('سفر')) {
    fallbackReply = `📄 **جواز السفر السوري (إصدار 2026):**

1. **الأنواع المتاحة:**
   - **الدور العادي (عبر المنصة):** الرسوم 312,000 ل.س، المدة من 15 إلى 30 يوم عمل.
   - **الجواز الفوري المستعجل:** الرسوم 4,000,000 ل.س، المدة من 24 إلى 48 ساعة من تاريخ التبصيم.
2. **الوثائق المطلوبة:**
   - البطاقة الشخصية الأصلية سارية وصورة عنها.
   - الجواز القديم إن وجد.
   - موافقة شعبة التجنيد الأصلية للمكلفين (صالحة لـ 3 أشهر).
   - موافقة الولي الشرعي للقاصرين دون 18 عاماً.
   - إشعار التسديد الإلكتروني عبر الحساب البنكي.
3. **مكان التقديم:** فروع إدارة الهجرة والجوازات بالمحافظات بعد الحجز عبر منصة (epassport.syria.gov.sy).`;
  } else if (q.includes('غير محكوم') || q.includes('لا حكم عليه') || q.includes('عدلي')) {
    fallbackReply = `⚖️ **وثيقة غير محكوم (خلاصة السجل العدلي):**

- **الرسم الرسمي (2026):** 15,000 ل.س شاملة الطوابع في مراكز خدمة المواطن وفروع الأمن الجنائي.
- **المدة:** فورية (10 إلى 15 دقيقة).
- **الوثائق:** البطاقة الشخصية الأصلية، أو وكالة عدلية خاصة بالاستخراج في حال حضور الوكيل.
- **الصلاحية:** 3 أشهر للاستخدام المحلي، وتتطلب تصديق الخارجية للاستخدام خارج القطر.`;
  } else if (q.includes('تاكسي') || q.includes('أجرة') || q.includes('تكسي') || q.includes('عداد')) {
    fallbackReply = `🚖 **تعرفة سيارات الأجرة العمومية (التاكسي) لعام 2026:**

- **التعرفة الرسمية المعتمدة بدمشق:**
  - فتحة العداد: 3,000 ل.س.
  - سعر الكيلومتر المقطوع: 3,500 ل.س.
  - ساعة الانتظار الرسمية: 15,000 ل.س.
- **تكسي المطار:** يتراوح السعر التقديري بين 180,000 و250,000 ل.س حسب وقت الرحلة ونقطة الانطلاق في دمشق.
- **تكسي دمشق - بيروت:** 70$ إلى 100$ للسيارة السياحية الكاملة عبر كراج السومرية.`;
  } else if (q.includes('بولمان') || q.includes('نقل') || q.includes('سفر بين') || q.includes('حلب') || q.includes('لاذقية')) {
    fallbackReply = `🚌 **أجور النقل بين المحافظات بالبولمان لعام 2026:**

- **دمشق ⇄ حلب:** 60,000 - 70,000 ل.س (كراج حرستا ⇄ كراج الراموسة).
- **دمشق ⇄ اللاذقية:** 55,000 - 65,000 ل.س (كراج حرستا ⇄ كراج البولمان الموحد).
- **دمشق ⇄ طرطوس:** 45,000 - 55,000 ل.س.
- **دمشق ⇄ حمص:** 30,000 - 40,000 ل.س.
- **قطار الساحل (اللاذقية ⇄ طرطوس):** 5,000 ل.س بتسعيرة مدعومة عبر المؤسسة العامة للخطوط الحديدية السورية.`;
  } else if (q.includes('لجوء') || q.includes('هجرة') || q.includes('ألمانيا') || q.includes('كندا') || q.includes('شمل')) {
    fallbackReply = `🌐 **إجراءات اللجوء والهجرة ولمّ الشمل والتحذير من الاحتيال:**

1. **المفوضية السامية (UNHCR):** التسجيل وإعادة التوطين مجاني تماماً 100%. لا يمكن لأي وسيط تسريع الملف أو بيع موعد.
2. **لمّ الشمل إلى ألمانيا:** يقدم عبر بوابة السفارة الألمانية الرسمية ويشترط عقد زواج مصدق وشهادات ميلاد وبيان قيد رسمي مترجم ومصدق بالخارجية.
3. **الكفالة الكندية (PSR):** تتطلب خمسة مواطنين كنديين كافلين دون أي مقابل مالي يُدفع من المستفيد.
⚠️ **تنبيه حاسم:** تجنب التعامل مع أي شخص أو صفحة تدعي بيع تأشيرات لجوء أو تسهيل عبور غير شرعي تفادياً للملاحقة الجنائية وخطر الاحتيال.`;
  } else {
    fallbackReply = `مرحباً بك في دليل سوريا. سؤالك حول "${message}":
يمكنك تصفح أقسام التطبيق:
- **معاملاتي الشامل:** لكافة الشروط والأوراق والرسوم والمراكز الحكومية.
- **الأسعار والرسوم:** لمعرفة التعرفة الرسمية الصادرة لعام 2026.
- **النقل والمحافظات:** لمعرفة مسارات البولمان، السرافيس، قطارات الساحل، والمطارات.
- **الخريطة التفاعلية:** للوصول إلى أقرب مركز خدمة مواطن أو فرع هجرة وجوازات.
*(هذا الرد ثابت من قاعدة بيانات التطبيق وليس صادراً عن نموذج ذكاء اصطناعي. لتفعيل الرد الحي أضف مفتاح مزود من «إعدادات الذكاء الاصطناعي».)*`;
  }

  return res.json({
    reply: fallbackReply,
    source: 'رد ثابت محلي — ليس من نموذج ذكاء اصطناعي',
    isLiveAI: false,
    attempts: aiAttempts,
    timestamp: new Date().toISOString(),
  });
});

// 2. Ministry Portal Connectivity Check Endpoint — real probes (HEAD, 6s timeout), no static values.
const MINISTRY_PORTALS = [
  { id: 'moi', name: 'وزارة الداخلية', url: 'https://syriamoi.gov.sy' },
  { id: 'moj', name: 'وزارة العدل', url: 'https://moj.gov.sy' },
  { id: 'mola', name: 'وزارة الإدارة المحلية والبيئة', url: 'https://mola.gov.sy' },
  { id: 'mofa', name: 'وزارة الخارجية والمغتربين', url: 'https://mofaex.gov.sy' },
  { id: 'mot', name: 'وزارة النقل', url: 'https://mot.gov.sy' },
  { id: 'ecsc', name: 'منظومة مراكز خدمة المواطن الإلكترونية', url: 'https://ecsc.gov.sy' },
  { id: 'epassport', name: 'منصة حجز الجوازات السورية', url: 'https://epassport.syria.gov.sy' },
];

async function probe(url: string) {
  const started = Date.now();
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 6000);
  try {
    const r = await fetch(url, { method: 'HEAD', signal: ctrl.signal, redirect: 'follow' });
    return { reachable: true, httpStatus: r.status, latencyMs: Date.now() - started };
  } catch (e: any) {
    return { reachable: false, httpStatus: null, latencyMs: null, error: e?.name === 'AbortError' ? 'timeout' : 'unreachable' };
  } finally {
    clearTimeout(timer);
  }
}

app.get('/api/ministry-status', async (_req: Request, res: Response) => {
  const checkedAt = new Date().toISOString();
  const items = await Promise.all(
    MINISTRY_PORTALS.map(async (m) => {
      const p = await probe(m.url);
      return {
        ...m,
        status: p.reachable ? 'متصل' : p.error === 'timeout' ? 'انتهت المهلة' : 'تعذر الوصول',
        latency: p.latencyMs != null ? `${p.latencyMs}ms` : null,
        httpStatus: p.httpStatus,
        lastCheck: checkedAt,
      };
    })
  );
  res.json({ timestamp: checkedAt, items });
});

// 3. User Feedback & Bug Report Endpoint
app.post('/api/feedback', (req: Request, res: Response) => {
  const { type, name, email, subject, message, technicalLogs } = req.body;

  if (!message || !type) {
    return res.status(400).json({ error: 'نوع البلاغ ونص الرسالة مطلوبان' });
  }

  console.log(`[DALIL SYRIA FEEDBACK] Type: ${type} | Subject: ${subject} | From: ${email || 'Anonymous'}`);
  // In a real database this persists; here we confirm receipt with a tracking code
  const ticketId = 'SYR-' + Math.floor(100000 + Math.random() * 900000);

  res.json({
    success: true,
    ticketId,
    developerEmail: DEVELOPER_EMAIL,
    message: 'تم تسجيل بلاغك في سجل الخادم فقط (لا يُرسل تلقائياً إلى بريد المطور). لإيصاله للمطور استخدم زر «فتح تطبيق البريد المباشر».',
  });
});

// Configure Vite in development or serve static in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`[DALIL SYRIA] Server listening on port ${PORT}`);
  });
}

startServer();
