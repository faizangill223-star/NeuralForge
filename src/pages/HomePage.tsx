import {
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  TrendingUp,
  Globe,
  Code2,
  Layers,
  Check,
  Brain,
  Cpu,
  Database,
  Workflow,
  Star,
} from 'lucide-react';
import ParticleGlobe from '../components/ParticleGlobe';
import Counter from '../components/Counter';
import { useRouter } from '../router';
import { useSettings } from '../lib/settings';

export default function HomePage() {
  const { navigate } = useRouter();
  const { settings } = useSettings();

  const stats = [
    { value: 2.4, suffix: 'B+', decimals: 1, label: 'Tokens Generated', color: 'text-primary-400' },
    { value: 180, suffix: '+', label: 'Countries Served', color: 'text-secondary-400' },
    { value: 99.99, suffix: '%', decimals: 2, label: 'Uptime SLA', color: 'text-success-400' },
    { value: 42, suffix: 'ms', label: 'Avg Response Time', color: 'text-accent-400' },
  ];

  const features = [
    {
      icon: Brain,
      title: 'Multi-Model Orchestration',
      desc: 'Route requests across GPT-4o, Claude, Llama, and proprietary models with intelligent failover and cost optimization.',
      color: 'from-primary-500 to-primary-700',
      tag: 'Core Engine',
    },
    {
      icon: TrendingUp,
      title: 'Real-Time Analytics',
      desc: 'Monitor token usage, latency, cost breakdowns, and quality metrics across every deployment with live dashboards.',
      color: 'from-secondary-500 to-secondary-700',
      tag: 'Observability',
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      desc: 'SOC 2 Type II compliant with end-to-end encryption, PII redaction, and granular role-based access controls.',
      color: 'from-accent-500 to-accent-700',
      tag: 'Compliance',
    },
    {
      icon: Workflow,
      title: 'Pipeline Builder',
      desc: 'Chain prompts, tool calls, and data transformations visually. Version, test, and deploy with one click.',
      color: 'from-primary-500 to-secondary-600',
      tag: 'Workflows',
    },
    {
      icon: Database,
      title: 'RAG Infrastructure',
      desc: 'Managed vector stores with hybrid search, automatic chunking, and context-aware retrieval at any scale.',
      color: 'from-secondary-600 to-primary-700',
      tag: 'Retrieval',
    },
    {
      icon: Code2,
      title: 'Developer API',
      desc: 'Drop-in OpenAI-compatible endpoints, streaming responses, and SDKs for TypeScript, Python, and Go.',
      color: 'from-accent-600 to-primary-700',
      tag: 'Integration',
    },
  ];

  const logos = ['Nimbus', 'Quantum', 'Vertex', 'Apex', 'Meridian', 'Cipher'];

  const pricingTiers = [
    {
      name: 'Starter',
      price: 'Free',
      period: 'forever',
      desc: 'For individuals exploring AI content generation.',
      features: ['100K tokens / month', '3 model providers', 'Basic analytics', 'Community support'],
      cta: 'Start Free',
      highlight: false,
    },
    {
      name: 'Pro',
      price: '$49',
      period: '/ month',
      desc: 'For growing teams shipping production content.',
      features: ['5M tokens / month', 'All model providers', 'Real-time analytics', 'Pipeline builder', 'Priority support', 'Custom RAG stores'],
      cta: 'Start Pro Trial',
      highlight: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      desc: 'For organizations at scale with custom needs.',
      features: ['Unlimited tokens', 'Dedicated infrastructure', 'SSO & SAML', 'SLA guarantee', 'Solution architect', 'On-prem deployment'],
      cta: 'Contact Sales',
      highlight: false,
    },
  ];

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0 bg-grid bg-grid-fade" />
        <div className="absolute inset-0 bg-radial-glow" />

        {/* Background gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-500/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />

        {/* 3D Particle Globe */}
        <div className="absolute inset-0 flex items-center justify-center opacity-90 pointer-events-none">
          <ParticleGlobe className="w-full max-w-[800px] h-full" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-8 animate-fade-in">
              <span className="status-dot bg-success-500 animate-pulse" />
              <span className="text-sm text-neutral-300">Now serving 2.4B tokens monthly</span>
              <Sparkles className="w-3.5 h-3.5 text-primary-400" />
            </div>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] mb-6 animate-fade-in-up">
              The AI Content
              <br />
              <span className="gradient-text">Intelligence Platform</span>
            </h1>

            <p className="text-lg sm:text-xl text-neutral-400 leading-relaxed max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Orchestrate multiple AI models, generate content at scale, and monitor every metric in real time.
              One platform for your entire AI content pipeline.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <button
                onClick={() => navigate('/dashboard')}
                className="btn-primary px-7 py-3.5 rounded-xl text-base flex items-center gap-2 group"
              >
                Launch Dashboard
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate('/models')}
                className="btn-ghost px-7 py-3.5 rounded-xl text-base flex items-center gap-2"
              >
                <Cpu className="w-5 h-5" />
                Configure Models
              </button>
            </div>

            <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className={`font-display text-3xl sm:text-4xl font-bold ${stat.color}`}>
                    <Counter value={stat.value} suffix={stat.suffix} decimals={stat.decimals} />
                  </div>
                  <div className="text-xs sm:text-sm text-neutral-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <div className="w-6 h-10 rounded-full border-2 border-neutral-700 flex items-start justify-center p-1.5">
            <div className="w-1 h-2 bg-primary-400 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Trusted by */}
      <section className="py-16 border-y border-neutral-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-neutral-600 mb-8 uppercase tracking-widest font-medium">
            Trusted by engineering teams at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14">
            {logos.map((logo) => (
              <span key={logo} className="font-display font-bold text-2xl text-neutral-700 hover:text-neutral-500 transition-colors cursor-default">
                {logo}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-radial-glow opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 mb-4">
              <Layers className="w-3.5 h-3.5 text-primary-400" />
              <span className="text-xs font-medium text-primary-400 uppercase tracking-wider">Platform Capabilities</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
              Everything you need to
              <br />
              <span className="gradient-text">build with AI</span>
            </h2>
            <p className="text-neutral-400 text-lg">
              From prompt to production, NeuralForge handles the infrastructure so your team can focus on the content.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="card card-hover p-6 group animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs text-neutral-600 font-mono">{feature.tag}</span>
                  </div>
                  <h3 className="font-display font-semibold text-white text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Showcase Split */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-500/10 border border-secondary-500/20 mb-4">
                <Zap className="w-3.5 h-3.5 text-secondary-400" />
                <span className="text-xs font-medium text-secondary-400 uppercase tracking-wider">Model Config</span>
              </div>
              <h2 className="font-display text-4xl font-bold text-white mb-4 leading-tight">
                Fine-tune every parameter.
                <br />
                <span className="text-gradient-green">No code required.</span>
              </h2>
              <p className="text-neutral-400 text-lg leading-relaxed mb-8">
                Adjust temperature, top-p, max tokens, and penalty parameters with live preview.
                Switch between providers, compare outputs side-by-side, and deploy with confidence.
              </p>
              <ul className="space-y-3 mb-8">
                {['Live output preview', 'Provider cost comparison', 'Safety filter controls', 'A/B test configurations'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-neutral-300">
                    <div className="w-5 h-5 rounded-full bg-secondary-500/20 flex items-center justify-center">
                      <Check className="w-3 h-3 text-secondary-400" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate('/models')}
                className="btn-primary px-6 py-3 rounded-xl flex items-center gap-2 group"
              >
                Explore Model Config
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="relative">
              <div className="card p-6 glow-blue">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-neutral-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-display font-semibold text-white text-sm">Claude Sonnet 4</div>
                      <div className="text-xs text-neutral-500">Model: claude-sonnet-4-0825</div>
                    </div>
                  </div>
                  <span className="status-dot bg-success-500 animate-pulse" />
                </div>

                <div className="space-y-4">
                  {[
                    { label: 'Temperature', value: 72, color: 'bg-primary-500' },
                    { label: 'Top-P', value: 45, color: 'bg-secondary-500' },
                    { label: 'Max Tokens', value: 88, color: 'bg-accent-500' },
                  ].map((param) => (
                    <div key={param.label}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-neutral-400">{param.label}</span>
                        <span className="text-neutral-300 font-mono">{param.value}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-neutral-800 overflow-hidden">
                        <div className={`h-full ${param.color} rounded-full transition-all duration-1000`} style={{ width: `${param.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-neutral-800">
                  <div className="text-xs text-neutral-500 mb-2">Live Output Preview</div>
                  <div className="bg-neutral-950/50 rounded-lg p-3 font-mono text-xs text-secondary-400 leading-relaxed">
                    <span className="text-primary-400">&gt;</span> Generating response...
                    <span className="animate-pulse">|</span>
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 glass-strong px-3 py-2 rounded-lg flex items-center gap-2 animate-float">
                <Globe className="w-4 h-4 text-secondary-400" />
                <span className="text-xs font-medium text-neutral-200">Global Edge Network</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-24" id="pricing-preview">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-500/10 border border-accent-500/20 mb-4">
              <Star className="w-3.5 h-3.5 text-accent-400" />
              <span className="text-xs font-medium text-accent-400 uppercase tracking-wider">Pricing</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
              Simple, <span className="gradient-text-warm">scalable</span> pricing
            </h2>
            <p className="text-neutral-400 text-lg">Pay only for what you use. Upgrade, downgrade, or cancel anytime.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={`card p-8 relative ${tier.highlight ? 'border-primary-500/40 glow-blue scale-[1.02]' : 'card-hover'}`}
              >
                {tier.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-xs font-semibold text-white">
                    Most Popular
                  </div>
                )}
                <h3 className="font-display font-bold text-xl text-white mb-1">{tier.name}</h3>
                <p className="text-sm text-neutral-500 mb-4">{tier.desc}</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="font-display text-4xl font-bold text-white">{tier.price}</span>
                  <span className="text-neutral-500">{tier.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-neutral-300">
                      <Check className="w-4 h-4 text-secondary-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => {
                    if (tier.name === 'Pro') {
                      if (settings.payment_gateway_url) {
                        window.open(settings.payment_gateway_url, '_blank');
                      } else if (settings.gumroad_link) {
                        window.open(settings.gumroad_link, '_blank');
                      } else {
                        navigate('/checkout');
                      }
                    } else if (tier.name === 'Enterprise') {
                      navigate('/about');
                    } else {
                      navigate('/dashboard');
                    }
                  }}
                  className={`w-full py-3 rounded-xl font-medium text-sm transition-all ${
                    tier.highlight ? 'btn-primary' : 'btn-ghost'
                  }`}
                >
                  {tier.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-grid bg-grid-fade opacity-40" />
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary-500/15 rounded-full blur-[100px]" />
            <div className="relative">
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to forge <span className="gradient-text">intelligent content?</span>
              </h2>
              <p className="text-neutral-400 text-lg mb-8 max-w-xl mx-auto">
                Join thousands of teams using NeuralForge to build, deploy, and scale AI content pipelines.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="btn-primary px-7 py-3.5 rounded-xl text-base flex items-center gap-2 group"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => navigate('/about')}
                  className="btn-ghost px-7 py-3.5 rounded-xl text-base"
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
