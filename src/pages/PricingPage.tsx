import { Check, Star, ArrowRight, Zap, Shield, Building2 } from 'lucide-react';
import { useRouter } from '../router';
import { useSettings } from '../lib/settings';
import Counter from '../components/Counter';

export default function PricingPage() {
  const { navigate } = useRouter();
  const { settings } = useSettings();

  const tiers = [
    {
      name: 'Starter',
      price: 0,
      period: 'forever',
      desc: 'For individuals exploring AI content generation.',
      icon: Zap,
      color: 'from-neutral-600 to-neutral-800',
      features: [
        '100K tokens / month',
        '3 model providers',
        'Basic analytics dashboard',
        'Community support',
        'Standard response speed',
        '1 project seat',
      ],
      cta: 'Start Free',
      highlight: false,
    },
    {
      name: 'Pro',
      price: 49,
      period: '/ month',
      desc: 'For growing teams shipping production content.',
      icon: Star,
      color: 'from-primary-500 to-secondary-600',
      features: [
        '5M tokens / month',
        'All model providers',
        'Real-time analytics',
        'Pipeline builder',
        'Priority support',
        'Custom RAG stores',
        '10 project seats',
        'API access',
      ],
      cta: 'Start 14-Day Trial',
      highlight: true,
    },
    {
      name: 'Enterprise',
      price: null,
      period: 'custom',
      desc: 'For organizations at scale with custom needs.',
      icon: Building2,
      color: 'from-accent-500 to-accent-700',
      features: [
        'Unlimited tokens',
        'Dedicated infrastructure',
        'SSO & SAML integration',
        '99.99% SLA guarantee',
        'Solution architect',
        'On-prem deployment option',
        'Unlimited seats',
        'Custom model fine-tuning',
        'Audit logs & compliance',
      ],
      cta: 'Contact Sales',
      highlight: false,
    },
  ];

  const comparison = [
    { feature: 'Monthly Tokens', starter: '100K', pro: '5M', enterprise: 'Unlimited' },
    { feature: 'Model Providers', starter: '3', pro: 'All', enterprise: 'All + Custom' },
    { feature: 'Analytics', starter: 'Basic', pro: 'Real-time', enterprise: 'Custom' },
    { feature: 'Pipeline Builder', starter: '—', pro: 'Included', enterprise: 'Included' },
    { feature: 'RAG Infrastructure', starter: '—', pro: 'Standard', enterprise: 'Dedicated' },
    { feature: 'API Access', starter: '—', pro: 'Full', enterprise: 'Full + SLA' },
    { feature: 'Support', starter: 'Community', pro: 'Priority', enterprise: 'Dedicated' },
    { feature: 'SLA Guarantee', starter: '—', pro: '—', enterprise: '99.99%' },
    { feature: 'SSO / SAML', starter: '—', pro: '—', enterprise: 'Included' },
  ];

  const faqs = [
    { q: 'How does token billing work?', a: 'You are billed based on the total tokens processed per month across all model providers. Tokens include both input and output. Unused tokens do not roll over.' },
    { q: 'Can I switch plans anytime?', a: 'Yes. You can upgrade, downgrade, or cancel your plan at any time. Changes take effect immediately and are prorated based on your billing cycle.' },
    { q: 'Which model providers are supported?', a: 'Pro and Enterprise plans include access to Claude, GPT-4o, Llama, Mistral, and proprietary models. Starter includes three provider options.' },
    { q: 'Is there a free trial?', a: 'The Starter plan is free forever. Pro and Enterprise offer a 14-day trial with full feature access and no credit card required.' },
    { q: 'Do you offer custom pricing?', a: 'For high-volume usage or specialized requirements, Enterprise plans are custom-quoted. Contact our sales team for a personalized consultation.' },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto pt-12 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-500/10 border border-accent-500/20 mb-4">
            <Star className="w-3.5 h-3.5 text-accent-400" />
            <span className="text-xs font-medium text-accent-400 uppercase tracking-wider">Pricing</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
            Plans that scale with <span className="gradient-text">your ambition</span>
          </h1>
          <p className="text-neutral-400 text-lg">
            Start free, upgrade when you grow. No hidden fees, cancel anytime.
          </p>
        </div>

        {/* Pricing Tiers */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {tiers.map((tier) => {
            const Icon = tier.icon;
            return (
              <div
                key={tier.name}
                className={`card p-8 relative ${tier.highlight ? 'border-primary-500/40 glow-blue lg:scale-105' : 'card-hover'}`}
              >
                {tier.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-xs font-semibold text-white whitespace-nowrap">
                    Most Popular
                  </div>
                )}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tier.color} flex items-center justify-center mb-5`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display font-bold text-xl text-white mb-1">{tier.name}</h3>
                <p className="text-sm text-neutral-500 mb-5">{tier.desc}</p>
                <div className="flex items-baseline gap-1 mb-6">
                  {tier.price !== null ? (
                    <>
                      <span className="font-display text-4xl font-bold text-white">${tier.price}</span>
                      <span className="text-neutral-500">{tier.period}</span>
                    </>
                  ) : (
                    <span className="font-display text-4xl font-bold text-white">Custom</span>
                  )}
                </div>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-neutral-300">
                      <Check className="w-4 h-4 text-secondary-400 shrink-0 mt-0.5" />
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
            );
          })}
        </div>

        {/* Stats banner */}
        <div className="card p-8 mb-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid bg-grid-fade opacity-30" />
          <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="font-display text-3xl font-bold text-primary-400">
                <Counter value={12450} suffix="+" />
              </div>
              <div className="text-sm text-neutral-500 mt-1">Active Customers</div>
            </div>
            <div>
              <div className="font-display text-3xl font-bold text-secondary-400">
                <Counter value={2.4} suffix="B" decimals={1} />
              </div>
              <div className="text-sm text-neutral-500 mt-1">Tokens Monthly</div>
            </div>
            <div>
              <div className="font-display text-3xl font-bold text-accent-400">
                <Counter value={99.99} suffix="%" decimals={2} />
              </div>
              <div className="text-sm text-neutral-500 mt-1">Uptime Guarantee</div>
            </div>
            <div>
              <div className="font-display text-3xl font-bold text-success-400">
                <Counter value={42} suffix="ms" />
              </div>
              <div className="text-sm text-neutral-500 mt-1">Avg Response</div>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="mb-20">
          <h2 className="font-display text-3xl font-bold text-white text-center mb-10">
            Compare <span className="gradient-text">all features</span>
          </h2>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-neutral-800">
                    <th className="text-left p-4 text-sm font-medium text-neutral-400">Feature</th>
                    <th className="text-center p-4 text-sm font-semibold text-neutral-300">Starter</th>
                    <th className="text-center p-4 text-sm font-semibold text-primary-400">Pro</th>
                    <th className="text-center p-4 text-sm font-semibold text-accent-400">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((row, i) => (
                    <tr key={row.feature} className={`border-b border-neutral-800/50 ${i % 2 === 0 ? 'bg-neutral-900/20' : ''}`}>
                      <td className="p-4 text-sm text-neutral-300">{row.feature}</td>
                      <td className="p-4 text-center text-sm text-neutral-400">{row.starter}</td>
                      <td className="p-4 text-center text-sm text-primary-400 font-medium">{row.pro}</td>
                      <td className="p-4 text-center text-sm text-accent-400 font-medium">{row.enterprise}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Enterprise CTA */}
        <div className="card p-8 mb-20 flex flex-col lg:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute -right-20 top-0 w-80 h-80 bg-accent-500/10 rounded-full blur-[100px]" />
          <div className="relative flex items-center gap-5">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center shrink-0">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-white text-xl mb-1">Need a custom solution?</h3>
              <p className="text-neutral-400 text-sm">Dedicated infrastructure, custom models, and 24/7 support for enterprise teams.</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/about')}
            className="btn-primary px-6 py-3 rounded-xl text-sm flex items-center gap-2 group relative shrink-0"
          >
            Talk to Sales
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-white text-center mb-10">
            Frequently asked <span className="gradient-text">questions</span>
          </h2>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <details key={faq.q} className="card p-5 group cursor-pointer">
                <summary className="flex items-center justify-between text-sm font-medium text-white list-none">
                  {faq.q}
                  <span className="text-neutral-500 group-open:rotate-45 transition-transform text-xl">+</span>
                </summary>
                <p className="text-sm text-neutral-400 mt-3 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
