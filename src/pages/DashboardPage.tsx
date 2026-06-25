import { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Zap,
  DollarSign,
  Clock,
  Cpu,
  Users,
  ArrowUpRight,
  Filter,
  Download,
  Bell,
  Search,
  MoreHorizontal,
  CheckCircle,
  AlertCircle,
  Loader,
  Crown,
  ArrowRight as ArrowRightIcon,
} from 'lucide-react';
import AreaChart from '../components/AreaChart';
import BarChart from '../components/BarChart';
import DonutChart from '../components/DonutChart';
import LiveChart from '../components/LiveChart';
import Counter from '../components/Counter';
import { useRouter } from '../router';

type TimeRange = '24h' | '7d' | '30d' | '90d';

export default function DashboardPage() {
  const { navigate } = useRouter();
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');
  const [liveValue, setLiveValue] = useState(847);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveValue((prev) => Math.max(400, Math.min(1200, prev + Math.floor((Math.random() - 0.5) * 60))));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Generate chart data based on time range
  const tokenData: Record<TimeRange, number[]> = {
    '24h': Array.from({ length: 24 }, (_, i) => Math.floor(300 + Math.sin(i / 3) * 150 + Math.random() * 100 + i * 10)),
    '7d': Array.from({ length: 7 }, (_, i) => Math.floor(1200 + Math.sin(i) * 400 + Math.random() * 300)),
    '30d': Array.from({ length: 30 }, (_, i) => Math.floor(800 + Math.sin(i / 4) * 300 + Math.cos(i / 2) * 200 + Math.random() * 250)),
    '90d': Array.from({ length: 90 }, (_, i) => Math.floor(600 + Math.sin(i / 8) * 400 + i * 5 + Math.random() * 200)),
  };

  const tokenLabels: Record<TimeRange, string[]> = {
    '24h': Array.from({ length: 24 }, (_, i) => `${i}:00`),
    '7d': ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    '30d': Array.from({ length: 30 }, (_, i) => `${i + 1}`),
    '90d': Array.from({ length: 90 }, (_, i) => (i % 10 === 0 ? `Day ${i + 1}` : '')),
  };

  const kpis = [
    {
      label: 'Total Tokens',
      value: 1284739,
      change: 12.5,
      icon: Zap,
      color: 'text-primary-400',
      bg: 'bg-primary-500/10',
      decimals: 0,
    },
    {
      label: 'Revenue',
      value: 8429,
      change: 8.2,
      icon: DollarSign,
      color: 'text-success-400',
      bg: 'bg-success-500/10',
      prefix: '$',
    },
    {
      label: 'Avg Latency',
      value: 42,
      change: -5.3,
      icon: Clock,
      color: 'text-accent-400',
      bg: 'bg-accent-500/10',
      suffix: 'ms',
    },
    {
      label: 'Active Users',
      value: 3847,
      change: 23.1,
      icon: Users,
      color: 'text-secondary-400',
      bg: 'bg-secondary-500/10',
    },
  ];

  const modelUsage = [
    { label: 'Claude Sonnet 4', value: 45, color: '#4dc3ff' },
    { label: 'GPT-4o', value: 28, color: '#00f5b8' },
    { label: 'Llama 3.1 405B', value: 15, color: '#ffb74d' },
    { label: 'Mistral Large', value: 8, color: '#f59000' },
    { label: 'Other', value: 4, color: '#94a3b8' },
  ];

  const contentTypes = [
    { label: 'Blog', value: 3200, color: '#4dc3ff' },
    { label: 'Social', value: 2800, color: '#00f5b8' },
    { label: 'Email', value: 1900, color: '#ffb74d' },
    { label: 'Docs', value: 1500, color: '#f59000' },
    { label: 'Code', value: 1100, color: '#007acc' },
    { label: 'Product', value: 800, color: '#00cc94' },
  ];

  const recentActivity = [
    { type: 'success', model: 'Claude Sonnet 4', action: 'Generated blog post draft', tokens: 2840, time: '2 min ago', status: 'completed' },
    { type: 'success', model: 'GPT-4o', action: 'Processed email campaign', tokens: 1520, time: '8 min ago', status: 'completed' },
    { type: 'loading', model: 'Llama 3.1', action: 'Generating documentation set', tokens: 0, time: '12 min ago', status: 'processing' },
    { type: 'success', model: 'Claude Sonnet 4', action: 'Completed social media batch', tokens: 980, time: '18 min ago', status: 'completed' },
    { type: 'error', model: 'Mistral Large', action: 'Translation request failed', tokens: 0, time: '25 min ago', status: 'failed' },
    { type: 'success', model: 'GPT-4o', action: 'Code documentation generated', tokens: 3120, time: '34 min ago', status: 'completed' },
    { type: 'success', model: 'Claude Sonnet 4', action: 'Product descriptions batch', tokens: 1840, time: '42 min ago', status: 'completed' },
  ];

  const isPositive = (change: number) => change > 0;

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="font-display text-3xl font-bold text-white">Analytics Dashboard</h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success-500/10 border border-success-500/20">
                <span className="status-dot bg-success-500 animate-pulse" />
                <span className="text-xs text-success-400 font-medium">Live</span>
              </span>
            </div>
            <p className="text-neutral-500">Monitor your AI content performance in real time</p>
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
          <button className="hidden sm:flex btn-ghost px-4 py-2 rounded-lg items-center gap-2 text-sm">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Upgrade Banner */}
        <div className="card p-6 mb-6 border-primary-500/20 relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-primary-500/10 rounded-full blur-[60px]" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-secondary-500/10 rounded-full blur-[60px]" />
          <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500 flex items-center justify-center shrink-0 shadow-lg shadow-primary-500/20">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-white">Unlock the Premium Dashboard</h3>
                <p className="text-sm text-neutral-400">Get unlimited tokens, all model providers, and real-time analytics.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="font-display text-2xl font-bold text-white">$42<span className="text-sm text-neutral-500">/month</span></div>
                <div className="text-xs text-success-400">7-day free trial</div>
              </div>
              <button
                onClick={() => navigate('/checkout')}
                className="btn-primary px-6 py-3 rounded-xl text-sm flex items-center gap-2 group whitespace-nowrap"
              >
                Upgrade Now
                <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
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
                  <Counter
                    value={kpi.value}
                    prefix={kpi.prefix}
                    suffix={kpi.suffix}
                    decimals={kpi.decimals || 0}
                  />
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
                <h3 className="font-display font-semibold text-white text-lg">Token Usage</h3>
                <p className="text-xs text-neutral-500">Total tokens generated over time</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-primary-400 rounded-full" />
                  <span className="text-neutral-400">Tokens</span>
                </div>
              </div>
            </div>
            <AreaChart
              data={tokenData[timeRange]}
              labels={tokenLabels[timeRange]}
              height={280}
              color="#4dc3ff"
              gradientId="tokenArea"
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
                <div className="font-mono text-sm text-white">1,240 tok/s</div>
              </div>
              <div>
                <div className="text-xs text-neutral-500">Avg Today</div>
                <div className="font-mono text-sm text-white">847 tok/s</div>
              </div>
            </div>
          </div>
        </div>

        {/* Second row: Model usage + Content types */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-display font-semibold text-white text-lg">Model Distribution</h3>
                <p className="text-xs text-neutral-500">Usage by AI model provider</p>
              </div>
              <button className="text-neutral-500 hover:text-white transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
            <DonutChart
              data={modelUsage}
              centerValue="5"
              centerLabel="Models"
              size={180}
            />
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-display font-semibold text-white text-lg">Content Types</h3>
                <p className="text-xs text-neutral-500">Generated content by category</p>
              </div>
              <button className="text-neutral-500 hover:text-white transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
            <BarChart data={contentTypes} height={200} />
          </div>
        </div>

        {/* Cost Analytics */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display font-semibold text-white text-lg">Cost Breakdown</h3>
                <p className="text-xs text-neutral-500">Daily spend across all providers</p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-secondary-400 rounded-full" />
                  <span className="text-neutral-400">Cost ($)</span>
                </div>
              </div>
            </div>
            <AreaChart
              data={Array.from({ length: 14 }, (_, i) => Math.floor(120 + Math.sin(i / 2) * 40 + i * 3 + Math.random() * 30))}
              labels={Array.from({ length: 14 }, (_, i) => `Day ${i + 1}`)}
              height={220}
              color="#00f5b8"
              gradientId="costArea"
            />
          </div>

          {/* Performance metrics */}
          <div className="card p-6">
            <h3 className="font-display font-semibold text-white text-lg mb-4">Performance</h3>
            <div className="space-y-4">
              {[
                { label: 'Success Rate', value: 98.6, max: 100, suffix: '%', color: 'bg-success-500' },
                { label: 'Cache Hit Rate', value: 72, max: 100, suffix: '%', color: 'bg-primary-500' },
                { label: 'API Uptime', value: 99.99, max: 100, suffix: '%', color: 'bg-secondary-500' },
                { label: 'Error Rate', value: 1.4, max: 100, suffix: '%', color: 'bg-error-500' },
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
                <Cpu className="w-3.5 h-3.5" />
                Infrastructure Status
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'API', status: 'ok' },
                  { label: 'RAG', status: 'ok' },
                  { label: 'Queue', status: 'warn' },
                ].map((s) => (
                  <div key={s.label} className="flex items-center gap-1.5">
                    <span className={`status-dot ${s.status === 'ok' ? 'bg-success-500' : 'bg-warning-500'}`} />
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
              <p className="text-xs text-neutral-500">Latest generation requests and their status</p>
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
      </div>
    </div>
  );
}
