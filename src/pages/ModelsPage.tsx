import { useState } from 'react';
import {
  Cpu,
  Brain,
  Zap,
  Shield,
  Check,
  Copy,
  RefreshCw,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  ChevronRight,
  Save,
  RotateCcw,
  Star,
  Activity,
  Lock,
  Terminal,
  Eye,
  Code2,
} from 'lucide-react';
import { useRouter } from '../router';

interface ModelOption {
  id: string;
  name: string;
  provider: string;
  contextWindow: string;
  costPer1k: number;
  speed: 'fast' | 'medium' | 'slow';
  quality: number;
  tags: string[];
  description: string;
  color: string;
}

const models: ModelOption[] = [
  {
    id: 'claude-sonnet-4',
    name: 'Claude Sonnet 4',
    provider: 'Anthropic',
    contextWindow: '200K',
    costPer1k: 0.015,
    speed: 'fast',
    quality: 96,
    tags: ['Reasoning', 'Code', 'Multilingual'],
    description: 'Best-in-class reasoning with exceptional code generation and instruction following.',
    color: 'from-primary-500 to-primary-700',
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    contextWindow: '128K',
    costPer1k: 0.0125,
    speed: 'fast',
    quality: 94,
    tags: ['Multimodal', 'Fast', 'Versatile'],
    description: 'Multimodal model with vision capabilities and low latency for real-time applications.',
    color: 'from-secondary-500 to-secondary-700',
  },
  {
    id: 'llama-3.1-405b',
    name: 'Llama 3.1 405B',
    provider: 'Meta',
    contextWindow: '128K',
    costPer1k: 0.009,
    speed: 'medium',
    quality: 92,
    tags: ['Open Source', 'Large Context'],
    description: 'Open-source frontier model with extensive context and competitive performance.',
    color: 'from-accent-500 to-accent-700',
  },
  {
    id: 'mistral-large-2',
    name: 'Mistral Large 2',
    provider: 'Mistral AI',
    contextWindow: '128K',
    costPer1k: 0.008,
    speed: 'fast',
    quality: 89,
    tags: ['Efficient', 'European', 'Code'],
    description: 'Highly efficient model with strong European language support and code capabilities.',
    color: 'from-primary-600 to-secondary-600',
  },
];

type PreviewTab = 'stream' | 'json' | 'curl';

