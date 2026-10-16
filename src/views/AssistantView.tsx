import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  User,
  Sparkles,
  Volume2,
  Copy,
  Check,
  AlertCircle,
  Clock,
  ShieldCheck,
  RotateCcw,
  ExternalLink,
  Layers,
  Cpu,
  Zap,
} from 'lucide-react';
import { FREE_AI_MODELS_DATA } from '../data/aiModels';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  source?: string;
  isLiveAI?: boolean;
}

interface AssistantViewProps {
  onSpeak: (text: string) => void;
  onOpenTransactionByName?: (name: string) => void;
  onNavigateToFreeAI?: () => void;
}

export const AssistantView: React.FC<AssistantViewProps> = ({ onSpeak, onNavigateToFreeAI }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: `أهلاً بك في **المساعد الذكي لدليل سوريا (إصدار 2026)**.
أنا هنا لمساعدتك في شرح كافة شروط ورسوم المعاملات الحكومية السورية (مثل حصر الإرث، جوازات السفر، السجل المدني، رخص القيادة)، وتوجيهك إلى مركز خدمة المواطن الأنسب، وشرح تعرفة النقل والأسعار الرسمية لعام 2026.

تفضل بطرح سؤالك مباشرة، أو استعرض قائمة النماذج المجانية المعتمدة من الزر بالأعلى.`,
      timestamp: 'الآن',
      source: 'رسالة ترحيب ثابتة',
      isLiveAI: false,
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showModelsModal, setShowModelsModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [aiStatus, setAiStatus] = useState<{ liveAvailable: boolean; activeProvider: string | null; activeModel: string | null } | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/ai/status')
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => !cancelled && setAiStatus(j))
      .catch(() => !cancelled && setAiStatus(null));
    return () => {
      cancelled = true;
    };
  }, []);

  const quickPrompts = [
    'ما هي شروط وإجراءات معاملة حصر الإرث الشرعي والرسوم؟',
    'ما هي رسوم وشروط جواز السفر العادي والفوري لعام 2026؟',
    'كيف أستخرج وثيقة غير محكوم (لا حكم عليه) ومكان التقديم؟',
    'ما هي تعرفة عداد التاكسي العمومي الرسمية في دمشق؟',
    'كم تبلغ أجور باصات البولمان بين دمشق وحلب واللاذقية؟',
    'ما هي الأوراق المطلوبة لتأجيل خدمة العلم الدراسي؟',
    'كيف أحصل على بيان قيد عقاري طابو أخضر وفراغ عقار؟',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('ar-SY', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-6).map((m) => ({ role: m.sender, content: m.text })),
        }),
      });

      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: 'assistant-' + Date.now(),
        sender: 'assistant',
        text: data.reply || 'تم استلام الاستفسار وسيتم الرد.',
        timestamp: new Date().toLocaleTimeString('ar-SY', { hour: '2-digit', minute: '2-digit' }),
        source: data.source,
        isLiveAI: data.isLiveAI,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: 'err-' + Date.now(),
        sender: 'assistant',
        text: 'تعذر الاتصال بخدمة الذكاء الاصطناعي حالياً. يمكنك استخدام تصفح المعاملات المباشر من قسم "معاملاتي الشامل" في القائمة الجانبية للحصول على أدق البيانات الموثقة دون اتصال.',
        timestamp: new Date().toLocaleTimeString('ar-SY', { hour: '2-digit', minute: '2-digit' }),
        source: 'الذاكرة المحلية للتطبيق',
        isLiveAI: false,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'assistant',
        text: 'تم بدء محادثة جديدة. تفضل بطرح أي سؤال حول المعاملات أو الأسعار أو النقل في سوريا.',
        timestamp: 'الآن',
        source: 'رسالة ثابتة',
        isLiveAI: false,
      },
    ]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] rounded-3xl bg-[#1e1f20] border border-[#333538] shadow-2xl overflow-hidden text-right animate-fadeIn">
      {/* Assistant Header in Google AI Studio Style */}
      <div className="flex items-center justify-between p-4 px-6 border-b border-[#333538] bg-[#18191a]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-[#1a73e8] text-white shadow-md">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-white">المساعد الذكي لمعاملات سوريا</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1a73e8]/20 text-[#8ab4f8] border border-[#1a73e8]/30">
                {aiStatus?.liveAvailable ? `${aiStatus.activeProvider} · ${aiStatus.activeModel}` : 'لا يوجد مزود مُعدّ — ردود محلية ثابتة'}
              </span>
            </div>
            <p className="text-[11px] text-[#c4c7c5]">
              استجابات دقيقة موثقة بالأنظمة والقوانين السورية النافذة لعام 2026
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Models Hub Button */}
          <button
            onClick={() => {
              if (onNavigateToFreeAI) {
                onNavigateToFreeAI();
              } else {
                setShowModelsModal(true);
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#333538] bg-[#282a2c] text-xs font-bold text-[#8ab4f8] hover:bg-[#333538] hover:text-white transition"
            title="استعراض النماذج المجانية والروابط الرسمية"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">فهرس النماذج المجانية الرسمية</span>
          </button>

          <button
            onClick={clearChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#333538] bg-[#282a2c] text-xs text-[#c4c7c5] hover:text-white hover:bg-[#333538] transition"
            title="بدء محادثة جديدة"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">محادثة جديدة</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#131314]">
        {messages.map((msg) => {
          const isAssistant = msg.sender === 'assistant';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                isAssistant ? 'justify-start' : 'justify-end flex-row-reverse'
              }`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                  isAssistant
                    ? 'bg-[#1a73e8] text-white'
                    : 'bg-[#3c4043] text-white'
                }`}
              >
                {isAssistant ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-2xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isAssistant
                    ? 'bg-[#1e1f20] border border-[#333538] text-[#e3e3e3]'
                    : 'bg-[#1a73e8] text-white'
                }`}
              >
                {/* Content formatted with line breaks */}
                <div className="whitespace-pre-line font-normal">{msg.text}</div>

                {/* Footer of message */}
                <div className="mt-2.5 pt-2 border-t border-[#333538] flex flex-wrap items-center justify-between gap-2 text-[10px] text-[#c4c7c5]">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {msg.timestamp}
                    </span>
                    {msg.source && (
                      <span className="text-[#8ab4f8] font-medium truncate max-w-[220px]">
                        {msg.source}
                      </span>
                    )}
                  </div>

                  {isAssistant && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onSpeak(msg.text)}
                        className="p-1 rounded-md hover:bg-[#282a2c] text-[#c4c7c5] hover:text-white transition"
                        title="استماع للإجابة صوتياً"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => copyToClipboard(msg.id, msg.text)}
                        className="p-1 rounded-md hover:bg-[#282a2c] text-[#c4c7c5] hover:text-white transition"
                        title="نسخ النص"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#1a73e8]/30 text-[#8ab4f8]">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-3.5 rounded-2xl bg-[#1e1f20] border border-[#333538] text-xs text-[#c4c7c5] flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#1a73e8] animate-pulse" />
              <span>جاري مطابقة المعاملات والأنظمة السورية لعام 2026 وصياغة الرد...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div className="p-2.5 px-4 bg-[#18191a] border-t border-[#333538] overflow-x-auto scrollbar-none flex items-center gap-2">
        <span className="text-[10px] text-[#c4c7c5] shrink-0 font-semibold flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          مقترحات سريعة:
        </span>
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(p)}
            className="shrink-0 px-3 py-1 rounded-xl bg-[#282a2c] hover:bg-[#333538] text-[11px] text-[#e3e3e3] border border-[#333538] transition"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input box */}
      <div className="p-3.5 sm:p-4 bg-[#1e1f20] border-t border-[#333538]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="اكتب سؤالك هنا (مثال: ما هي أوراق معاملة حصر الإرث، أو رسوم جواز السفر؟)..."
            className="flex-1 rounded-2xl bg-[#131314] border border-[#333538] px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="flex items-center justify-center h-10 w-10 sm:w-11 sm:h-11 rounded-2xl bg-[#1a73e8] hover:bg-[#1b66c9] text-white shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition active:scale-95 shrink-0"
            title="إرسال"
          >
            <Send className="w-4 h-4 rotate-180" />
          </button>
        </form>
        <div className="flex items-center justify-between text-[10px] text-[#c4c7c5] mt-2 px-1">
          <span>إجابات النموذج استرشادية مستندة للأنظمة والقوانين السورية لعام 2026.</span>
          <span>لا تعتبر بديلاً عن المراجعة القانونية للجهات الرسمية.</span>
        </div>
      </div>

      {/* Free AI Models & Official Docs Modal */}
      {showModelsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl max-h-[85vh] rounded-3xl bg-[#1e1f20] border border-[#333538] p-6 shadow-2xl text-right overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#333538]">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold text-white">
                  نماذج الذكاء الاصطناعي المجانية المعتمدة وروابطها الرسمية
                </h3>
              </div>
              <button
                onClick={() => setShowModelsModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#c4c7c5] leading-relaxed">
              استناداً لمتطلبات المشروع، تم حصر ودراسة نماذج الذكاء الاصطناعي ذات الخطط المجانية الرسمية الأقوى في دعم اللغة العربية وفهم القوانين:
            </p>

            <div className="space-y-3.5">
              {FREE_AI_MODELS_DATA.map((model) => (
                <div
                  key={model.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    model.isCurrentDefault
                      ? 'bg-[#282a2c] border-blue-500 shadow-md'
                      : 'bg-[#282a2c]/60 border-[#333538]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{model.name}</h4>
                      {model.isCurrentDefault && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#1a73e8] text-white">
                          النموذج النشط بالتطبيق
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      {model.arabicSupportLevel}
                    </span>
                  </div>

                  <p className="text-xs text-[#c4c7c5] mb-2 leading-relaxed">{model.description}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] mb-3">
                    <div className="p-2 rounded-xl bg-[#131314] text-slate-300">
                      <strong className="text-amber-400 block">الحدود والحصة المجانية:</strong>
                      <span>{model.freeTierLimits}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-[#131314] text-slate-300">
                      <strong className="text-blue-400 block">شروط الاستخدام والوصول:</strong>
                      <span>{model.accessRequirements}</span>
                    </div>
                  </div>

                  {/* Official Verified Links */}
                  <div className="pt-2 border-t border-[#333538] flex flex-wrap items-center gap-3">
                    <a
                      href={model.officialWebUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-[#8ab4f8] hover:underline font-bold"
                    >
                      <span>رابط المنصة الرسمي (Official Web)</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    {model.officialDocsUrl && (
                      <a
                        href={model.officialDocsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-[#c4c7c5] hover:underline"
                      >
                        <span>التوثيق الرسمي (Docs)</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#333538] flex justify-end">
              <button
                onClick={() => setShowModelsModal(false)}
                className="px-5 py-2 rounded-xl bg-[#1a73e8] text-xs font-bold text-white hover:bg-[#1b66c9] transition"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
