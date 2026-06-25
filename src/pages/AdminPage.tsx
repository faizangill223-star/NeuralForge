import { useState, useEffect } from 'react';
import {
  Lock,
  Shield,
  Save,
  Check,
  Loader2,
  AlertCircle,
  Users,
  MessageSquare,
  Settings as SettingsIcon,
  CreditCard,
  Key,
  Phone,
  Crown,
  Trash2,
  RefreshCw,
  Eye,
  EyeOff,
  ExternalLink,
  LogOut,
} from 'lucide-react';
import { useSettings, type AppSettings } from '../lib/settings';

const ADMIN_PASSWORD = 'NomanDeveloper2026@';
const ADMIN_USERNAME = 'noman';

type AdminTab = 'settings' | 'users' | 'messages';

interface ManagedUser {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  is_premium: boolean;
  signup_date: string;
}

interface ContactMsg {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

export default function AdminPage() {
  const { settings, refresh } = useSettings();
  const [authed, setAuthed] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [tab, setTab] = useState<AdminTab>('settings');

  // Settings form state
  const [form, setForm] = useState<AppSettings>(settings);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [showKeys, setShowKeys] = useState(false);

  // Users
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);

  // Messages
  const [messages, setMessages] = useState<ContactMsg[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setAuthed(true);
      setLoginError('');
    } else {
      setLoginError('Invalid credentials. Access denied.');
    }
  };

  const getFunctionUrl = (slug: string) =>
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/${slug}`;

  const saveSettings = async () => {
    setSaving(true);
    setSaveMsg('');
    try {
      const response = await fetch(getFunctionUrl('admin-api?action=update_settings'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'X-Admin-Password': ADMIN_PASSWORD,
        },
        body: JSON.stringify(form),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to save settings');
      }
      await refresh();
      setSaveMsg('Settings saved successfully. Frontend updated.');
      setTimeout(() => setSaveMsg(''), 3000);
    } catch (err) {
      setSaveMsg(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  const loadUsers = async () => {
    setUsersLoading(true);
    try {
      const response = await fetch(getFunctionUrl('admin-api?action=list_users'), {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'X-Admin-Password': ADMIN_PASSWORD,
        },
      });
      if (!response.ok) throw new Error('Failed to load users');
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setUsersLoading(false);
    }
  };

  const togglePremium = async (userId: string, currentPremium: boolean) => {
    try {
      await fetch(getFunctionUrl('admin-api?action=toggle_premium'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'X-Admin-Password': ADMIN_PASSWORD,
        },
        body: JSON.stringify({ user_id: userId, is_premium: !currentPremium }),
      });
      setUsers((prev) =>
        prev.map((u) => (u.user_id === userId ? { ...u, is_premium: !currentPremium } : u))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const loadMessages = async () => {
    setMessagesLoading(true);
    try {
      const response = await fetch(getFunctionUrl('admin-api?action=list_messages'), {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'X-Admin-Password': ADMIN_PASSWORD,
        },
      });
      if (!response.ok) throw new Error('Failed to load messages');
      const data = await response.json();
      setMessages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setMessagesLoading(false);
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      await fetch(getFunctionUrl('admin-api?action=delete_message'), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'X-Admin-Password': ADMIN_PASSWORD,
        },
        body: JSON.stringify({ message_id: id }),
      });
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Login screen
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-16">
        <div className="absolute inset-0 bg-grid bg-grid-fade opacity-30" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-error-500/10 rounded-full blur-[120px]" />
        <div className="relative w-full max-w-md animate-scale-in">
          <div className="glass-strong rounded-2xl p-8 shadow-2xl border border-neutral-700/50">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-error-500 to-accent-600 mb-4 shadow-lg shadow-error-500/20">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="font-display text-2xl font-bold text-white mb-1">Admin Control Panel</h1>
              <p className="text-sm text-neutral-400">Restricted access. Authorized personnel only.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">Admin Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter admin username"
                  className="input-field w-full px-4 py-3 text-sm"
                  autoComplete="off"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">Admin Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="input-field w-full px-4 py-3 text-sm"
                  autoComplete="off"
                />
              </div>

              {loginError && (
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-error-500/10 border border-error-500/20">
                  <AlertCircle className="w-4 h-4 text-error-400 shrink-0" />
                  <p className="text-xs text-error-400">{loginError}</p>
                </div>
              )}

              <button
                type="submit"
                className="btn-primary w-full py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Authenticate
              </button>
            </form>

            <div className="mt-6 p-3 rounded-lg bg-error-500/5 border border-error-500/15 flex items-start gap-2">
              <AlertCircle className="w-3.5 h-3.5 text-error-400 shrink-0 mt-0.5" />
              <p className="text-xs text-neutral-500 leading-relaxed">
                This is a secure area. All access attempts are logged. Unauthorized access is prohibited.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-error-500 to-accent-600 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-white">Admin Control Panel</h1>
              <p className="text-sm text-neutral-500">Manage application settings, users, and messages</p>
            </div>
          </div>
          <button
            onClick={() => setAuthed(false)}
            className="btn-ghost px-4 py-2.5 rounded-lg text-sm flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Lock Panel
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 glass rounded-xl mb-6 w-fit">
          {([
            { id: 'settings' as const, icon: SettingsIcon, label: 'Settings' },
            { id: 'users' as const, icon: Users, label: 'Users' },
            { id: 'messages' as const, icon: MessageSquare, label: 'Messages' },
          ]).map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setTab(t.id);
                if (t.id === 'users') loadUsers();
                if (t.id === 'messages') loadMessages();
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
                tab === t.id ? 'bg-primary-500/20 text-primary-400' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        {/* Settings Tab */}
        {tab === 'settings' && (
          <div className="space-y-6">
            {/* Payment Settings */}
            <div className="card p-6">
              <h3 className="font-display font-semibold text-white text-lg mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary-400" />
                Payment Configuration
              </h3>
              <p className="text-xs text-neutral-500 mb-4">
                These links and details automatically update the frontend pricing buttons and checkout page.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">Payment Gateway URL</label>
                  <input
                    type="text"
                    value={form.payment_gateway_url}
                    onChange={(e) => setForm({ ...form, payment_gateway_url: e.target.value })}
                    placeholder="https://checkout.stripe.com/..."
                    className="input-field w-full px-3 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">Gumroad Subscription Link</label>
                  <input
                    type="text"
                    value={form.gumroad_link}
                    onChange={(e) => setForm({ ...form, gumroad_link: e.target.value })}
                    placeholder="https://noman.gumroad.com/l/pro"
                    className="input-field w-full px-3 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">EasyPaisa Details</label>
                  <textarea
                    value={form.easypaisa_details}
                    onChange={(e) => setForm({ ...form, easypaisa_details: e.target.value })}
                    placeholder="Account: 0300-1234567&#10;Title: Noman Developer"
                    rows={2}
                    className="input-field w-full px-3 py-2.5 text-sm resize-none scrollbar-thin"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">JazzCash Details</label>
                  <textarea
                    value={form.jazzcash_details}
                    onChange={(e) => setForm({ ...form, jazzcash_details: e.target.value })}
                    placeholder="Account: 0300-1234567&#10;Title: Noman Developer"
                    rows={2}
                    className="input-field w-full px-3 py-2.5 text-sm resize-none scrollbar-thin"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">Bank Account Details</label>
                  <textarea
                    value={form.bank_account_details}
                    onChange={(e) => setForm({ ...form, bank_account_details: e.target.value })}
                    placeholder="Bank: HBL&#10;Account Title: Noman Developer&#10;Account No: 1234-5678901-001&#10;IBAN: PK36HABB000012345678901"
                    rows={3}
                    className="input-field w-full px-3 py-2.5 text-sm resize-none scrollbar-thin"
                  />
                </div>
              </div>
            </div>

            {/* AI API Keys */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold text-white text-lg flex items-center gap-2">
                  <Key className="w-5 h-5 text-secondary-400" />
                  AI API Keys
                </h3>
                <button
                  onClick={() => setShowKeys(!showKeys)}
                  className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  {showKeys ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  {showKeys ? 'Hide' : 'Show'} Keys
                </button>
              </div>
              <p className="text-xs text-neutral-500 mb-4">
                These keys are used by the AI generation engine. They are stored securely and never exposed to the frontend.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">OpenAI API Key</label>
                  <input
                    type={showKeys ? 'text' : 'password'}
                    value={form.openai_api_key}
                    onChange={(e) => setForm({ ...form, openai_api_key: e.target.value })}
                    placeholder="sk-..."
                    className="input-field w-full px-3 py-2.5 text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">Gemini API Key</label>
                  <input
                    type={showKeys ? 'text' : 'password'}
                    value={form.gemini_api_key}
                    onChange={(e) => setForm({ ...form, gemini_api_key: e.target.value })}
                    placeholder="AIza..."
                    className="input-field w-full px-3 py-2.5 text-sm font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Contact & WhatsApp */}
            <div className="card p-6">
              <h3 className="font-display font-semibold text-white text-lg mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5 text-accent-400" />
                Contact & WhatsApp Configuration
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">WhatsApp Number</label>
                  <input
                    type="text"
                    value={form.whatsapp_number}
                    onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })}
                    placeholder="923000000000"
                    className="input-field w-full px-3 py-2.5 text-sm font-mono"
                  />
                  <p className="text-xs text-neutral-600 mt-1">Used by the floating WhatsApp button (digits only, with country code)</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">Contact Email</label>
                  <input
                    type="email"
                    value={form.contact_email}
                    onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
                    placeholder="support@neuralforge.io"
                    className="input-field w-full px-3 py-2.5 text-sm"
                  />
                  <p className="text-xs text-neutral-600 mt-1">Receives contact form submissions</p>
                </div>
              </div>
            </div>

            {/* Save bar */}
            <div className="flex items-center justify-between gap-4 p-4 glass rounded-xl sticky bottom-4">
              {saveMsg && (
                <div className={`flex items-center gap-2 text-sm ${saveMsg.startsWith('Error') ? 'text-error-400' : 'text-success-400'}`}>
                  {saveMsg.startsWith('Error') ? <AlertCircle className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                  {saveMsg}
                </div>
              )}
              <div className="flex items-center gap-3 ml-auto">
                <button
                  onClick={() => setForm(settings)}
                  className="btn-ghost px-4 py-2.5 rounded-lg text-sm flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reset
                </button>
                <button
                  onClick={saveSettings}
                  disabled={saving}
                  className="btn-primary px-6 py-2.5 rounded-lg text-sm flex items-center gap-2 disabled:opacity-60"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save All Settings
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {tab === 'users' && (
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display font-semibold text-white text-lg">Registered Users</h3>
                <p className="text-xs text-neutral-500">View and manage user premium status</p>
              </div>
              <button
                onClick={loadUsers}
                className="btn-ghost px-3 py-2 rounded-lg text-sm flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>

            {usersLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 text-primary-400 animate-spin" />
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-12 text-neutral-500">
                <Users className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No users registered yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full min-w-[700px]">
                  <thead>
                    <tr className="border-b border-neutral-800 text-left">
                      <th className="pb-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">User</th>
                      <th className="pb-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Email</th>
                      <th className="pb-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Signup Date</th>
                      <th className="pb-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                      <th className="pb-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.user_id} className="border-b border-neutral-800/50 hover:bg-neutral-800/20 transition-colors">
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center text-xs font-bold text-white">
                              {(u.full_name || u.email || '?')[0].toUpperCase()}
                            </div>
                            <span className="text-sm text-neutral-300">{u.full_name || 'No name'}</span>
                          </div>
                        </td>
                        <td className="py-3 text-sm text-neutral-400 font-mono">{u.email}</td>
                        <td className="py-3 text-sm text-neutral-500">
                          {new Date(u.signup_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </td>
                        <td className="py-3">
                          {u.is_premium ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-500/15 text-primary-400 text-xs font-medium">
                              <Crown className="w-3 h-3" /> Pro
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400 text-xs font-medium">
                              Free
                            </span>
                          )}
                        </td>
                        <td className="py-3">
                          <button
                            onClick={() => togglePremium(u.user_id, u.is_premium)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                              u.is_premium
                                ? 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                                : 'bg-primary-500/15 text-primary-400 hover:bg-primary-500/25'
                            }`}
                          >
                            {u.is_premium ? 'Revoke Pro' : 'Grant Pro'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Messages Tab */}
        {tab === 'messages' && (
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display font-semibold text-white text-lg">Contact Messages</h3>
                <p className="text-xs text-neutral-500">Submissions from the contact form</p>
              </div>
              <button
                onClick={loadMessages}
                className="btn-ghost px-3 py-2 rounded-lg text-sm flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>

            {messagesLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 text-primary-400 animate-spin" />
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-12 text-neutral-500">
                <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No messages received yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div key={msg.id} className="p-4 rounded-lg bg-neutral-900/50 border border-neutral-800/50">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-white text-sm">{msg.name}</span>
                          <a
                            href={`mailto:${msg.email}`}
                            className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-0.5"
                          >
                            {msg.email}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        {msg.subject && (
                          <div className="text-xs text-neutral-500 mb-1">Subject: {msg.subject}</div>
                        )}
                        <p className="text-sm text-neutral-300 leading-relaxed mt-2">{msg.message}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-neutral-600">
                          {new Date(msg.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <button
                          onClick={() => deleteMessage(msg.id)}
                          className="p-1.5 text-neutral-500 hover:text-error-400 rounded-lg hover:bg-error-500/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
