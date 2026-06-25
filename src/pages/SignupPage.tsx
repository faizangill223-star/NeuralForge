import { useState } from 'react';
import {
  Sparkles,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '../lib/auth';
import { useRouter } from '../router';

export default function SignupPage() {
  const { signUp } = useAuth();
  const { navigate } = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      setLoading(false);
      return;
    }

    const { error } = await signUp(email, password, fullName);
    setLoading(false);

    if (error) {
      if (error.includes('already')) {
        setError('An account with this email already exists. Please sign in instead.');
      } else {
        setError(error);
      }
    } else {
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 1500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16">
      <div className="absolute inset-0 bg-grid bg-grid-fade opacity-30" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary-500/10 rounded-full blur-[120px]" />

      <div className="relative w-full max-w-md animate-scale-in">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>

        <div className="glass-strong rounded-2xl p-8 shadow-2xl border border-neutral-700/50">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-600 mb-4 shadow-lg shadow-primary-500/20">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h1 className="font-display text-2xl font-bold text-white mb-1">Create your account</h1>
            <p className="text-sm text-neutral-400">Start generating intelligent content in seconds</p>
          </div>

          {success && (
            <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-success-500/10 border border-success-500/20 mb-5 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-success-400 shrink-0 mt-0.5" />
              <p className="text-xs text-success-400">Account created! Redirecting to your dashboard...</p>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-error-500/10 border border-error-500/20 mb-5 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-error-400 shrink-0 mt-0.5" />
              <p className="text-xs text-error-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Jane Developer"
                  className="input-field w-full pl-10 pr-4 py-3 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="input-field w-full pl-10 pr-4 py-3 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="input-field w-full pl-10 pr-10 py-3 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-neutral-400 mt-6">
            Already have an account?{' '}
            <button onClick={() => navigate('/')} className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
              Sign in
            </button>
          </p>

          <p className="text-center text-xs text-neutral-600 mt-4">
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
