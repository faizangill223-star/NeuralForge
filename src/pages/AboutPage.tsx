import { Target, Eye, Globe, Users, Award, Rocket, Heart, ArrowRight } from 'lucide-react';
import { useRouter } from '../router';
import Counter from '../components/Counter';

export default function AboutPage() {
  const { navigate } = useRouter();

  const values = [
    { icon: Target, title: 'Mission-Driven', desc: 'We build tools that remove friction from the creative process, letting teams focus on what matters most.' },
    { icon: Eye, title: 'Radical Transparency', desc: 'Open metrics, honest pricing, and clear documentation. We earn trust through visibility, not lock-in.' },
    { icon: Rocket, title: 'Ship Fast', desc: 'We iterate quickly and deploy constantly. The best platform is the one that ships today and improves tomorrow.' },
    { icon: Heart, title: 'Customer Obsessed', desc: 'Every feature starts with a real customer problem. Support is not a department, it is our culture.' },
  ];

  const team = [
    { name: 'Alex Chen', role: 'CEO & Co-Founder', focus: 'Strategy', color: 'from-primary-500 to-primary-700' },
    { name: 'Maya Patel', role: 'CTO & Co-Founder', focus: 'Infrastructure', color: 'from-secondary-500 to-secondary-700' },
    { name: 'Jordan Lee', role: 'Head of Product', focus: 'Design', color: 'from-accent-500 to-accent-700' },
    { name: 'Sam Rivera', role: 'Head of Engineering', focus: 'AI Systems', color: 'from-primary-600 to-secondary-600' },
    { name: 'Dana Foster', role: 'VP of Sales', focus: 'Growth', color: 'from-accent-600 to-primary-700' },
    { name: 'Yuki Tanaka', role: 'Head of Research', focus: 'ML Research', color: 'from-secondary-600 to-accent-600' },
  ];

  const timeline = [
    { year: '2023', title: 'Founded', desc: 'NeuralForge starts with a team of 3 in a San Francisco co-working space.' },
    { year: '2024', title: 'First Million Tokens', desc: 'Platform reaches 1M tokens generated within 6 months of launch.' },
    { year: '2025', title: 'Series A', desc: 'Raised $25M Series A led by Sequoia Capital. Team grows to 40.' },
    { year: '2026', title: 'Enterprise Scale', desc: 'Now serving 2.4B tokens monthly across 180+ countries with 12,000+ customers.' },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <section className="pt-16 pb-20 text-center relative">
          <div className="absolute inset-0 bg-grid bg-grid-fade opacity-50" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary-500/10 rounded-full blur-[120px]" />
          <div className="relative max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 mb-6">
              <Globe className="w-3.5 h-3.5 text-primary-400" />
              <span className="text-xs font-medium text-primary-400 uppercase tracking-wider">About NeuralForge</span>
            </div>
            <h1 className="font-display text-4xl sm:text-6xl font-bold text-white mb-6 leading-tight">
              Building the <span className="gradient-text">AI infrastructure</span> for the next decade of content
            </h1>
            <p className="text-neutral-400 text-lg sm:text-xl leading-relaxed mb-8">
              NeuralForge was founded on a simple belief: AI should amplify human creativity, not replace it.
              We build the infrastructure that lets teams orchestrate, monitor, and scale AI content generation with confidence.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="btn-primary px-7 py-3.5 rounded-xl text-base flex items-center gap-2 group"
              >
                Explore the Platform
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate('/pricing')}
                className="btn-ghost px-7 py-3.5 rounded-xl text-base"
              >
                View Pricing
              </button>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {[
            { value: 12000, suffix: '+', label: 'Customers', color: 'text-primary-400' },
            { value: 180, suffix: '+', label: 'Countries', color: 'text-secondary-400' },
            { value: 85, suffix: '', label: 'Team Members', color: 'text-accent-400' },
            { value: 2.4, suffix: 'B', decimals: 1, label: 'Monthly Tokens', color: 'text-success-400' },
          ].map((stat) => (
            <div key={stat.label} className="card p-6 text-center">
              <div className={`font-display text-3xl font-bold ${stat.color}`}>
                <Counter value={stat.value} suffix={stat.suffix} decimals={stat.decimals || 0} />
              </div>
              <div className="text-sm text-neutral-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </section>

        {/* Values */}
        <section className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
              Our core <span className="gradient-text">values</span>
            </h2>
            <p className="text-neutral-400">The principles that guide every decision we make.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {values.map((val, i) => {
              const Icon = val.icon;
              return (
                <div key={val.title} className="card card-hover p-6 animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-secondary-500/20 border border-primary-500/20 flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6 text-primary-400" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-white text-lg mb-1">{val.title}</h3>
                      <p className="text-sm text-neutral-400 leading-relaxed">{val.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Timeline */}
        <section className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
              Our <span className="gradient-text">journey</span>
            </h2>
            <p className="text-neutral-400">From idea to infrastructure in three years.</p>
          </div>
          <div className="relative">
            <div className="absolute left-4 sm:left-1/2 sm:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 via-secondary-500 to-accent-500" />
            <div className="space-y-12">
              {timeline.map((item, i) => (
                <div
                  key={item.year}
                  className={`relative flex items-start gap-6 ${
                    i % 2 === 0 ? 'sm:flex-row-reverse' : ''
                  }`}
                >
                  <div className="absolute left-4 sm:left-1/2 sm:-translate-x-1/2 w-4 h-4 rounded-full bg-primary-500 border-4 border-neutral-950 z-10" />
                  <div className="sm:w-1/2 pl-12 sm:pl-0 sm:px-8">
                    <div className="card p-5">
                      <div className="font-display text-2xl font-bold gradient-text mb-1">{item.year}</div>
                      <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                      <p className="text-sm text-neutral-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                  <div className="hidden sm:block sm:w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-500/10 border border-secondary-500/20 mb-4">
              <Users className="w-3.5 h-3.5 text-secondary-400" />
              <span className="text-xs font-medium text-secondary-400 uppercase tracking-wider">Leadership</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
              Built by <span className="text-gradient-green">experts</span>
            </h2>
            <p className="text-neutral-400">A team of engineers, researchers, and designers from leading AI companies.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member, i) => (
              <div key={member.name} className="card card-hover p-6 text-center animate-fade-in-up" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className={`w-20 h-20 rounded-full mx-auto mb-4 bg-gradient-to-br ${member.color} flex items-center justify-center`}>
                  <span className="font-display text-2xl font-bold text-white">
                    {member.name.split(' ').map((n) => n[0]).join('')}
                  </span>
                </div>
                <h3 className="font-display font-semibold text-white">{member.name}</h3>
                <p className="text-sm text-primary-400 mb-2">{member.role}</p>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-800/50 text-xs text-neutral-400">
                  <Award className="w-3 h-3" />
                  {member.focus}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="card p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-grid bg-grid-fade opacity-30" />
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-secondary-500/15 rounded-full blur-[100px]" />
          <div className="relative">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
              Join us in <span className="gradient-text">building the future</span>
            </h2>
            <p className="text-neutral-400 text-lg mb-8 max-w-xl mx-auto">
              Start generating intelligent content today, or explore what NeuralForge can do for your team.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="btn-primary px-7 py-3.5 rounded-xl text-base flex items-center gap-2 group"
              >
                Launch Dashboard
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate('/models')}
                className="btn-ghost px-7 py-3.5 rounded-xl text-base"
              >
                Configure AI Models
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
