import { useState, useEffect } from 'react';
import {
  Crown,
  TrendingUp,
  TrendingDown,
  Zap,
  DollarSign,
  Clock,
  Users,
  Cpu,
  ArrowUpRight,
  Download,
  Bell,
  Search,
  MoreHorizontal,
  CheckCircle,
  AlertCircle,
  Loader,
  Shield,
  Infinity as InfinityIcon,
  Sparkles,
  Rocket,
  Database,
  Globe,
  Settings,
  LogOut,
} from 'lucide-react';
import AreaChart from '../components/AreaChart';
import BarChart from '../components/BarChart';
import DonutChart from '../components/DonutChart';
import LiveChart from '../components/LiveChart';
import Counter from '../components/Counter';
import { useRouter } from '../router';
import { useAuth } from '../lib/auth';

type TimeRange = '24h' | '7d' | '30d' | '90d';

export default function PremiumDashboardPage() {
  const { navigate } = useRouter();
  const { user, signOut } = useAuth();
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');
  const [liveValue, setLiveValue] = useState(2840);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveValue((prev) => Math.max(1500, Math.min(4200, prev + Math.floor((Math.random() - 0.5) * 200))));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const tokenData: Record<TimeRange, number[]> = {
    '24h': Array.from({ length: 24 }, (_, i) => Math.floor(800 + Math.sin(i / 3) * 400 + Math.random() * 300 + i * 30)),
    '7d': Array.from({ length: 7 }, (_, i) => Math.floor(3200 + Math.sin(i) * 800 + Math.random() * 600)),
    '30d': Array.from({ length: 30 }, (_, i) => Math.floor(2400 + Math.sin(i / 4) * 600 + Math.cos(i / 2) * 400 + Math.random() * 500)),
    '90d': Array.from({ length: 90 }, (_, i) => Math.floor(1800 + Math.sin(i / 8) * 800 + i * 15 + Math.random() * 400)),
  };

  const tokenLabels: Record<TimeRange, string[]> = {
    '24h': Array.from({ length: 24 }, (_, i) => `${i}:00`),
    '7d': ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    '30d': Array.from({ length: 30 }, (_, i) => `${i + 1}`),
    '90d': Array.from({ length: 90 }, (_, i) => (i % 10 === 0 ? `Day ${i + 1}` : '')),
  };

  const kpis = [
    { label: 'Total Tokens', value: 4823910, change: 34.2, icon: Zap, color: 'text-primary-400', bg: 'bg-primary-500/10' },
    { label: 'Revenue', value: 18429, change: 28.7, icon: DollarSign, color: 'text-success-400', bg: 'bg-success-500/10', prefix: '$' },
    { label: 'Avg Latency', value: 18, change: -12.4, icon: Clock, color: 'text-accent-400', bg: 'bg-accent-500/10', suffix: 'ms' },
    { label: 'Active Users', value: 12847, change: 41.3, icon: Users, color: 'text-secondary-400', bg: 'bg-secondary-500/10' },
  ];

  const modelUsage = [
    { label: 'Claude Sonnet 4', value: 38, color: '#4dc3ff' },
    { label: 'GPT-4o', value: 24, color: '#00f5b8' },
    { label: 'Llama 3.1 405B', value: 18, color: '#ffb74d' },
    { label: 'Mistral Large 2', value: 10, color: '#f59000' },
    { label: 'Custom Models', value: 6, color: '#00cc94' },
    { label: 'Other', value: 4, color: '#94a3b8' },
  ];

  const contentTypes = [
    { label: 'Blog', value: 8200, color: '#4dc3ff' },
    { label: 'Social', value: 6800, color: '#00f5b8' },
    { label: 'Email', value: 4900, color: '#ffb74d' },
    { label: 'Docs', value: 3500, color: '#f59000' },
    { label: 'Code', value: 2100, color: '#007acc' },
    { label: 'Product', value: 1800, color: '#00cc94' },
  ];

  const recentActivity = [
    { type: 'success', model: 'Claude Sonnet 4', action: 'Generated long-form blog article (5,200 tokens)', tokens: 5200, time: '1 min ago', status: 'completed' },
    { type: 'success', model: 'GPT-4o', action: 'Processed multi-channel email campaign', tokens: 3520, time: '4 min ago', status: 'completed' },
    { type: 'success', model: 'Custom Model', action: 'Fine-tuned product description model', tokens: 0, time: '9 min ago', status: 'completed' },
    { type: 'success', model: 'Claude Sonnet 4', action: 'Generated API documentation set', tokens: 8400, time: '15 min ago', status: 'completed' },
    { type: 'loading', model: 'Llama 3.1 405B', action: 'Batch processing 50 social media posts', tokens: 0, time: '18 min ago', status: 'processing' },
    { type: 'success', model: 'GPT-4o', action: 'Created landing page copy variants (A/B test)', tokens: 4120, time: '24 min ago', status: 'completed' },
    { type: 'success', model: 'Mistral Large 2', action: 'Translated documentation to 6 languages', tokens: 12840, time: '32 min ago', status: 'completed' },
    { type: 'success', model: 'Claude Sonnet 4', action: 'Generated weekly analytics report', tokens: 2840, time: '41 min ago', status: 'completed' },
  ];

  const premiumFeatures = [
    { label: 'Model Providers', value: 'All + Custom', icon: Cpu },
    { label: 'Token Limit', value: 'Unlimited', icon: InfinityIcon },
    { label: 'Team Seats', value: '10 Active', icon: Users },
    { label: 'API Access', value: 'Full + SLA', icon: Globe },
  ];

  const isPositive = (change: number) => change > 0;

  return (
    <div className="min-h-screen pt-20 pb-12">
      {/* Premium gradient banner backdrop */}
      <div className="fixed top-0 left-0 right-0 h-64 bg-gradient-to-b from-primary-500/5 via-secondary-500/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Premium header banner */}
        <div className="card p-6 mb-6 border-primary-500/30 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary-500/10 rounded-full blur-[80px]" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-secondary-500/10 rounded-full blur-[80px]" />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
                <Crown className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="font-display text-2xl font-bold text-white">Premium Admin Dashboard</h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-xs font-semibold text-white">
                    <Sparkles className="w-3 h-3" /> PRO
                  </span>
                </div>
                <p className="text-sm text-neutral-400">
                  Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}. All premium features are unlocked.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/models')}
                className="btn-ghost px-4 py-2.5 rounded-lg text-sm flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Configure
              </button>
              <button
                onClick={() => {
                  signOut();
                  navigate('/');
                }}
                className="btn-ghost px-4 py-2.5 rounded-lg text-sm flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Premium feature stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {premiumFeatures.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div key={feature.label} className="card p-4 flex items-center gap-3 animate-fade-in-up" style={{ animationDelay: `${i * 0.06}s` }}>
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500/15 to-secondary-500/15 border border-primary-500/20 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <div className="text-xs text-neutral-500">{feature.label}</div>
                  <div className="font-display font-semibold text-white text-sm">{feature.value}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="font-display text-2xl font-bold text-white">Analytics Overview</h2>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success-500/10 border border-success-500/20">
                <span className="status-dot bg-success-500 animate-pulse" />
                <span className="text-xs text-success-400 font-medium">Live</span>
              </span>
            </div>
            <p className="text-neutral-500">Real-time metrics across all your AI content pipelines</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                placeholder="Search metrics..."
                className="input-field pl-9 pr-4 py-2 text-sm w-56"
              />
            </div>
            <button className="btn-ghost p-2.5 rounded-lg relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-500 rounded-full" />
            </button>
            <button className="btn-ghost px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-1 p-1 glass rounded-xl">
            {(['24h', '7d', '30d', '90d'] as TimeRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  timeRange === range
                    ? 'bg-primary-500/20 text-primary-400'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {range === '24h' ? '24 Hours' : range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
              </button>
            ))}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {kpis.map((kpi, i) => {
            const Icon = kpi.icon;
            const positive = isPositive(kpi.change);
            return (
              <div key={kpi.label} className="card p-5 animate-fade-in-up" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg ${kpi.bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${kpi.color}`} />
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-semibold ${positive ? 'text-success-400' : 'text-error-400'}`}>
                    {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {Math.abs(kpi.change)}%
                  </div>
                </div>
                <div className="font-display text-2xl font-bold text-white">
                  <Counter value={kpi.value} prefix={kpi.prefix} suffix={kpi.suffix} />
                </div>
                <div className="text-sm text-neutral-500 mt-0.5">{kpi.label}</div>
              </div>
            );
          })}
        </div>

        {/* Main chart + Live widget */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display font-semibold text-white text-lg">Token Usage (Premium)</h3>
                <p className="text-xs text-neutral-500">Unlimited token generation across all models</p>
              </div>
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary-500/10">
                <InfinityIcon className="w-3.5 h-3.5 text-primary-400" />
                <span className="text-xs text-primary-400 font-medium">Unlimited</span>
              </div>
            </div>
            <AreaChart
              data={tokenData[timeRange]}
              labels={tokenLabels[timeRange]}
              height={280}
              color="#4dc3ff"
              gradientId="premiumTokenArea"
            />
          </div>

          {/* Live Activity Widget */}
          <div className="card p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display font-semibold text-white text-lg">Live Throughput</h3>
                <p className="text-xs text-neutral-500">Tokens / second</p>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-success-500/10">
                <span className="status-dot bg-success-500 animate-pulse" />
                <span className="text-[10px] text-success-400 font-medium">Streaming</span>
              </div>
            </div>

            <div className="text-center mb-3">
              <div className="font-display text-4xl font-bold text-success-400 font-mono">
                <Counter value={liveValue} duration={800} />
              </div>
              <div className="text-xs text-neutral-500 mt-1">tok/s active now</div>
            </div>

            <LiveChart height={100} color="#00f5b8" />

            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-neutral-800">
              <div>
                <div className="text-xs text-neutral-500">Peak Today</div>
                <div className="font-mono text-sm text-white">4,120 tok/s</div>
              </div>
              <div>
                <div className="text-xs text-neutral-500">Avg Today</div>
                <div className="font-mono text-sm text-white">2,840 tok/s</div>
              </div>
            </div>
          </div>
        </div>

        {/* Model usage + Content types */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-display font-semibold text-white text-lg">Model Distribution</h3>
                <p className="text-xs text-neutral-500">Usage including custom fine-tuned models</p>
              </div>
              <button className="text-neutral-500 hover:text-white transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
            <DonutChart
              data={modelUsage}
              centerValue="6"
              centerLabel="Models"
              size={180}
            />
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-display font-semibold text-white text-lg">Content Types</h3>
                <p className="text-xs text-neutral-500">Generated content by category (premium tier)</p>
              </div>
              <button className="text-neutral-500 hover:text-white transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
            <BarChart data={contentTypes} height={200} />
          </div>
        </div>

        {/* Cost Analytics + Performance */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display font-semibold text-white text-lg">Revenue Analytics</h3>
                <p className="text-xs text-neutral-500">Cost savings from premium model routing</p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-secondary-400 rounded-full" />
                  <span className="text-neutral-400">Revenue ($)</span>
                </div>
              </div>
            </div>
            <AreaChart
              data={Array.from({ length: 14 }, (_, i) => Math.floor(280 + Math.sin(i / 2) * 80 + i * 8 + Math.random() * 60))}
              labels={Array.from({ length: 14 }, (_, i) => `Day ${i + 1}`)}
              height={220}
              color="#00f5b8"
              gradientId="premiumCostArea"
            />
          </div>

          <div className="card p-6">
            <h3 className="font-display font-semibold text-white text-lg mb-4">Performance</h3>
            <div className="space-y-4">
              {[
                { label: 'Success Rate', value: 99.8, max: 100, suffix: '%', color: 'bg-success-500' },
                { label: 'Cache Hit Rate', value: 91, max: 100, suffix: '%', color: 'bg-primary-500' },
                { label: 'API Uptime', value: 99.99, max: 100, suffix: '%', color: 'bg-secondary-500' },
                { label: 'Error Rate', value: 0.2, max: 100, suffix: '%', color: 'bg-error-500' },
              ].map((metric) => (
                <div key={metric.label}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-neutral-400">{metric.label}</span>
                    <span className="text-white font-mono">{metric.value}{metric.suffix}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-neutral-800 overflow-hidden">
                    <div
                      className={`h-full ${metric.color} rounded-full transition-all duration-1000`}
                      style={{ width: `${(metric.value / metric.max) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-800">
              <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
                <Shield className="w-3.5 h-3.5" />
                Premium Infrastructure
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'API', status: 'ok' },
                  { label: 'RAG', status: 'ok' },
                  { label: 'Queue', status: 'ok' },
                ].map((s) => (
                  <div key={s.label} className="flex items-center gap-1.5">
                    <span className="status-dot bg-success-500" />
                    <span className="text-xs text-neutral-400">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Table */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-semibold text-white text-lg">Recent Activity</h3>
              <p className="text-xs text-neutral-500">Latest generation requests across all premium models</p>
            </div>
            <button className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1 transition-colors">
              View All
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-neutral-800 text-left">
                  <th className="pb-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                  <th className="pb-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Model</th>
                  <th className="pb-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Action</th>
                  <th className="pb-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Tokens</th>
                  <th className="pb-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Time</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((act, i) => (
                  <tr key={i} className="border-b border-neutral-800/50 hover:bg-neutral-800/20 transition-colors">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        {act.status === 'completed' && <CheckCircle className="w-4 h-4 text-success-400" />}
                        {act.status === 'processing' && <Loader className="w-4 h-4 text-warning-400 animate-spin-slow" />}
                        {act.status === 'failed' && <AlertCircle className="w-4 h-4 text-error-400" />}
                        <span className={`text-xs capitalize ${
                          act.status === 'completed' ? 'text-success-400' :
                          act.status === 'processing' ? 'text-warning-400' : 'text-error-400'
                        }`}>
                          {act.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="text-sm text-neutral-300 font-mono">{act.model}</span>
                    </td>
                    <td className="py-3">
                      <span className="text-sm text-neutral-300">{act.action}</span>
                    </td>
                    <td className="py-3">
                      <span className="text-sm text-neutral-400 font-mono">
                        {act.tokens > 0 ? act.tokens.toLocaleString() : '—'}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="text-sm text-neutral-500">{act.time}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Premium features spotlight */}
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          {[
            { icon: Rocket, title: 'Priority Processing', desc: 'Your requests are routed through dedicated premium infrastructure with zero queue delays.' },
            { icon: Database, title: 'Custom RAG Stores', desc: 'Up to 1TB of managed vector storage with hybrid search and context-aware retrieval.' },
            { icon: Cpu, title: 'Fine-Tuned Models', desc: 'Deploy custom models trained on your data with one-click versioning and rollback.' },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="card p-5 border-primary-500/15">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500/15 to-secondary-500/15 border border-primary-500/20 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-primary-400" />
                </div>
                <h4 className="font-display font-semibold text-white text-sm mb-1">{item.title}</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
