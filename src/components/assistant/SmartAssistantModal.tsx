import React, { useState } from 'react';
import {
  X,
  Bot,
  Send,
  Sparkles,
  MapPin,
  FileText,
  Bus,
  Globe,
  ChevronLeft,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  PhoneCall,
  Coins
} from 'lucide-react';
import { Transaction, Authority, TransportFare, VisaGuide } from '../../types';
import { queryAssistantKnowledge, EMERGENCY_NUMBERS } from '../../utils/assistantKnowledgeEngine';
import { logDiagnostic } from '../../utils/storageAndLogs';
import { VoiceSearchButton } from '../common/VoiceSearchButton';

interface SmartAssistantModalProps {
  onClose: () => void;
  onOpenTransaction: (tx: Transaction) => void;
  onOpenMap: (authorityId?: string) => void;
}

interface AssistantMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  matchedTransaction?: Transaction;
  matchedAuthorities?: Authority[];
  matchedTransportFares?: TransportFare[];
  matchedVisas?: VisaGuide[];
  suggestedPrompts?: string[];
  timestamp: string;
}

export const SmartAssistantModal: React.FC<SmartAssistantModalProps> = ({
  onClose,
  onOpenTransaction,
  onOpenMap,
}) => {
  const [inputQuery, setInputQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'أهلاً بك في المساعد الذكي لدليل سوريا.\nأنا مبرمج بشكل شامل مع كل تفاصيل التطبيق: المعاملات الحكومية الـ 20، الأوراق المطلوبة، الرسوم الموثقة بالمراسيم، الخرائط الجغرافية ومواقع الدوائر، أجور النقل بالبولمان، التأشيرات الدولية، وأرقام الطوارئ.\n\nتفضل بسؤالي عن أي شيء وسأجيبك بتفاصيل كاملة وموثقة.',
      suggestedPrompts: [
        'أريد استخراج جواز سفر في طرطوس',
        'ما هي أوراق ورسوم غير محكوم؟',
        'أجور البولمان من دمشق إلى حلب',
        'شروط ورسوم بدل الخدمة العسكرية للمغترب',
        'أرقام الطوارئ والإسعاف في سورية',
        'إجراءات ورسوم فراغ عقار سكني',
      ],
      timestamp: new Date().toLocaleTimeString('ar-SY', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const handleSend = async (queryText?: string) => {
    const textToSend = (queryText || inputQuery).trim();
    if (!textToSend || isProcessing) return;

    const userMsg: AssistantMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('ar-SY', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsProcessing(true);

    try {
      // 1. Process query with Universal Knowledge Engine
      const localResult = await queryAssistantKnowledge(textToSend);

      let finalReplyText = localResult.replyText;

      // 2. Attempt server-side Gemini enhancement if backend endpoint is accessible
      try {
        const response = await fetch('/api/ai/assistant', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: textToSend,
            contextData: {
              localKnowledge: localResult.replyText,
              matchedTransaction: localResult.matchedTransaction,
              emergencyNumbers: EMERGENCY_NUMBERS,
            },
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.answer) {
            finalReplyText = data.answer;
            logDiagnostic('info', 'SmartAssistant', 'Enhanced response via server Gemini proxy');
          }
        }
      } catch {
        // Graceful fallback to verified local engine
        logDiagnostic('info', 'SmartAssistant', 'Answered using local verified knowledge engine');
      }

      // Small natural settling delay
      await new Promise((r) => setTimeout(r, 250));

      const assistantMsg: AssistantMessage = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text: finalReplyText,
        matchedTransaction: localResult.matchedTransaction,
        matchedAuthorities: localResult.matchedAuthorities,
        matchedTransportFares: localResult.matchedTransportFares,
        matchedVisas: localResult.matchedVisas,
        suggestedPrompts: localResult.suggestedFollowUps,
        timestamp: new Date().toLocaleTimeString('ar-SY', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      logDiagnostic('error', 'SmartAssistant', 'Assistant processing error', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `asst-err-${Date.now()}`,
          sender: 'assistant',
          text: 'عذراً، حدث خطأ غير متوقع. يرجى إعادة صياغة السؤال.',
          timestamp: new Date().toLocaleTimeString('ar-SY', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 md:p-6 overflow-hidden">
      <div className="w-full max-w-3xl h-[88vh] glass-panel rounded-2xl border border-slate-700/80 shadow-2xl flex flex-col overflow-hidden text-slate-100 animate-fade-in">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center shadow-sm">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm md:text-base text-white flex items-center gap-2">
                <span>المساعد الذكي الشامل لدليل سوريا</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/90 text-emerald-300 border border-emerald-700/50">
                  تغطية كاملة لكافة الخدمات
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                إجابات شاملة وموثقة بالقوانين والمراسيم السورية لجميع المعاملات والنقل والخرائط
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5 text-xs md:text-sm">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[92%] p-4 rounded-2xl whitespace-pre-line leading-relaxed shadow-lg ${
                  msg.sender === 'user'
                    ? 'bg-amber-500 text-slate-950 font-medium rounded-bl-sm'
                    : 'bg-slate-900/95 border border-slate-800 text-slate-200 rounded-br-sm'
                }`}
              >
                {msg.text}

                {/* Attachment: Matched Transaction */}
                {msg.matchedTransaction && (
                  <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
                    <div className="p-3 rounded-xl bg-slate-950/70 border border-amber-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] text-amber-400 font-bold block">دليل المعاملة الرسمي الموثق</span>
                        <h4 className="font-bold text-white text-xs md:text-sm">{msg.matchedTransaction.titleAr}</h4>
                        <span className="text-[11px] text-slate-400">{msg.matchedTransaction.responsibleAuthority}</span>
                      </div>
                      <button
                        onClick={() => {
                          onClose();
                          onOpenTransaction(msg.matchedTransaction!);
                        }}
                        className="py-1.5 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-sm whitespace-nowrap"
                      >
                        <span>فتح الدليل وقائمة الأوراق</span>
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Attachment: Matched Transport Fares */}
                {msg.matchedTransportFares && msg.matchedTransportFares.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2">
                    <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                      <Bus className="w-3.5 h-3.5" />
                      <span>خطوط النقل البري ذات الصلة:</span>
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {msg.matchedTransportFares.map((f) => (
                        <div key={f.id} className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800 text-xs">
                          <strong className="text-white block">{f.routeNameAr}</strong>
                          <span className="text-amber-300 font-mono font-bold block mt-0.5">
                            {f.officialTariffSyp.toLocaleString('ar-SY')} ل.س ({f.serviceClass})
                          </span>
                          <span className="text-[10px] text-slate-400">من {f.departureStation}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Attachment: Matched Authorities & Maps */}
                {msg.matchedAuthorities && msg.matchedAuthorities.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1.5">
                    <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>المواقع والدوائر الحكومية على الخريطة:</span>
                    </span>
                    {msg.matchedAuthorities.map((auth) => (
                      <button
                        key={auth.id}
                        onClick={() => {
                          onClose();
                          onOpenMap(auth.id);
                        }}
                        className="w-full text-right p-2.5 rounded-lg bg-slate-950/60 hover:bg-slate-950 border border-slate-800 flex items-center justify-between text-xs text-slate-200 transition-colors"
                      >
                        <div>
                          <strong className="text-white block">{auth.nameAr}</strong>
                          <span className="text-[10px] text-slate-400">{auth.address} · الهاتف: {auth.phone}</span>
                        </div>
                        <span className="text-[11px] text-amber-400 flex items-center gap-1 font-semibold shrink-0">
                          <MapPin className="w-3.5 h-3.5" />
                          عرض بالخريطة
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Suggested Follow-up Prompts */}
              {msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2.5 mr-2">
                  {msg.suggestedPrompts.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(p)}
                      className="text-[11px] py-1 px-3 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors shadow-sm"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}

              <span className="text-[10px] text-slate-500 mt-1 px-1 font-mono">{msg.timestamp}</span>
            </div>
          ))}

          {isProcessing && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 text-xs w-fit shadow-md">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
              <span>جارٍ التدقيق في القوانين والمراسيم السورية والمواقع الجغرافية...</span>
            </div>
          )}
        </div>

        {/* Bottom Input Area */}
        <div className="p-3 md:p-4 border-t border-slate-800 bg-slate-900/90">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="اسألني عن أي معاملة، رسوم، أوراق، مراكز، بولمان، تأشيرات، أو تحدث بالصوت..."
              disabled={isProcessing}
              className="flex-1 py-3 px-4 text-xs md:text-sm rounded-xl recessed-field text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 shadow-inner"
            />
            
            {/* Voice Search Button */}
            <VoiceSearchButton
              onTranscript={(voiceText) => {
                setInputQuery(voiceText);
                handleSend(voiceText);
              }}
            />

            <button
              type="submit"
              disabled={isProcessing || !inputQuery.trim()}
              className="p-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
              title="إرسال السؤال"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
