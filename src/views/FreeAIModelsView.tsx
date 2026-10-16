import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  ExternalLink,
  Bot,
  Zap,
  Search,
  CheckCircle2,
  Key,
  Globe,
  ShieldCheck,
  Cpu,
  Layers,
  ArrowUpRight,
  Info,
} from 'lucide-react';
import { FREE_AI_MODELS_DATA, AIModelInfo } from '../data/aiModels';

export const FreeAIModelsView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: 'كافة النماذج والمنصات' },
    { id: 'محادثة ويب مجانية مباشرة', label: 'محادثة ويب مباشرة (دون برمجة)' },
    { id: 'محرك بحث واستدلال بالذكاء الاصطناعي', label: 'محركات بحث ذكية وموثقة' },
    { id: 'واجهة برمجية للمطورين (API)', label: 'واجهات برمجية للمطورين (API)' },
  ];

  const filteredModels = useMemo(() => {
    return FREE_AI_MODELS_DATA.filter((m) => {
      const matchCat = selectedCategory === 'all' || m.category === selectedCategory;
      const matchSearch =
        !searchQuery.trim() ||
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.keyFeatures.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="space-y-6 animate-fadeIn text-right">
      {/* Header card with Google AI Studio styling */}
      <div className="p-6 rounded-3xl bg-[#1e1f20] border border-[#333537] shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-[#1a73e8]/20 text-[#a8c7fa] border border-[#1a73e8]/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                نماذج وأدوات الذكاء الاصطناعي المجانية الرسمية
              </span>
              <span className="text-xs text-[#c4c7c5]">
                روابط أصلية وموثقة 100%
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#e3e3e3]">
              فهرس نماذج الذكاء الاصطناعي العالمية المجانية
            </h1>
            <p className="text-xs sm:text-sm text-[#c4c7c5] mt-1 max-w-3xl leading-relaxed">
              دليل شامل وموثق يضم أقوى نماذج الذكاء الاصطناعي التوليدي ومحركات البحث وواجهات المطورين المتاحة مجاناً بروابطها الرسمية المباشرة وحصص الاستخدام المجانية وشروط الوصول.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="px-4 py-2.5 rounded-2xl bg-[#282a2c] border border-[#3c4043] text-center">
              <span className="text-[10px] text-[#8e918f] block">إجمالي النماذج المتاحة</span>
              <span className="text-lg font-black text-[#a8c7fa]">{FREE_AI_MODELS_DATA.length} منصة</span>
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-[#282a2c] border border-[#3c4043] text-center">
              <span className="text-[10px] text-[#8e918f] block">رسوم الاستخدام</span>
              <span className="text-lg font-black text-emerald-400">0$ مجاني</span>
            </div>
          </div>
        </div>
      </div>

      {/* Advice Note for Users in Syria */}
      <div className="p-4 rounded-2xl bg-[#282a2c] border border-[#3c4043] flex items-start gap-3 text-xs leading-relaxed">
        <Info className="w-5 h-5 text-[#a8c7fa] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-white block font-bold">
            ملاحظة إرشادية للمستخدمين داخل سوريا:
          </strong>
          <p className="text-[#c4c7c5]">
            بعض الخدمات العالمية (مثل Google AI Studio أو ChatGPT أو Claude) قد تتطلب اتصالاً سريعاً أو استخدام بروتوكول وكيل (VPN/DNS) للتسجيل الأولي، بينما نماذج مثل <strong>DuckDuckGo AI Chat</strong> و <strong>DeepSeek</strong> و <strong>HuggingChat</strong> تعمل بسلاسة ومباشرة وتدعم اللغة العربية بكفاءة عالية.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#1e1f20] border border-[#333537] space-y-3">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث باسم النموذج أو المزود (مثال: Gemini, DeepSeek, ChatGPT, Claude, Groq)..."
            className="w-full rounded-xl bg-[#282a2c] border border-[#3c4043] pr-10 pl-4 py-2.5 text-xs sm:text-sm text-white placeholder-[#8e918f] focus:outline-none focus:border-[#1a73e8]"
          />
          <Search className="absolute right-3.5 top-3 w-4 h-4 text-[#8e918f] pointer-events-none" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute left-3 top-2 text-xs text-[#8e918f] hover:text-white bg-[#333537] px-2 py-0.5 rounded"
            >
              مسح
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#333537]">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedCategory === cat.id
                  ? 'bg-[#1a73e8] text-white shadow-sm'
                  : 'bg-[#282a2c] text-[#c4c7c5] hover:text-white border border-[#3c4043]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Models Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredModels.map((model) => (
          <div
            key={model.id}
            className={`flex flex-col justify-between rounded-2xl bg-[#1e1f20] hover:bg-[#282a2c] border ${
              model.isCurrentDefault ? 'border-[#1a73e8]' : 'border-[#333537]'
            } hover:border-[#a8c7fa]/60 p-5 shadow-lg transition-all duration-200`}
          >
            <div>
              {/* Header Badges */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-[#282a2c] text-[#a8c7fa] border border-[#3c4043]">
                  {model.provider}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  {model.category}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-base font-bold text-white mb-1 flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-[#a8c7fa]" />
                {model.name}
              </h3>
              <p className="text-xs text-[#c4c7c5] leading-relaxed mb-3">
                {model.description}
              </p>

              {/* Free Tier Limits */}
              <div className="p-2.5 rounded-xl bg-[#282a2c] border border-[#333537] mb-3 space-y-1">
                <div className="flex items-center gap-1 text-[11px] font-bold text-amber-300">
                  <Zap className="w-3.5 h-3.5" />
                  <span>الحصة المجانية الرسمية:</span>
                </div>
                <p className="text-[11px] text-[#e3e3e3] leading-relaxed">
                  {model.freeTierLimits}
                </p>
              </div>

              {/* Requirements & Arabic Support */}
              <div className="space-y-1.5 text-xs text-[#c4c7c5] mb-3">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#8e918f]">مستوى دعم العربية:</span>
                  <span className="font-bold text-emerald-400">{model.arabicSupportLevel}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#8e918f]">شروط الاستخدام:</span>
                  <span className="text-[#e3e3e3] font-medium truncate max-w-[170px]" title={model.accessRequirements}>
                    {model.accessRequirements}
                  </span>
                </div>
              </div>

              {/* Key Features List */}
              <div className="space-y-1 border-t border-[#333537] pt-2 mb-3">
                <span className="text-[10px] font-bold text-[#8e918f] block mb-1">
                  الميزات الأساسية:
                </span>
                {model.keyFeatures.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-[11px] text-[#c4c7c5]">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-[#333537] flex items-center gap-2">
              <a
                href={model.officialWebUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#1a73e8] hover:bg-[#1b66c9] text-xs font-bold text-white transition shadow-sm"
              >
                <span>الدخول للمنصة الرسمية</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>

              {model.officialDocsUrl && (
                <a
                  href={model.officialDocsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-[#282a2c] text-[#c4c7c5] hover:text-white hover:bg-[#333537] border border-[#3c4043] transition"
                  title="المستندات الرسمية"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