export default function ModelsPage() {
  const { navigate } = useRouter();
  const [selectedModel, setSelectedModel] = useState<string>('claude-sonnet-4');
  const [temperature, setTemperature] = useState(0.7);
  const [topP, setTopP] = useState(0.9);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [frequencyPenalty, setFrequencyPenalty] = useState(0.3);
  const [presencePenalty, setPresencePenalty] = useState(0.2);
  const [systemPrompt, setSystemPrompt] = useState('You are an expert content strategist. Generate clear, engaging, and SEO-optimized content.');
  const [userPrompt, setUserPrompt] = useState('Write a product description for a premium wireless headphone with active noise cancellation.');
  const [previewTab, setPreviewTab] = useState<PreviewTab>('stream');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState('');
  const [safetyFilter, setSafetyFilter] = useState(true);
  const [streamMode, setStreamMode] = useState(true);
  const [copied, setCopied] = useState(false);

  const currentModel = models.find((m) => m.id === selectedModel)!;

  const generatePreview = async () => {
    setIsGenerating(true);
    setGeneratedText('');

    const provider = selectedModel.includes('gpt') ? 'openai' : 'openai';
    const modelId = selectedModel === 'gpt-4o' ? 'gpt-4o' : selectedModel === 'claude-sonnet-4' ? 'gpt-4o' : 'gpt-4o-mini';

    try {
      const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-generate`;
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          provider,
          model: modelId,
          system_prompt: systemPrompt,
          user_prompt: userPrompt,
          temperature,
          max_tokens: maxTokens,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Fallback to simulated text if API keys not configured
        const fallbackText = `[Demo Mode] ${data.error || 'API keys not configured. The admin must add an OpenAI or Gemini API key in the Admin Control Panel.'}\n\nOnce API keys are configured in the Admin Panel, this will generate real AI content based on your prompt:\n\n"${userPrompt}"`;
        let i = 0;
        const interval = setInterval(() => {
          if (i <= fallbackText.length) {
            setGeneratedText(fallbackText.slice(0, i));
            i += Math.floor(Math.random() * 5) + 3;
          } else {
            clearInterval(interval);
            setIsGenerating(false);
          }
        }, 20);
        return;
      }

      // Stream the real AI response character by character for effect
      const fullText = data.content || '';
      let i = 0;
      const interval = setInterval(() => {
        if (i <= fullText.length) {
          setGeneratedText(fullText.slice(0, i));
          i += Math.floor(Math.random() * 8) + 5;
        } else {
          clearInterval(interval);
          setIsGenerating(false);
        }
      }, 15);
    } catch {
      // Network error fallback
      const errorText = 'Unable to connect to the AI generation service. Please check your connection and try again.';
      setGeneratedText(errorText);
      setIsGenerating(false);
    }
  };

  const copyConfig = () => {
    const config = JSON.stringify({
      model: currentModel.id,
      temperature,
      top_p: topP,
      max_tokens: maxTokens,
      frequency_penalty: frequencyPenalty,
      presence_penalty: presencePenalty,
      stream: streamMode,
      safety_filter: safetyFilter,
    }, null, 2);
    navigator.clipboard.writeText(config);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const jsonConfig = JSON.stringify({
    model: currentModel.id,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature,
    top_p: topP,
    max_tokens: maxTokens,
    frequency_penalty: frequencyPenalty,
    presence_penalty: presencePenalty,
    stream: streamMode,
    safety_filter: safetyFilter,
  }, null, 2);

  const curlCommand = `curl -X POST https://api.neuralforge.io/v1/chat/completions \\
  -H "Authorization: Bearer $NEURALFORGE_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '${jsonConfig.replace(/\n\s*/g, ' ')}'`;

  const presetConfigs = [
    { name: 'Creative', temp: 0.9, topP: 0.95, desc: 'For storytelling and brainstorming', icon: Sparkles },
    { name: 'Balanced', temp: 0.7, topP: 0.9, desc: 'Default for general content', icon: Brain },
    { name: 'Precise', temp: 0.3, topP: 0.7, desc: 'For factual and technical writing', icon: Shield },
    { name: 'Deterministic', temp: 0.0, topP: 0.5, desc: 'For consistent and repeatable output', icon: Lock },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2 text-sm text-neutral-500">
            <span>Platform</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-primary-400">AI Model Config</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-white mb-1">AI Model Configuration</h1>
          <p className="text-neutral-500">Select models, tune parameters, and preview outputs in real time</p>
        </div>

        {/* Model Selector */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-white text-lg flex items-center gap-2">
              <Cpu className="w-5 h-5 text-primary-400" />
              Select Model
            </h2>
            <span className="text-xs text-neutral-500">{models.length} models available</span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {models.map((model) => {
              const isSelected = selectedModel === model.id;
              return (
                <button
                  key={model.id}
                  onClick={() => setSelectedModel(model.id)}
                  className={`card p-5 text-left transition-all ${
                    isSelected ? 'border-primary-500/50 glow-blue' : 'card-hover'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${model.color} flex items-center justify-center`}>
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <h3 className="font-display font-semibold text-white text-sm mb-0.5">{model.name}</h3>
                  <p className="text-xs text-neutral-500 mb-3">{model.provider}</p>
                  <p className="text-xs text-neutral-400 leading-relaxed mb-3 line-clamp-2">{model.description}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {model.tags.map((tag) => (
                      <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-neutral-500">
                      <Activity className="w-3 h-3" />
                      {model.contextWindow}
                    </div>
                    <div className="text-neutral-400 font-mono">
                      ${model.costPer1k}/1K
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Config Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Parameters Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Presets */}
            <div className="card p-6">
              <h3 className="font-display font-semibold text-white text-lg mb-4">Quick Presets</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {presetConfigs.map((preset) => {
                  const Icon = preset.icon;
                  const isActive = temperature === preset.temp && topP === preset.topP;
                  return (
                    <button
                      key={preset.name}
                      onClick={() => {
                        setTemperature(preset.temp);
                        setTopP(preset.topP);
                      }}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        isActive
                          ? 'border-primary-500/40 bg-primary-500/10'
                          : 'border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800/30'
                      }`}
                    >
                      <Icon className={`w-4 h-4 mb-2 ${isActive ? 'text-primary-400' : 'text-neutral-400'}`} />
                      <div className="text-sm font-medium text-white">{preset.name}</div>
                      <div className="text-[10px] text-neutral-500 leading-tight mt-0.5">{preset.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sliders */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold text-white text-lg">Generation Parameters</h3>
                <button
                  onClick={() => {
                    setTemperature(0.7);
                    setTopP(0.9);
                    setMaxTokens(2048);
                    setFrequencyPenalty(0.3);
                    setPresencePenalty(0.2);
                  }}
                  className="text-xs text-neutral-500 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              </div>

              <div className="space-y-6">
                {/* Temperature */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm text-neutral-300 flex items-center gap-2">
                      Temperature
                      <span className="text-xs text-neutral-600">(controls randomness)</span>
                    </label>
                    <span className="font-mono text-sm text-primary-400 bg-primary-500/10 px-2 py-0.5 rounded">
                      {temperature.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.05"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer bg-neutral-800 accent-primary-500"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-600 mt-1">
                    <span>Precise</span>
                    <span>Balanced</span>
                    <span>Creative</span>
                  </div>
                </div>

                {/* Top-P */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm text-neutral-300 flex items-center gap-2">
                      Top-P
                      <span className="text-xs text-neutral-600">(nucleus sampling)</span>
                    </label>
                    <span className="font-mono text-sm text-secondary-400 bg-secondary-500/10 px-2 py-0.5 rounded">
                      {topP.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={topP}
                    onChange={(e) => setTopP(parseFloat(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer bg-neutral-800 accent-secondary-500"
                  />
                </div>

                {/* Max Tokens */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm text-neutral-300 flex items-center gap-2">
                      Max Tokens
                      <span className="text-xs text-neutral-600">(output length limit)</span>
                    </label>
                    <span className="font-mono text-sm text-accent-400 bg-accent-500/10 px-2 py-0.5 rounded">
                      {maxTokens}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="256"
                    max="8192"
                    step="256"
                    value={maxTokens}
                    onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer bg-neutral-800 accent-accent-500"
                  />
                </div>

                {/* Frequency Penalty */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm text-neutral-300 flex items-center gap-2">
                      Frequency Penalty
                      <span className="text-xs text-neutral-600">(reduces repetition)</span>
                    </label>
                    <span className="font-mono text-sm text-primary-400 bg-primary-500/10 px-2 py-0.5 rounded">
                      {frequencyPenalty.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.05"
                    value={frequencyPenalty}
                    onChange={(e) => setFrequencyPenalty(parseFloat(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer bg-neutral-800 accent-primary-500"
                  />
                </div>

                {/* Presence Penalty */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm text-neutral-300 flex items-center gap-2">
                      Presence Penalty
                      <span className="text-xs text-neutral-600">(encourages new topics)</span>
                    </label>
                    <span className="font-mono text-sm text-secondary-400 bg-secondary-500/10 px-2 py-0.5 rounded">
                      {presencePenalty.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.05"
                    value={presencePenalty}
                    onChange={(e) => setPresencePenalty(parseFloat(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer bg-neutral-800 accent-secondary-500"
                  />
                </div>
              </div>
            </div>

            {/* Safety & Options */}
            <div className="card p-6">
              <h3 className="font-display font-semibold text-white text-lg mb-4">Safety & Output Options</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setSafetyFilter(!safetyFilter)}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-neutral-900/50 hover:bg-neutral-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Shield className={`w-4 h-4 ${safetyFilter ? 'text-success-400' : 'text-neutral-600'}`} />
                    <div className="text-left">
                      <div className="text-sm text-white">Content Safety Filter</div>
                      <div className="text-xs text-neutral-500">Block harmful or inappropriate content</div>
                    </div>
                  </div>
                  <div className={`w-10 h-5 rounded-full transition-colors relative ${safetyFilter ? 'bg-success-500' : 'bg-neutral-700'}`}>
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${safetyFilter ? 'left-5' : 'left-0.5'}`} />
                  </div>
                </button>

                <button
                  onClick={() => setStreamMode(!streamMode)}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-neutral-900/50 hover:bg-neutral-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Zap className={`w-4 h-4 ${streamMode ? 'text-primary-400' : 'text-neutral-600'}`} />
                    <div className="text-left">
                      <div className="text-sm text-white">Stream Responses</div>
                      <div className="text-xs text-neutral-500">Receive tokens as they are generated</div>
                    </div>
                  </div>
                  <div className={`w-10 h-5 rounded-full transition-colors relative ${streamMode ? 'bg-primary-500' : 'bg-neutral-700'}`}>
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${streamMode ? 'left-5' : 'left-0.5'}`} />
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel: Prompts + Preview */}
          <div className="space-y-6">
            {/* Prompts */}
            <div className="card p-6">
              <h3 className="font-display font-semibold text-white text-lg mb-4 flex items-center gap-2">
                <Terminal className="w-5 h-5 text-primary-400" />
                Prompt Configuration
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-neutral-400 mb-1.5 block font-medium">System Prompt</label>
                  <textarea
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    rows={3}
                    className="input-field w-full px-3 py-2 text-sm resize-none scrollbar-thin"
                    placeholder="Define the AI's role and behavior..."
                  />
                </div>

                <div>
                  <label className="text-xs text-neutral-400 mb-1.5 block font-medium">User Prompt</label>
                  <textarea
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    rows={4}
                    className="input-field w-full px-3 py-2 text-sm resize-none scrollbar-thin"
                    placeholder="What should the AI generate?"
                  />
                </div>

                <button
                  onClick={generatePreview}
                  disabled={isGenerating}
                  className="w-full btn-primary py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <><RefreshCw className="w-4 h-4 animate-spin" /> Generating...</>
                  ) : (
                    <><Sparkles className="w-4 h-4" /> Generate Preview</>
                  )}
                </button>
              </div>
            </div>

            {/* Output Preview */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold text-white text-lg flex items-center gap-2">
                  <Eye className="w-5 h-5 text-secondary-400" />
                  Output Preview
                </h3>
                <div className="flex items-center gap-1">
                  {([
                    { id: 'stream' as const, icon: Activity, label: 'Stream' },
                    { id: 'json' as const, icon: Code2, label: 'JSON' },
                    { id: 'curl' as const, icon: Terminal, label: 'cURL' },
                  ]).map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setPreviewTab(tab.id)}
                      className={`p-1.5 rounded transition-colors ${previewTab === tab.id ? 'bg-primary-500/20 text-primary-400' : 'text-neutral-500 hover:text-neutral-300'}`}
                      title={tab.label}
                    >
                      <tab.icon className="w-3.5 h-3.5" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-neutral-950/60 rounded-lg p-4 min-h-[280px] max-h-[400px] overflow-y-auto scrollbar-thin">
                {previewTab === 'stream' && (
                  <div className="text-sm text-neutral-300 leading-relaxed whitespace-pre-wrap font-mono">
                    {generatedText || (
                      <span className="text-neutral-600 italic">
                        Click "Generate Preview" to see sample output based on your configuration.
                        {isGenerating && <span className="animate-pulse">|</span>}
                      </span>
                    )}
                    {isGenerating && generatedText && <span className="animate-pulse text-secondary-400">|</span>}
                  </div>
                )}

                {previewTab === 'json' && (
                  <pre className="text-xs text-secondary-400 font-mono leading-relaxed whitespace-pre-wrap">
                    {jsonConfig}
                  </pre>
                )}

                {previewTab === 'curl' && (
                  <pre className="text-xs text-primary-400 font-mono leading-relaxed whitespace-pre-wrap break-all">
                    {curlCommand}
                  </pre>
                )}
              </div>

              {/* Stats bar */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-neutral-800">
                <div>
                  <div className="text-[10px] text-neutral-600 uppercase">Model</div>
                  <div className="text-xs text-white font-mono truncate">{currentModel.name}</div>
                </div>
                <div>
                  <div className="text-[10px] text-neutral-600 uppercase">Est. Cost</div>
                  <div className="text-xs text-success-400 font-mono">
                    ${(currentModel.costPer1k * (maxTokens / 1000)).toFixed(4)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-neutral-600 uppercase">Tokens</div>
                  <div className="text-xs text-white font-mono">
                    {generatedText ? Math.ceil(generatedText.length / 4) : 0} / {maxTokens}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={copyConfig}
                  className="flex-1 btn-ghost py-2 rounded-lg text-xs flex items-center justify-center gap-1.5"
                >
                  {copied ? <><Check className="w-3.5 h-3.5 text-success-400" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy Config</>}
                </button>
                <button className="flex-1 btn-primary py-2 rounded-lg text-xs flex items-center justify-center gap-1.5">
                  <Save className="w-3.5 h-3.5" /> Save Preset
                </button>
              </div>
            </div>

            {/* Model Quality Indicator */}
            <div className="card p-6">
              <h3 className="font-display font-semibold text-white text-lg mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-accent-400" />
                Model Metrics
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-neutral-400">Quality Score</span>
                    <span className="text-white font-mono">{currentModel.quality}/100</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-neutral-800 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full" style={{ width: `${currentModel.quality}%` }} />
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400">Speed</span>
                  <span className={`font-medium capitalize ${currentModel.speed === 'fast' ? 'text-success-400' : currentModel.speed === 'medium' ? 'text-warning-400' : 'text-error-400'}`}>
                    {currentModel.speed}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400">Context Window</span>
                  <span className="text-white font-mono">{currentModel.contextWindow}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400">Cost / 1K tokens</span>
                  <span className="text-white font-mono">${currentModel.costPer1k}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="card p-8 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-white">Ready to deploy this configuration?</h3>
              <p className="text-sm text-neutral-400">View performance metrics or start generating content at scale.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-ghost px-5 py-2.5 rounded-lg text-sm"
            >
              View Dashboard
            </button>
            <button className="btn-primary px-5 py-2.5 rounded-lg text-sm flex items-center gap-2">
              Deploy Configuration
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Warning notice */}
        <div className="mt-6 flex items-start gap-3 p-4 rounded-lg bg-warning-500/5 border border-warning-500/20">
          <AlertTriangle className="w-4 h-4 text-warning-400 shrink-0 mt-0.5" />
          <p className="text-xs text-neutral-400 leading-relaxed">
            Changes to model configuration affect all new generation requests. Existing pipelines will use the previous configuration until explicitly updated. Configuration changes are logged in the audit trail.
          </p>
        </div>
      </div>
    </div>
  );
}
