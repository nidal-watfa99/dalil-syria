import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // API: Health Check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      app: 'دليل سوريا | DALIL SYRIA',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
    });
  });

  // Direct Download Route for Full Source ZIP
  app.get('/dalil-syria-complete-source.zip', (req, res) => {
    const zipPath = path.resolve(__dirname, 'public', 'dalil-syria-complete-source.zip');
    if (fs.existsSync(zipPath)) {
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename="dalil-syria-complete-source.zip"');
      res.sendFile(zipPath);
    } else {
      res.status(404).send('Archive not found');
    }
  });

  // API: Feedback ingestion
  app.post('/api/feedback', (req, res) => {
    const report = req.body;
    console.log('[DalilSyria Server] Received inaccuracy report:', report);
    res.status(200).json({ success: true, message: 'Report logged successfully' });
  });

  // API: Diagnostics telemetry
  app.post('/api/diagnostics', (req, res) => {
    const diag = req.body;
    console.log('[DalilSyria Server] Diagnostics event:', diag);
    res.status(200).json({ success: true });
  });

  // API: Optional Server-Side Gemini Assistant Proxy
  app.post('/api/ai/assistant', async (req, res) => {
    const { prompt, contextData } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(200).json({
        fallback: true,
        message: 'No GEMINI_API_KEY present; use verified local rule-based database engine.',
      });
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const systemInstruction = `
أنت المساعد القانوني والخدمي الرسمي لمنظومة «دليل سوريا | DALIL SYRIA».
مهمتك: تقديم إجابات دقيقة ومقتضبة للمواطنين حول المعاملات والجهات الرسمية في الجمهورية العربية السورية.
مبدأ صارم جداً:
- ممنوع اختلاق أي معلومة، رسم مالي، جهة، رقم هاتف، أو شرط لم يرد في البيانات الموثقة التالية.
- إذا كانت المعلومة غير موجودة في السياق، صرح بوضوح: «غير متوفر في قاعدة البيانات الموثقة حالياً وبانتظار التحقق من المصدر الرسمي».
- اذكر دائماً الرسوم بالليرة السورية كما وردت، ورقم القانون أو المرسوم وسنوات السريان.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: `${systemInstruction}\n\nبيانات موثقة:\n${JSON.stringify(contextData)}\n\nسؤال المستخدم:\n${prompt}` }] }
        ]
      });

      return res.status(200).json({
        success: true,
        answer: response.text,
      });
    } catch (err: unknown) {
      console.error('[Gemini Proxy Error]', err);
      return res.status(200).json({
        fallback: true,
        message: 'حدث خطأ في الاتصال بنموذج الذكاء الاصطناعي، يتم الاعتماد على الفهرس المحلي.',
      });
    }
  });

  // Mount Vite or serve static production build
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[DalilSyria] Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
